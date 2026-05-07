"use client"

import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import AuthCard from "@/components/auth/AuthCard";
import Link from "next/link";
import { API_BASE_URL } from "@/lib/api";

export default function RegisterForm() {
  async function onGithub() {
    // registration now collects institute/email on the verification step
    // Use configured API base so environments (dev/prod) work without code changes
    window.location.href = `${API_BASE_URL}/auth/github`;
  }

  return (
    <AuthCard>
      <h3 className="text-xl font-semibold mb-4">Create your JKSoC account</h3>

      <div className="flex flex-col gap-4">
        <p className="text-sm text-muted-foreground">You will be asked to verify your institute email after GitHub sign-in.</p>

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
