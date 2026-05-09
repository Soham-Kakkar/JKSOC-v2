import 'dotenv/config'
import { prisma } from '../src/lib/prisma'
import readline from 'readline/promises'
import { stdin as input, stdout as output } from 'node:process'

function parseArgs() {
  const args = process.argv.slice(2)
  const out: Record<string, string> = {}
  for (const a of args) {
    if (a.startsWith('--')) {
      const [k, v] = a.slice(2).split('=')
      out[k] = v ?? ''
    }
  }
  return out
}

function validateEmail(email: string) {
  const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  return re.test(email)
}

function validateGithubUsername(u: string) {
  // GitHub usernames may contain alphanumeric and hyphens, 1-39 chars, no consecutive or trailing hyphens rules simplified
  const re = /^[A-Za-z0-9-]{1,39}$/
  return re.test(u)
}

async function main() {
  try {
    const args = parseArgs()
    const rl = readline.createInterface({ input, output })

    let githubUsername = args.github || args.githubUsername || args.u
    let institute = args.institute || args.org || args.i
    let instituteEmail = args.email || args.instituteEmail || args.e

    if (!githubUsername) {
      githubUsername = (await rl.question('GitHub username: ')).trim()
    }
    if (!validateGithubUsername(githubUsername)) {
      console.error('Invalid GitHub username. Allowed: letters, numbers, hyphens (1-39 chars).')
      process.exit(2)
    }

    if (!institute) {
      institute = (await rl.question('Institute name: ')).trim()
    }

    if (!instituteEmail) {
      instituteEmail = (await rl.question('Institute email: ')).trim()
    }

    if (instituteEmail && !validateEmail(instituteEmail)) {
      console.error('Invalid email format')
      process.exit(2)
    }

    rl.close()

    // Check if user exists by instituteEmail or githubUsername
    let user = null
    if (instituteEmail) {
      user = await prisma.user.findFirst({ where: { instituteEmail } })
    }
    if (!user) {
      user = await prisma.user.findFirst({ where: { githubUsername } })
    }

    // Ensure ORGANIZER role exists
    let role = await prisma.role.findUnique({ where: { name: 'ORGANIZER' } })
    if (!role) {
      role = await prisma.role.create({ data: { name: 'ORGANIZER' } })
      console.log('Created role ORGANIZER')
    }

    if (user) {
      console.log(`Found existing user (id=${user.id}, github=${user.githubUsername})`)
      // attach role if missing
      const has = await prisma.userRole.findUnique({ where: { userId_roleId: { userId: user.id, roleId: role.id } } }).catch(() => null)
      if (has) {
        console.log('User already has ORGANIZER role.')
      } else {
        await prisma.userRole.create({ data: { userId: user.id, roleId: role.id } })
        console.log('Attached ORGANIZER role to existing user.')
      }
      process.exit(0)
    }

    // Create a new user. githubId is required by schema; we generate a large unique BigInt.
    const githubId = BigInt(Date.now())

    const created = await prisma.user.create({
      data: {
        githubId,
        githubUsername,
        institute: institute || null,
        instituteEmail: instituteEmail || null,
        instituteVerified: true,
      }
    })

    await prisma.userRole.create({ data: { userId: created.id, roleId: role.id } })

    console.log(`Created ORGANIZER user id=${created.id} github=${created.githubUsername}`)
    process.exit(0)
  } catch (err) {
    console.error('Error:', err)
    process.exit(1)
  } finally {
    await prisma.$disconnect()
  }
}

main()
