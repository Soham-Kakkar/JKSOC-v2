"use client"

import { useSearchParams } from 'next/navigation'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import AuthCard from '@/components/auth/AuthCard'

export default function AuthErrorPage() {
  const searchParams = useSearchParams()
  const message = searchParams.get('message') || 'An unknown authentication error occurred.'

  return (
    <div className="min-h-screen flex items-center justify-center">
      <AuthCard>
        <h2 className="text-xl font-semibold text-red-500 mb-4">Authentication Error</h2>
        <p className="text-muted-foreground mb-6">{message}</p>
        <Link href="/auth/github">
          <Button className="w-full">Try Again</Button>
        </Link>
        <div className="mt-4 text-center">
          <Link href="/" className="text-sm text-primary hover:underline">
            Back to home
          </Link>
        </div>
      </AuthCard>
    </div>
  )
}
