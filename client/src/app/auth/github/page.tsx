"use client"

import { Button } from "@/components/ui/button";
import AuthCard from "@/components/auth/AuthCard";
import { API_BASE_URL } from "@/lib/api";

export default function GithubAuthPage() {
  function startGithub() {
    // send for authentication, backend will handle the rest and redirect back to frontend with JWT
    window.location.href = `${API_BASE_URL}/auth/github`;
  }

  return (
    <div className="min-h-screen flex items-center justify-center">
      <AuthCard>
        <h2 className="text-xl font-semibold mb-4">Sign in with GitHub</h2>
        <p className="text-sm mb-6">Securely authenticate using your GitHub account.</p>
        <div className="flex gap-2">
          <Button onClick={startGithub}>Continue with GitHub</Button>
        </div>
      </AuthCard>
    </div>
  );
}
