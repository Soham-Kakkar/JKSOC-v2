"use client"

import React from "react";
import { Button } from "@/components/ui/button";
import AuthCard from "@/components/auth/AuthCard";

export default function GithubAuthPage() {
  function startGithub() {
    // frontend stub — will redirect to backend OAuth endpoint when implemented
    window.location.href = "/api/auth/github";
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-zinc-50">
      <AuthCard>
        <h2 className="text-xl font-semibold mb-4">Sign in with GitHub</h2>
        <p className="text-sm text-zinc-600 mb-6">Securely authenticate using your GitHub account.</p>
        <div className="flex gap-2">
          <Button onClick={startGithub}>Continue with GitHub</Button>
        </div>
      </AuthCard>
    </div>
  );
}
