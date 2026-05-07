"use client"

import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import AuthCard from "@/components/auth/AuthCard";
import Link from "next/link";

export default function RegisterForm() {
  const [email, setEmail] = useState("");
  const [institute, setInstitute] = useState("");
  const [loading, setLoading] = useState(false);

  async function onGithub() {
    // frontend stub — backend integration will provide real redirect
    setLoading(true);
    window.location.href = "/api/auth/github";
  }

  return (
    <AuthCard>
      <h3 className="text-xl font-semibold mb-4">Create your JKSoC account</h3>

      <div className="flex flex-col gap-4">
        <label className="text-sm text-muted-foreground">Institute</label>
        <input
          className="rounded-md border border-input bg-transparent px-4 py-3 text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring/50"
          value={institute}
          onChange={(e) => setInstitute(e.target.value)}
          placeholder="Your institute name"
        />

        <label className="text-sm text-muted-foreground">Institute Email</label>
        <input
          className="rounded-md border border-input bg-transparent px-4 py-3 text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring/50"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="institute email"
        />

        <div className="flex items-center gap-2 mt-4">
          <Button onClick={onGithub} className="flex-1">Continue with GitHub</Button>
        </div>

        <p className="text-sm text-muted-foreground mt-3">
          By continuing you agree to the platform terms. After GitHub sign-in you will be asked
          to verify your institute email via OTP.
        </p>

        <div className="mt-4 text-sm text-muted-foreground">
          Already have an account? <Link href="/auth/github" className="text-primary">Sign in</Link>
        </div>
      </div>
    </AuthCard>
  );
}
