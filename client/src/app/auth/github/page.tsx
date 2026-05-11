"use client"

import { Button } from "@/components/ui/button";
import { API_BASE_URL } from "@/lib/api";
import { Card, CardContent, CardHeader } from "@/components/ui/card";

export default function GithubAuthPage() {
  function startGithub() {
    // send for authentication, backend will handle the rest and redirect back to frontend with JWT
    window.location.href = `${API_BASE_URL}/auth/github`;
  }

  return (
    <div className="flex justify-center items-center">
      <Card className="max-w-md mx-auto text-center h-fit">
        <CardHeader className="text-xl font-semibold mb-4">Sign in with GitHub</CardHeader>
        <CardContent className="flex flex-col gap-4">
          <p className="text-sm mb-6">Securely authenticate using your GitHub account.</p>
          <Button onClick={startGithub}>Continue with GitHub</Button>
        </CardContent>
      </Card>
    </div>
  );
}
