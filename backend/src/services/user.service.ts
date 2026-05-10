import { prisma } from '../lib/prisma'

export const findUserByGithubId = async (githubId: bigint) => {
  return prisma.user.findUnique({
    where: { githubId }
  })
}

export const createUser = async (
  githubId: bigint,
  githubUsername: string,
  requestedRoleName?: string
) => {
  // default to CONTRIBUTOR unless explicitly requestedRoleName === 'MAINTAINER'
  const roleToAssign = requestedRoleName === 'MAINTAINER' ? 'MAINTAINER' : 'CONTRIBUTOR'

  return prisma.user.create({
    data: {
      githubId,
      githubUsername,
      contributorStats: {
        create: {},
      },
      maintainerStats: {
        create: {},
      },
      roles: {
        create: {
          role: {
            connect: { name: roleToAssign }, // seed role
          },
        },
      },
    },
  })
}

export const findUserById = async (id: number) => {
  return prisma.user.findUnique({
    where: { id },
    include: {
      roles: {
        include: {
          role: true,
        },
      },
    },
  })
}

export const isUserMaintainer = async (id: number) => {
  const user = await prisma.user.findUnique({
    where: { id },
    include: { roles: { include: { role: true } } },
  })

  return !!(user?.roles || []).some(r => r.role?.name === 'MAINTAINER')
}

export const addRoleToUser = async (id: number, roleName: string) => {
  const role = await prisma.role.findUnique({ where: { name: roleName } })
  if (!role) throw new Error('role not found')

  return prisma.userRole.create({
    data: {
      userId: id,
      roleId: role.id,
    },
  })
}
