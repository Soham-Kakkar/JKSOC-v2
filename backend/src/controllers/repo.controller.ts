import { Request, Response } from 'express'
import * as repoService from '../services/repo.service'
import { getRepoDescription } from '../lib/ghCache'

export const submitRepo = async (req: Request, res: Response) => {
  const { repoUrl } = req.body
  const user = (req as any).user

  if (!repoUrl) {
    return res.status(400).json({ message: 'repoUrl is required' })
  }

  const normalized = repoService.normalizeRepoUrl(repoUrl)
  if (!normalized) {
    return res.status(400).json({ message: 'Invalid GitHub repo URL' })
  }

  // Check MAINTAINER role
  const hasMaintainer = (user.roles || []).some((r: any) => r.role?.name === 'MAINTAINER')
  if (!hasMaintainer) {
    return res.status(403).json({ message: 'Only maintainers can submit repositories' })
  }

  try {
    const repo = await repoService.createRepository(normalized, user.id)
    return res.status(201).json(repo)
  } catch (err: any) {
    // Handle unique constraint
    if (err?.code === 'P2002' || /unique/i.test(err?.message || '')) {
      return res.status(409).json({ message: 'Repository already submitted' })
    }
    console.error(err)
    return res.status(500).json({ message: 'Failed to submit repository' })
  }
}

export const approveRepo = async (req: Request, res: Response) => {
  const id = Number(req.params.id)
  const user = (req as any).user

  if (Number.isNaN(id)) {
    return res.status(400).json({ message: 'Invalid repository id' })
  }

  // Check ORGANIZER role
  const isOrganizer = (user.roles || []).some((r: any) => r.role?.name === 'ORGANIZER')
  if (!isOrganizer) {
    return res.status(403).json({ message: 'Only organizers can approve repositories' })
  }

  try {
    const repo = await repoService.findRepositoryById(id)
    if (!repo) return res.status(404).json({ message: 'Repository not found' })

    if (repo.status === 'APPROVED') {
      return res.json({ message: 'Repository already approved', repo })
    }

    const updated = await repoService.approveRepository(id)
    return res.json(updated)
  } catch (err) {
    console.error(err)
    return res.status(500).json({ message: 'Failed to approve repository' })
  }
}

export const getPendingRepos = async (req: Request, res: Response) => {
  const user = (req as any).user
  if (!user) return res.sendStatus(401)

  const isOrganizer = (user.roles || []).some((r: any) => r.role?.name === 'ORGANIZER')
  if (!isOrganizer) return res.status(403).json({ message: 'Only organizers can view pending repositories' })

  try {
    const repos = await repoService.findPendingRepositories()
    return res.json(repos)
  } catch (err) {
    console.error(err)
    return res.status(500).json({ message: 'Failed to load pending repositories' })
  }
}

export const getApprovedRepos = async (req: Request, res: Response) => {
  try {
    const repos = await repoService.findApprovedRepositories()
    // best-effort enrichment with caching and rate limiting
    const enhanced = await Promise.all(repos.map(async (r: any) => {
      try {
        const desc = await getRepoDescription(r.repoUrl)
        return { ...r, description: desc }
      } catch (err) {
        console.error('enrich failed', err)
        return { ...r, description: null }
      }
    }))

    // instruct clients to cache for short time
    res.setHeader('Cache-Control', 'public, max-age=300, stale-while-revalidate=600')
    return res.json(enhanced)
  } catch (err) {
    console.error(err)
    return res.status(500).json({ message: 'Failed to load approved repositories' })
  }
}
