import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Separator } from '@/components/ui/separator'
import AboutPageRegisterBtn from '@/components/aboutPageRegisterBtn'

export const metadata = {
  title: 'About — JKSoC',
}

export default function AboutPage() {

  return (
    <div className="mx-auto max-w-5xl px-6 py-12">
      <section className="text-center space-y-6">

        <div className="space-y-4">
          <h1 className="text-5xl font-black tracking-tight sm:text-6xl">
            JK Summer of Code
          </h1>

          <p className="mx-auto max-w-3xl text-lg text-muted-foreground leading-relaxed">
            JKSoC is an open-source summer program by Coding Club IIT Jammu
            where students across India collaborate on real projects, contribute
            to open source, and learn by building alongside maintainers and fellow
            developers.
          </p>
        </div>

        <Badge variant="outline" className="text-xl p-4">🏆 ₹10,000+ in prizes</Badge>
        <div className="flex flex-wrap items-center justify-center gap-3 text-md">
          <Badge variant="outline">📅 May - July 2026</Badge>
          <Badge variant="outline">💻 Open Source</Badge>
          <Badge variant="outline">🎓 Open to students across India</Badge>
        </div>
      </section>

      <AboutPageRegisterBtn />

      <Separator className="my-12" />

      <section className="flex flex-col md:flex-row justify-center gap-6">
        <Card className="border-border/60 shadow-sm max-w-2xl md:w-2/3">
          <CardContent className="p-6 space-y-4">
            <h2 className="text-2xl font-bold">What is JKSoC?</h2>

            <p className="text-muted-foreground leading-relaxed">
              JKSoC is designed to help students get started with open source in
              a practical and welcoming way. Instead of building isolated demo
              projects, participants contribute to repositories that are actively
              maintained and used by real communities.
            </p>

            <p className="text-muted-foreground leading-relaxed">
              Whether you are making your first pull request or already familiar
              with GitHub workflows, JKSoC gives you a space to learn, ship code,
              and connect with developers from across the country.
            </p>
          </CardContent>
        </Card>

        <Card className="border-border/60 shadow-sm md:w-1/3 max-w-2xl">
          <CardContent className="p-6 space-y-4">
            <h2 className="text-2xl font-bold">What You Get</h2>

            <ul className="space-y-3 text-muted-foreground list-disc">
              <li>Hands-on open-source experience</li>
              <li>Contributions on your GitHub profile</li>
              <li>Certificates and recognition</li>
              <li>Leaderboards, prizes, and community events</li>
              <li>A chance to work with maintainers and teams</li>
            </ul>
          </CardContent>
        </Card>
      </section>

      <section className="mt-14 space-y-6">
        <div className="space-y-3">
          <h2 className="text-3xl font-bold tracking-tight">
            How Participation Works
          </h2>

          <p className="text-muted-foreground max-w-3xl">
            The process is simple — pick projects, contribute consistently, and
            earn points as your pull requests get merged.
          </p>
        </div>

        <div className="grid gap-5 md:grid-cols-4">
          {[
            {
              step: '01',
              title: 'Register',
              description:
                'Sign in with GitHub and complete your profile.',
            },
            {
              step: '02',
              title: 'Explore Projects',
              description:
                'Browse approved repositories and find issues to work on.',
            },
            {
              step: '03',
              title: 'Contribute',
              description:
                'Submit pull requests and collaborate with maintainers.',
            },
            {
              step: '04',
              title: 'Earn Points',
              description:
                'Merged contributions count toward the leaderboard.',
            },
          ].map((item) => (
            <Card key={item.step} className="border-border/60">
              <CardContent className="p-6 space-y-3">
                <div className="text-sm font-semibold text-primary">
                  {item.step}
                </div>

                <h3 className="text-lg font-semibold">{item.title}</h3>

                <p className="text-sm text-muted-foreground leading-relaxed">
                  {item.description}
                </p>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

      <section className="mt-16 grid gap-6 md:grid-cols-2">
        <Card className="border-border/60">
          <CardContent className="p-6 space-y-4">
            <h2 className="text-2xl font-bold">For Contributors</h2>

            <p className="text-muted-foreground leading-relaxed">
              Contribute to issues tagged for JKSoC, improve your development
              workflow, and gain experience working in collaborative codebases.
            </p>

            <p className="text-muted-foreground leading-relaxed">
              Beginners are welcome — the goal is to learn, build consistently,
              and enjoy the process.
            </p>
          </CardContent>
        </Card>

        <Card className="border-border/60">
          <CardContent className="p-6 space-y-4">
            <h2 className="text-2xl font-bold">For Maintainers</h2>

            <p className="text-muted-foreground leading-relaxed">
              Maintainers can submit repositories for inclusion in JKSoC and
              collaborate with motivated student contributors throughout the
              program.
            </p>

            <p className="text-muted-foreground leading-relaxed">
              We encourage projects that are beginner-friendly, actively
              maintained, and meaningful to the open-source ecosystem.
            </p>
          </CardContent>
        </Card>
      </section>

      <section id="footer" className="mt-14 text-center text-sm text-muted-foreground space-y-2">
        <p>
          Organized by <span className="font-medium">Coding Club IIT Jammu</span>
        </p>

        <p>
          Participants are expected to maintain a respectful and collaborative
          environment throughout the program.
        </p>

        <p>
          Read our{' '}
          <a
            href="/privacy"
            className="text-primary underline underline-offset-4"
          >
            Privacy Policy
          </a>
          .
        </p>
      </section>
    </div>
  )
}