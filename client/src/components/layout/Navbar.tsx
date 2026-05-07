"use client"

import Link from "next/link";
import Image from "next/image";
import { Button } from "@/components/ui/button";

export default function Navbar() {
  return (
    <nav className="w-full border-b border-border bg-transparent">
      <div className="max-w-8xl mx-auto px-6 py-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Link href="/" className="flex items-center gap-3">
              <Image src="/logo.svg" alt="JKSoC" width={36} height={36} />
              <span className="font-semibold">JKSoC</span>
          </Link>
        </div>

        <div className="hidden sm:flex items-center gap-4">
          <Link href="/leaderboard" className="text-sm text-muted-foreground">
            Leaderboard
          </Link>
          <Link href="/repos" className="text-sm text-muted-foreground">
            Repositories
          </Link>
          <Link href="/register">
            <Button variant="ghost">Register</Button>
          </Link>
          <Link href="/auth/github">
            <Button>Sign in</Button>
          </Link>
        </div>
      </div>
    </nav>
  );
}
