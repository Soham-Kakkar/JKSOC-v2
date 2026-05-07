"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function Home() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-background font-sans px-6">
      <main className="w-full max-w-6xl">
        <section className="relative overflow-hidden rounded-2xl border bg-card shadow-sm p-10 md:p-16 text-center">
          
          {/* subtle background glow */}
          <div className="absolute inset-0 bg-gradient-to-br from-primary/10 via-transparent to-secondary/10 pointer-events-none" />

          <div className="relative flex flex-col items-center space-y-6">
            
            {/* badge */}
            <span className="inline-flex items-center rounded-full border px-3 py-1 text-xs text-muted-foreground">
              All India Summer of Code Initiative by IIT Jammu
            </span>

            {/* heading */}
            <h1 className="text-3xl md:text-5xl font-bold tracking-tight leading-tight">
              Build. Contribute. Grow with{" "}
              <span className="text-primary">JKSoC</span>
            </h1>

            {/* description */}
            <p className="text-muted-foreground text-base md:text-lg max-w-2xl leading-relaxed">
              JKSoC connects students with real-world open-source projects across India.
              Apply with GitHub, verify your institute email, and start contributing to meaningful software.
            </p>

            {/* buttons */}
            <div className="flex flex-col sm:flex-row gap-3 pt-2 items-center justify-center">
              <Link href="/register">
                <Button size="lg" className="w-full sm:w-auto">
                  Get Started
                </Button>
              </Link>

              <Link href="/leaderboard">
                <Button size="lg" variant="outline" className="w-full sm:w-auto">
                  View Leaderboard
                </Button>
              </Link>
            </div>

            {/* stats */}
            {/* <div className="pt-8 grid grid-cols-3 gap-6 text-center border-t w-full max-w-lg">
              <div>
                <p className="text-xl font-semibold">100+</p>
                <p className="text-xs text-muted-foreground">Projects</p>
              </div>
              <div>
                <p className="text-xl font-semibold">500+</p>
                <p className="text-xs text-muted-foreground">Contributors</p>
              </div>
              <div>
                <p className="text-xl font-semibold">20+</p>
                <p className="text-xs text-muted-foreground">Institutes</p>
              </div>
            </div> */}

          </div>
        </section>
      </main>
    </div>
  );
}