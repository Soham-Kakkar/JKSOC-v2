"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";

export default function Home() {
  return (
    <div className="flex flex-col items-center w-full space-y-24">

      {/* HERO */}
      <section className="relative overflow-hidden rounded-2xl border bg-card shadow-sm p-10 md:p-16 text-center w-full max-w-6xl mx-auto">
        <div className="absolute inset-0 bg-linear-to-br from-primary/10 via-transparent to-secondary/10 pointer-events-none" />
        <div className="relative flex flex-col items-center space-y-6">
          <h1 className="text-3xl md:text-5xl font-bold tracking-tight leading-tight">
            Build. Contribute. Grow with <span className="text-primary">JKSoC</span>
          </h1>
          <span className="inline-flex items-center rounded-full border px-3 py-1 text-xs text-muted-foreground">
            All India Summer of Code Initiative by IIT Jammu
          </span>
          <p className="text-muted-foreground text-base md:text-lg leading-relaxed max-w-2xl">
            JKSoC connects students with real-world open-source projects across India.
            Apply with GitHub, verify your institute email, and start contributing to meaningful software.
          </p>
          <div className="flex flex-col sm:flex-row gap-3 pt-2 w-full sm:w-auto items-center justify-center">
            <Link href="/register" className="w-full sm:w-auto">
              <Button size="lg" className="w-full">Get Started</Button>
            </Link>
            <Link href="/leaderboard" className="w-full sm:w-auto">
              <Button size="lg" variant="outline" className="w-full">View Leaderboard</Button>
            </Link>
          </div>
        </div>
      </section>

      {/* FEATURE HIGHLIGHTS */}
      <section className="max-w-6xl w-full px-6 grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="flex flex-col p-6 text-center">
          <CardHeader>
            <CardTitle>Contribute</CardTitle>
            <CardDescription>Work on meaningful projects and sharpen your coding skills.</CardDescription>
          </CardHeader>
        </Card>
        <Card className="flex flex-col p-6 text-center">
          <CardHeader>
            <CardTitle>Learn</CardTitle>
            <CardDescription>Gain real-world experience and collaborate with open-source mentors.</CardDescription>
          </CardHeader>
        </Card>
        <Card className="flex flex-col p-6 text-center">
          <CardHeader>
            <CardTitle>Compete</CardTitle>
            <CardDescription>Track your progress, earn points, and get recognized on the leaderboard.</CardDescription>
          </CardHeader>
        </Card>
      </section>

      {/* GLIMPSES OF OTHER PAGES */}
      <section className="max-w-6xl w-full px-6 space-y-12">
        <h2 className="text-2xl font-bold text-center">Explore JKSoC</h2>
        <div className="flex flex-col md:flex-row gap-6 justify-center flex-wrap">
          <Card className="w-72 hover:scale-105 transition-transform duration-200 cursor-pointer">
            <CardHeader>
              <CardTitle><Link href="/repos">Repositories</Link></CardTitle>
              <CardDescription>Browse approved projects, submit your own repositories, and collaborate.</CardDescription>
            </CardHeader>
          </Card>

          <Card className="w-72 hover:scale-105 transition-transform duration-200 cursor-pointer">
            <CardHeader>
              <CardTitle><Link href="/leaderboard">Leaderboard</Link></CardTitle>
              <CardDescription>See top contributors, compare your progress, and stay motivated.</CardDescription>
            </CardHeader>
          </Card>

          <Card className="w-72 hover:scale-105 transition-transform duration-200 cursor-pointer">
            <CardHeader>
              <CardTitle><Link href="/profile">Profile</Link></CardTitle>
              <CardDescription>Track your contributions, earned roles, and submitted repositories.</CardDescription>
            </CardHeader>
          </Card>
        </div>
      </section>

      {/* IMPACT / NUMBERS */}
      {/* <section className="max-w-6xl w-full px-6 grid grid-cols-1 sm:grid-cols-3 gap-6 text-center">
        <Card className="p-6 border rounded-xl bg-card shadow-sm">
          <p className="text-3xl font-bold">100+</p>
          <p className="text-muted-foreground mt-1">Projects</p>
        </Card>
        <Card className="p-6 border rounded-xl bg-card shadow-sm">
          <p className="text-3xl font-bold">500+</p>
          <p className="text-muted-foreground mt-1">Contributors</p>
        </Card>
        <Card className="p-6 border rounded-xl bg-card shadow-sm">
          <p className="text-3xl font-bold">20+</p>
          <p className="text-muted-foreground mt-1">Institutes</p>
        </Card>
      </section> */}

      {/* FINAL CTA */}
      <section className="text-center space-y-6">
        <h2 className="text-3xl font-bold">Ready to join JKSoC?</h2>
        <p className="text-muted-foreground max-w-2xl mx-auto">
          Apply today and start contributing to open-source projects with students from across India.
        </p>
        <Link href="/register">
          <Button size="lg">Get Started</Button>
        </Link>
      </section>
    </div>
  );
}