import passport from 'passport'
import { Strategy as GitHubStrategy } from 'passport-github2'
import * as userService from '../services/user.service'
import 'dotenv/config'

passport.use(
  new GitHubStrategy(
    {
      clientID: process.env.GITHUB_CLIENT_ID!,
      clientSecret: process.env.GITHUB_CLIENT_SECRET!,
      callbackURL: process.env.GITHUB_CALLBACK_URL!,
    },
    async (accessToken: string, refreshToken: string, profile: any, done: any) => {
      try {
        const githubId = BigInt(profile.id)
        const githubUsername = profile.username

        let user = await userService.findUserByGithubId(githubId)

        if (!user) {
          user = await userService.createUser(githubId, githubUsername)
        }

        return done(null, user)
      } catch (error) {
        return done(error, null)
      }
    }
  )
)

export default passport
