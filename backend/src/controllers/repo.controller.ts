import { Request, Response } from 'express'
import * as repoService from '../services/repo.service'

export const submitRepo = async (req: Request, res: Response) => {
  const { repoUrl } = req.body
  const user = req.user as any

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
  const user = req.user as any

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
