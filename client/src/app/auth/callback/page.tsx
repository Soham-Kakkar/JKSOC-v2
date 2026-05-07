"use client"

import { useEffect } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { useAuth } from '@/context/AuthContext'

export default function AuthCallbackPage() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const token = searchParams.get('token')
  const { setToken } = useAuth()

  useEffect(() => {
    if (!token) {
      router.push('/auth/error?message=No token provided')
      return
    }

    // store token and let AuthProvider fetch user (deduped there)
    void (async () => {
      const user = await setToken(token)
      if (user && !user.instituteVerified) {
        router.push('/register/verify')
      } else {
        router.push('/')
      }
    })()
    // only run when token changes
  }, [token, router, setToken])

  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="text-center">
        <h2 className="text-xl font-semibold mb-2">Authenticating...</h2>
        <p className="text-muted-foreground">Please wait while we log you in.</p>
      </div>
    </div>
  )
}
