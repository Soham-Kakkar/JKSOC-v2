import { Card, CardContent } from '@/components/ui/card'
import { Separator } from '@/components/ui/separator'

export const metadata = {
  title: 'Privacy Policy — JKSoC',
}

export default function PrivacyPage() {
  return (
    <main className="mx-auto max-w-5xl px-6 py-12">
      <section className="space-y-5">

        <div className="space-y-3">
          <h1 className="text-5xl font-black tracking-tight">
            Privacy Policy
          </h1>

          <p className="text-muted-foreground text-lg max-w-3xl leading-relaxed">
            We only collect the information needed to run JKSoC smoothly —
            things like authentication, institute verification, repository
            submissions, and contribution tracking.
          </p>

          <p className="text-sm text-muted-foreground">
            Last updated: May 2026
          </p>
        </div>
      </section>

      <Separator className="my-10" />

      <div className="space-y-6">
        <Card className="border-border/60">
          <CardContent className="p-6 space-y-4">
            <h2 className="text-2xl font-bold">
              What Information We Collect
            </h2>

            <div className="space-y-4 text-muted-foreground leading-relaxed">
              <div>
                <h3 className="font-semibold text-foreground mb-1">
                  GitHub Account
                </h3>

                <p>
                  We use GitHub login to authenticate participants and connect
                  contributions to your profile.
                </p>
              </div>

              <div>
                <h3 className="font-semibold text-foreground mb-1">
                  Institute Verification
                </h3>

                <p>
                  Your institute email and institute name may be used for
                  verification and eligibility checks.
                </p>
              </div>

              <div>
                <h3 className="font-semibold text-foreground mb-1">
                  Participation Data
                </h3>

                <p>
                  We store repository submissions, pull requests, leaderboard
                  points, and related participation activity during the program.
                </p>
              </div>

              <div>
                <h3 className="font-semibold text-foreground mb-1">
                  Session & Technical Data
                </h3>

                <p>
                  Authentication tokens and basic technical information are used
                  to keep you signed in and maintain platform security.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-border/60">
          <CardContent className="p-6 space-y-4">
            <h2 className="text-2xl font-bold">
              How Your Data Is Used
            </h2>

            <ul className="space-y-3 text-muted-foreground leading-relaxed list-disc pl-5">
              <li>To authenticate users through GitHub</li>
              <li>To verify institute affiliation</li>
              <li>To process contributions and leaderboards</li>
              <li>To manage repository submissions and approvals</li>
              <li>To communicate important program updates</li>
            </ul>
          </CardContent>
        </Card>

        <Card className="border-border/60">
          <CardContent className="p-6 space-y-4">
            <h2 className="text-2xl font-bold">
              Data Sharing
            </h2>

            <p className="text-muted-foreground leading-relaxed">
              We do not sell your personal information.
            </p>

            <p className="text-muted-foreground leading-relaxed">
              Relevant data may be accessible to JKSoC organizers for moderation,
              verification, and prize distribution purposes. Public leaderboards
              may display usernames, scores, and contribution statistics.
            </p>
          </CardContent>
        </Card>

        <Card className="border-border/60">
          <CardContent className="p-6 space-y-4">
            <h2 className="text-2xl font-bold">
              Data Retention
            </h2>

            <p className="text-muted-foreground leading-relaxed">
              We retain participation and profile data for as long as necessary
              to operate JKSoC, distribute certificates or prizes, and maintain
              program records.
            </p>

            <p className="text-muted-foreground leading-relaxed">
              Participants may request deletion of their data after the program
              concludes, subject to administrative or legal requirements.
            </p>
          </CardContent>
        </Card>

        <Card className="border-border/60">
          <CardContent className="p-6 space-y-4">
            <h2 className="text-2xl font-bold">
              Security
            </h2>

            <p className="text-muted-foreground leading-relaxed">
              We take reasonable steps to protect user information and restrict
              access to administrative operations.
            </p>

            <p className="text-muted-foreground leading-relaxed">
              However, no online service can guarantee absolute security. If you
              discover a vulnerability or security concern, please contact the
              organizers responsibly.
            </p>
          </CardContent>
        </Card>

        <Card className="border-border/60">
          <CardContent className="p-6 space-y-4">
            <h2 className="text-2xl font-bold">
              Third-Party Services
            </h2>

            <p className="text-muted-foreground leading-relaxed">
              JKSoC uses GitHub OAuth for authentication. Additional services
              such as email providers or analytics tools may also be used to
              operate the platform.
            </p>

            <p className="text-muted-foreground leading-relaxed">
              These services are governed by their own privacy policies and
              terms.
            </p>
          </CardContent>
        </Card>

        <Card className="border-border/60 bg-muted/30">
          <CardContent className="p-6 space-y-4">
            <h2 className="text-2xl font-bold">
              Contact & Updates
            </h2>

            <p className="text-muted-foreground leading-relaxed">
              If you have questions, concerns, or privacy-related requests,
              please reach out to Coding Club IIT Jammu through the official
              communication channels listed on the platform.
            </p>

            <p className="text-sm text-muted-foreground">
              By participating in JKSoC, you acknowledge this privacy policy.
              This page may be updated occasionally, and the latest revision
              date will always be shown above.
            </p>
          </CardContent>
        </Card>
      </div>
    </main>
  )
}