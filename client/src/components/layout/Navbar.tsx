"use client"

import Link from "next/link";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/context/AuthContext";
import { useEffect, useState } from "react";
import SignOutConfirmationCard from "../auth/SignOutConfirmationCard";

export default function Navbar() {
  const { user, loading, signOut } = useAuth();

  const [mounted, setMounted] = useState(false);
  const [open, setOpen] = useState(false);
  const [showSignOutConfirmation, setShowSignOutConfirmation] = useState(false);

  useEffect(() => {
    const init = async () => {
      setMounted(true);
    };
    init();
  }, []);

  return (
    <nav className="w-full border-b border-border bg-transparent">
      <div className="max-w-8xl mx-auto px-6 py-4 flex items-center justify-between">

        <div className="flex items-center gap-3">
          <Link href="/" className="flex items-center gap-3">
            <Image src="/logo.png" alt="JKSoC" width={36} height={36} />
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

          {/* Prevent hydration mismatch */}
          {mounted && (
            <>
              {!loading && !user && (
                <>
                  <Link href="/register">
                    <Button variant="ghost">Register</Button>
                  </Link>

                  <Link href="/auth/github">
                    <Button>Sign in</Button>
                  </Link>
                </>
              )}

              {!loading && user && (
                <div className="flex items-center gap-3">
                  <Link href="/profile" className="text-sm text-muted-foreground">
                    {user.githubUsername}
                  </Link>

                  <Button variant="ghost" onClick={() => setShowSignOutConfirmation(true)}>
                    Sign out
                  </Button>
                </div>
              )}
            </>
          )}
        </div>

        {showSignOutConfirmation && (
          <SignOutConfirmationCard
            setOpen={setShowSignOutConfirmation}
            signOut={signOut}
          />
        )}

        {/* Mobile: hamburger */}
        <div className="sm:hidden">
          <button
            aria-label="Open menu"
            onClick={() => setOpen(true)}
            className="p-2 rounded-md hover:bg-muted"
          >
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M4 6H20" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
              <path d="M4 12H20" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
              <path d="M4 18H20" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </button>
        </div>

        {/* Slide-in panel */}
        <div
          aria-hidden={!open}
          className={`fixed inset-0 z-10 ${open ? 'visible' : 'pointer-events-none invisible'
            }`}
        >
          {/* overlay */}
          <div
            onClick={() => setOpen(false)}
            className={`fixed inset-0 bg-black/40 transition-opacity ${open ? 'opacity-100' : 'opacity-0'}`}
          />

          {/* panel */}
          <aside className={`fixed top-0 right-0 h-full w-72 max-w-full bg-background border-l border-border shadow-lg transform transition-transform ${open ? 'translate-x-0' : 'translate-x-full'}`}>
            <div className="p-4 flex items-center justify-between border-b border-border">
              <Link href="/" className="flex items-center gap-3">
                <Image src="/logo.png" alt="JKSoC" width={28} height={28} />
                <span className="font-semibold">JKSoC</span>
              </Link>

              <button aria-label="Close menu" onClick={() => setOpen(false)} className="p-2 rounded-md hover:bg-muted">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M18 6L6 18" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                  <path d="M6 6L18 18" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </button>
            </div>

            <div className="p-4 flex flex-col gap-4">
              <Link href="/leaderboard" onClick={() => setOpen(false)} className="text-sm text-muted-foreground">Leaderboard</Link>
              <Link href="/repos" onClick={() => setOpen(false)} className="text-sm text-muted-foreground">Repositories</Link>

              {mounted && (
                <>
                  {!loading && !user && (
                    <>
                      <Link href="/register">
                        <Button variant="ghost" onClick={() => setOpen(false)}>Register</Button>
                      </Link>

                      <Link href="/auth/github">
                        <Button onClick={() => setOpen(false)}>Sign in</Button>
                      </Link>
                    </>
                  )}

                  {!loading && user && (
                    <div className="flex flex-col gap-2">
                      <Link href="/profile" onClick={() => setOpen(false)} className="text-sm text-muted-foreground">{user.githubUsername}</Link>
                      <Button variant="ghost" onClick={() => setShowSignOutConfirmation(true)}>Sign out</Button>
                    </div>
                  )}
                </>
              )}
            </div>
          </aside>
        </div>
      </div>
    </nav>
  );
}