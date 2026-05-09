import { prisma } from '../lib/prisma'

export const normalizeRepoUrl = (raw: string): string | null => {
  if (!raw) return null
  let u = raw.trim().toLowerCase()
  u = u.replace(/\.git$/i, '')
  u = u.replace(/^https?:\/\//, '')
  u = u.replace(/^www\./, '')
  u = u.replace(/\/+$/, '')

  if (!u.startsWith('github.com/')) return null

  const parts = u.split('/')
  if (parts.length !== 3) return null

  return `github.com/${parts[1]}/${parts[2]}`
}

export const createRepository = async (repoUrl: string, userId: number) => {
  return prisma.repository.create({
    data: {
      repoUrl,
      status: 'PENDING',
      createdBy: userId,
    },
  })
}

export const findRepositoryById = async (id: number) => {
  return prisma.repository.findUnique({ where: { id } })
}

export const approveRepository = async (id: number) => {
  return prisma.repository.update({
    where: { id },
    data: { status: 'APPROVED' },
  })
}
