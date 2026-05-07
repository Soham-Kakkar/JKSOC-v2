import { prisma } from '../lib/prisma'

export const findUserByGithubId = async (githubId: bigint) => {
  return prisma.user.findUnique({
    where: { githubId },
    include: {
      roles: {
        include: {
          role: true,
        },
      },
    },
  })
}

export const createUser = async (githubId: bigint, githubUsername: string) => {
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
            connect: { name: "CONTRIBUTOR" }, // seed role
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
