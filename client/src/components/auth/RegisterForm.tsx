"use client"

import { useState } from "react";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { API_BASE_URL } from "@/lib/api";
import { Card, CardContent, CardHeader } from "../ui/card";

export default function RegisterForm() {
  const [role, setRole] = useState<'CONTRIBUTOR' | 'MAINTAINER'>('CONTRIBUTOR')

  async function onGithub(selectedRole: typeof role) {
    const roleParam = selectedRole === 'MAINTAINER' ? '?role=MAINTAINER' : ''
    window.location.href = `${API_BASE_URL}/auth/github${roleParam}`
  }

  return (
    <Card className="max-w-md mx-auto text-center">
      <CardHeader className="text-xl font-semibold mb-4">Create your JKSoC account</CardHeader>

      <div className="flex flex-col gap-4">
        <p className="text-sm text-muted-foreground px-4">You will be asked to verify your institute email after GitHub sign-in.</p>

        {/* Switch header */}
        <div className="mt-4 flex items-center justify-center p-2">
          <div className="relative w-full max-w-md bg-muted rounded-md">
              <button
                onClick={() => setRole('CONTRIBUTOR')}
                className={`w-1/2 p-2 text-sm font-medium rounded-md ${role === 'CONTRIBUTOR' ? 'text-black bg-white' : 'text-muted-foreground'}`}
              >
                Contributor
              </button>

              <button
                onClick={() => setRole('MAINTAINER')}
                className={`w-1/2 p-2 text-sm font-medium rounded-md ${role === 'MAINTAINER' ? 'text-black bg-white' : 'text-muted-foreground'}`}
              >
                Maintainer
              </button>
          </div>
        </div>

        {/* Sliding panels */}
        <div className="w-full overflow-hidden">
          <div className={`flex w-[200%] transition-transform duration-300 ease-in-out ${role === 'CONTRIBUTOR' ? 'translate-x-0' : '-translate-x-1/2'}`}>
            {/* Contributor panel */}
            <div className="w-1/2 p-4 box-border shrink-0">
              <p className="text-sm">Register as a contributor to receive points for accepted contributions.</p>

              <div className="flex items-center gap-2 mt-4">
                <Button onClick={() => onGithub('CONTRIBUTOR')} className="flex-1">Continue with GitHub</Button>
              </div>
            </div>

            {/* Maintainer panel */}
            <div className="w-1/2 p-4 box-border shrink-0">
              <div className="p-3 bg-yellow-50 rounded-md text-sm text-yellow-800">
                <strong>Maintainer accounts</strong>
                <div>Can submit repositories, but every submission must be reviewed by ORGANIZERS before approval.</div>
              </div>

              <div className="flex items-center gap-2 mt-4">
                <Button onClick={() => onGithub('MAINTAINER')} className="flex-1">Continue with GitHub</Button>
              </div>
            </div>
          </div>
        </div>

        <p className="text-sm text-muted-foreground mt-3">
          By continuing you agree to the platform terms. After GitHub sign-in you will be asked
          to verify your institute email via OTP.
        </p>

        <div className="mt-4 text-sm text-muted-foreground">
          Already have an account? <Link href="/auth/github" className="text-primary">Sign in</Link>
        </div>
      </div>
    </Card>
  );
}
