import fs from 'fs'
import path from 'path'
import 'dotenv/config'

type StoredValue =
  | string
  | null
  | { description: string | null; etag?: string | null }

type CacheEntry = {
  value: StoredValue
  expiresAt: number
}

const CACHE_DIR =
  process.env.GH_CACHE_DIR ||
  path.resolve(process.cwd(), '.gh_cache')

const CACHE_FILE = path.join(CACHE_DIR, 'repos.json')

const CACHE_TTL =
  Number(process.env.GH_CACHE_TTL_MS) ||
  1000 * 60 * 60 * 24 // 24h

const NULL_CACHE_TTL =
  Number(process.env.GH_NULL_CACHE_TTL_MS) ||
  1000 * 60 * 5 // 5m

const MAX_ENTRIES =
  Number(process.env.GH_CACHE_MAX_ENTRIES) ||
  2000

const RATE_LIMIT_PER_MIN =
  Number(process.env.GH_RATE_LIMIT_PER_MIN) ||
  60

// --------------------------------------------------
// MEMORY CACHE
// --------------------------------------------------

const memoryCache = new Map<string, CacheEntry>()

// dedupe concurrent fetches
const inflight = new Map<string, Promise<string | null>>()

// simple token bucket (single instance only)
let tokens = RATE_LIMIT_PER_MIN
let lastRefill = Date.now()

// prevent excessive disk writes
let dirty = false

// --------------------------------------------------
// STARTUP
// --------------------------------------------------

async function ensureDir() {
  await fs.promises.mkdir(CACHE_DIR, { recursive: true })
}

async function loadDiskCache() {
  await ensureDir()

  try {
    const raw = await fs.promises.readFile(CACHE_FILE, 'utf8')
    const parsed: Record<string, CacheEntry> = JSON.parse(raw)

    const now = Date.now()

    for (const [key, value] of Object.entries(parsed)) {
      if (value.expiresAt > now) {
        memoryCache.set(key, value)
      }
    }
  } catch {
    // ignore missing/corrupt cache
  }
}

// fire-and-forget startup
void loadDiskCache()

// --------------------------------------------------
// DISK PERSISTENCE
// --------------------------------------------------

async function persistCache() {
  if (!dirty) return

  dirty = false

  try {
    const obj = Object.fromEntries(memoryCache.entries())
    const tmp = `${CACHE_FILE}.tmp`
    await fs.promises.writeFile(tmp, JSON.stringify(obj), 'utf8')
    await fs.promises.rename(tmp, CACHE_FILE)
  } catch (err) {
    console.error('cache persist failed', err)
  }
}

// persist every 30s
const persistInterval = setInterval(() => void persistCache(), 30_000)
persistInterval.unref()

// cleanup expired entries every 10m
const cleanupInterval = setInterval(cleanupExpiredEntries, 10 * 60_000)
cleanupInterval.unref()

// persist on shutdown
process.on('SIGINT', async () => {
  await persistCache()
  process.exit(0)
})

process.on('SIGTERM', async () => {
  await persistCache()
  process.exit(0)
})

// --------------------------------------------------
// UTILITIES
// --------------------------------------------------

function normalizeRepoUrl(repoUrl: string) {
  const normalized = repoUrl
    .replace(/^https?:\/\//, '')
    .replace(/^www\./, '')
    .replace(/\/+$/, '')

  if (!normalized.startsWith('github.com/')) return null

  const parts = normalized.split('/')
  if (parts.length < 3) return null

  return {
    owner: parts[1],
    repo: parts[2],
    key: `${parts[1]}/${parts[2]}`.toLowerCase(),
  }
}

function refillTokens() {
  const now = Date.now()
  if (now - lastRefill >= 60_000) {
    tokens = RATE_LIMIT_PER_MIN
    lastRefill = now
  }
}

function tryConsumeToken() {
  refillTokens()
  if (tokens <= 0) return false
  tokens -= 1
  return true
}

function cleanupExpiredEntries() {
  const now = Date.now()

  for (const [key, entry] of memoryCache.entries()) {
    if (entry.expiresAt <= now) {
      memoryCache.delete(key)
      dirty = true
    }
  }

  // hard cap eviction
  if (memoryCache.size > MAX_ENTRIES) {
    const entries = [...memoryCache.entries()]
    entries.sort((a, b) => a[1].expiresAt - b[1].expiresAt)
    const removeCount = memoryCache.size - MAX_ENTRIES
    for (let i = 0; i < removeCount; i++) {
      memoryCache.delete(entries[i][0])
    }
    dirty = true
  }
}

// --------------------------------------------------
// GITHUB FETCH
// --------------------------------------------------

const FETCH_TIMEOUT_MS = Number(process.env.GH_FETCH_TIMEOUT_MS || 5000)

async function fetchGithubDescription(
  owner: string,
  repo: string,
  etag?: string
): Promise<{ description: string | null; etag?: string | null; notModified?: boolean } | null> {
  if (!tryConsumeToken()) return null

  try {
    const headers: Record<string, string> = {
      Accept: 'application/vnd.github+json',
      'User-Agent': 'gh-cache',
    }

    if (etag) headers['If-None-Match'] = etag
    if (process.env.GITHUB_TOKEN) {
      headers.Authorization = `Bearer ${process.env.GITHUB_TOKEN}`
    }

    const controller = new AbortController()
    const id = setTimeout(() => controller.abort(), FETCH_TIMEOUT_MS)

    const response = await fetch(
      `https://api.github.com/repos/${owner}/${repo}`,
      { headers, signal: controller.signal }
    )
    clearTimeout(id)

    if (response.status === 304) {
      const returnEtag = response.headers.get('etag') || etag || null
      return { description: null, etag: returnEtag, notModified: true }
    }

    if (!response.ok) return null

    const data = await response.json()
    const responseEtag = response.headers.get('etag') || null
    return { description: data.description || null, etag: responseEtag }
  } catch (err) {
    if ((err as any)?.name === 'AbortError') {
      console.warn('GitHub fetch timeout')
    } else {
      console.error('github fetch failed', err)
    }
    return null
  }
}

// --------------------------------------------------
// PUBLIC API
// --------------------------------------------------

export async function getRepoDescription(
  repoUrl: string
): Promise<string | null> {
  const parsed = normalizeRepoUrl(repoUrl)
  if (!parsed) return null

  const { owner, repo, key } = parsed
  const now = Date.now()

  // memory cache
  const cached = memoryCache.get(key)
  if (cached && cached.expiresAt > now) {
    const v = cached.value
    if (v && typeof v === 'object') return v.description
    return v
  }

  // dedupe concurrent fetches
  const existingInflight = inflight.get(key)
  if (existingInflight) return existingInflight

  const existingEtag = cached?.value && typeof cached.value === 'object' ? cached.value.etag ?? undefined : undefined

  const promise = (async () => {
    try {
      const res = await fetchGithubDescription(owner, repo, existingEtag)

      if (res === null) {
        if (cached) {
          const v = cached.value
          if (v && typeof v === 'object') return v.description
          return v
        }
        return null
      }

      if (res.notModified && cached) {
        const v = cached.value
        const ttl = v && typeof v === 'object' && 'description' in v ? CACHE_TTL : NULL_CACHE_TTL
        memoryCache.set(key, { value: v, expiresAt: Date.now() + ttl })
        dirty = true
        if (v && typeof v === 'object') return v.description
        return v
      }

      const ttl = res.description === null ? NULL_CACHE_TTL : CACHE_TTL
      const storeVal = { description: res.description, etag: res.etag }
      memoryCache.set(key, { value: storeVal, expiresAt: Date.now() + ttl })
      dirty = true
      return res.description
    } finally {
      inflight.delete(key)
    }
  })()

  inflight.set(key, promise)
  return promise
}

export async function clearGhCache() {
  memoryCache.clear()
  dirty = true
  await persistCache()
}

export function getCacheStats() {
  return {
    entries: memoryCache.size,
    inflight: inflight.size,
    tokens,
  }
}