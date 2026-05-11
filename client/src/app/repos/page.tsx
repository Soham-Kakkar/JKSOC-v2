"use client"

import { useEffect, useMemo, useState } from 'react'
import Link from 'next/link'
import { ExternalLink, Search } from 'lucide-react'
import { SiGithub } from 'react-icons/si'

import { apiFetch } from '@/lib/api'

import { Card, CardContent } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Separator } from '@/components/ui/separator'

type Repo = {
  id: number
  repoUrl: string
  description?: string
  creator?: {
    githubUsername?: string
  }
}

export default function RepositoriesPage() {
  const [repos, setRepos] = useState<Repo[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const [search, setSearch] = useState('')

  useEffect(() => {
    let mounted = true

    const load = async () => {
      setLoading(true)
      setError(null)

      try {
        const raw = localStorage.getItem('approved_repos_v1')

        if (raw) {
          const parsed = JSON.parse(raw)

          const age = Date.now() - (parsed.updatedAt || 0)
          const TTL = 1000 * 60 * 10

          if (parsed?.data && age < TTL) {
            setRepos(parsed.data)
            setLoading(false)
            return
          }
        }
      } catch (err) {
        console.warn('cache read failed', err)
      }

      try {
        const res = await apiFetch('/repos')

        if (!res.ok) {
          throw new Error('Failed to fetch repositories')
        }

        const data = await res.json()

        if (!mounted) return

        setRepos(data || [])

        try {
          localStorage.setItem(
            'approved_repos_v1',
            JSON.stringify({
              updatedAt: Date.now(),
              data,
            })
          )
        } catch (err) {
          console.warn('cache write failed', err)
        }
      } catch (err) {
        console.error(err)

        if (!mounted) return

        setError(
          err instanceof Error
            ? err.message
            : 'Failed to load repositories'
        )
      } finally {
        if (mounted) {
          setLoading(false)
        }
      }
    }

    load()

    return () => {
      mounted = false
    }
  }, [])

  const filteredRepos = useMemo(() => {
    const query = search.toLowerCase()

    return repos.filter((repo) => {
      return (
        repo.repoUrl.toLowerCase().includes(query) ||
        repo.description?.toLowerCase().includes(query) ||
        repo.creator?.githubUsername?.toLowerCase().includes(query)
      )
    })
  }, [repos, search])

  return (
    <main className="mx-auto max-w-7xl px-6 py-10">
      <section className="space-y-5">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
          <div className="space-y-3">

            <div className="space-y-2">
              <h1 className="text-5xl font-black tracking-tight">
                Repositories
              </h1>

              <p className="max-w-3xl text-lg text-muted-foreground leading-relaxed">
                Explore approved repositories participating in JK Summer of
                Code. Find projects to contribute to, discover maintainers,
                and start collaborating.
              </p>
            </div>
          </div>

          <div className="relative w-full lg:w-80">
            <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />

            <Input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search repositories..."
              className="pl-9"
            />
          </div>
        </div>
      </section>

      <Separator className="my-8" />

      <div className="mb-6 flex items-center justify-between">
        <p className="text-sm text-muted-foreground">
          Showing{' '}
          <span className="font-medium text-foreground">
            {filteredRepos.length}
          </span>{' '}
          {search && `for "${search}" in `}approved repositories
        </p>
      </div>

      {loading ? (
        <div className="flex items-center justify-center py-24">
          <div className="text-muted-foreground">
            Loading repositories...
          </div>
        </div>
      ) : error ? (
        <Card className="border-red-500/20 bg-red-500/5">
          <CardContent className="p-6">
            <p className="text-red-500">
              {error}
            </p>
          </CardContent>
        </Card>
      ) : filteredRepos.length === 0 ? (
        <Card className="border-none bg-transparent">
          <CardContent className="flex flex-col items-center justify-center py-20 text-center">
            <SiGithub className="mb-4 h-10 w-10 text-muted-foreground" />

            <h2 className="text-xl font-semibold">
              No repositories found
            </h2>

            <p className="mt-2 max-w-md text-sm text-muted-foreground">
              Try adjusting your search or check back later as more projects are
              approved for JKSoC.
            </p>
          </CardContent>
        </Card>
      ) : (
        <>
          <div className="flex flex-wrap gap-5 justify-center">
            {filteredRepos.map((repo) => (
              <Card
                key={repo.id}
                className="group w-full border-border/60 transition-all duration-200 hover:-translate-y-1 hover:shadow-lg md:w-[calc(50%-10px)] xl:w-[calc(33.333%-14px)]"
              >
                <CardContent className="flex h-full flex-col p-6">
                  <div className="mb-5 flex items-start justify-between gap-4">
                    <div className="space-y-2">
                      <Link
                        href={`https://${repo.repoUrl}`}
                        target="_blank"
                        rel="noreferrer"
                        className="block"
                      >
                        <h2 className="break-all text-lg font-semibold leading-snug transition-colors hover:text-primary hover:underline">
                          {repo.repoUrl.replace('github.com/', '')}
                        </h2>
                      </Link>
                    </div>

                    <SiGithub className="h-5 w-5 shrink-0 text-muted-foreground transition-colors group-hover:text-foreground" />
                  </div>

                  <p className="flex-1 text-sm leading-relaxed text-muted-foreground">
                    {repo.description ||
                      'No description has been added for this repository yet.'}
                  </p>

                  <div className="mt-6 flex items-center justify-between border-t pt-4">
                    <div className="space-y-1">
                      <div className="text-xs uppercase tracking-wide text-muted-foreground">
                        Maintainer
                      </div>

                      <Link
                        href={`https://github.com/${repo.creator?.githubUsername}`}
                        target="_blank"
                        rel="noreferrer"
                        className="text-sm font-medium hover:underline"
                      >
                        @{repo.creator?.githubUsername || 'unknown'}
                      </Link>
                    </div>

                    <Link
                      href={`https://${repo.repoUrl}`}
                      target="_blank"
                      rel="noreferrer"
                      className="flex items-center gap-2 text-sm font-medium text-primary transition-opacity hover:opacity-80"
                    >
                      View Repo
                      <ExternalLink className="h-4 w-4" />
                    </Link>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </>
      )}
    </main>
  )
}