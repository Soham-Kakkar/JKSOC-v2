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

export const createOrAttachOrganizer = async (opts: {
  githubUsername: string
  institute?: string | null
  instituteEmail?: string | null
}) => {
  const { githubUsername, institute, instituteEmail } = opts

  // ensure ORGANIZER role exists
  let role = await prisma.role.findUnique({ where: { name: 'ORGANIZER' } })
  if (!role) {
    role = await prisma.role.create({ data: { name: 'ORGANIZER' } })
  }

  // try to find existing user by instituteEmail or githubUsername
  let user = null
  if (instituteEmail) {
    user = await prisma.user.findFirst({ where: { instituteEmail } })
  }
  if (!user) {
    user = await prisma.user.findFirst({ where: { githubUsername } })
  }

  if (user) {
    const has = await prisma.userRole.findUnique({ where: { userId_roleId: { userId: user.id, roleId: role.id } } }).catch(() => null)
    if (!has) {
      await prisma.userRole.create({ data: { userId: user.id, roleId: role.id } })
    }
    return user
  }

  // Lookup canonical GitHub numeric id for the username
  const ghHeaders: Record<string, string> = { 'Accept': 'application/vnd.github+json' }
  if (process.env.GITHUB_TOKEN) {
    ghHeaders['Authorization'] = `token ${process.env.GITHUB_TOKEN}`
  }

  const ghRes = await fetch(`https://api.github.com/users/${encodeURIComponent(githubUsername)}`, { headers: ghHeaders })
  if (!ghRes.ok) {
    const errJson = await ghRes.json().catch(() => null)
    const msg = errJson?.message || ghRes.statusText
    throw new Error(`GitHub lookup failed: ${msg}`)
  }

  const ghData = await ghRes.json()
  if (!ghData?.id) {
    throw new Error('GitHub response did not contain an id')
  }

  const githubId = BigInt(ghData.id)

  const created = await prisma.user.create({
    data: {
      githubId,
      githubUsername,
      institute: institute || null,
      instituteEmail: instituteEmail || null,
      instituteVerified: false,
    },
  })

  await prisma.userRole.create({ data: { userId: created.id, roleId: role.id } })

  return created
}
