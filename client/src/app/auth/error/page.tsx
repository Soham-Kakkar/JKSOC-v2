"use client"

import { useSearchParams } from 'next/navigation'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardFooter, CardTitle } from '@/components/ui/card'

export default function AuthErrorPage() {
  const searchParams = useSearchParams()
  const message = searchParams.get('message') || 'An unknown authentication error occurred.'

  return (
    <div className="flex items-center justify-center">
      <Card className="max-w-md w-full p-6 text-center">
        <CardTitle className="text-xl font-semibold text-red-500 mb-4">Authentication Error</CardTitle>
        <CardContent>
          <p className="text-muted-foreground mb-6">{message}</p>
          <Link href="/auth/github">
            <Button className="w-full">Try Again</Button>
          </Link>
        </CardContent>
        <CardFooter className="mt-4 flex justify-center">
          <Link href="/" className="text-sm text-primary hover:underline">
            Back to home
          </Link>
        </CardFooter>
      </Card>
    </div>
  )
}
