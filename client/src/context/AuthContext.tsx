"use client"

import React, { createContext, useContext, useEffect, useRef, useState, useCallback } from "react";
import { apiFetch, getAuthToken, setAuthToken, removeAuthToken } from "@/lib/api";

type User = { id: number; githubUsername: string; instituteVerified?: boolean, roles?: { role: { name: string } }[] }

type AuthContextValue = {
  user: User | null
  loading: boolean
  // setToken returns the fetched user (or null)
  setToken: (token: string) => Promise<User | null>
  signOut: () => void
  refresh: () => Promise<User | null>
}

const AuthContext = createContext<AuthContextValue | undefined>(undefined)

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState<boolean>(() => !!getAuthToken())
  const inflight = useRef<Promise<User | null> | null>(null)

  const fetchMe = useCallback(async (): Promise<User | null> => {
    // reuse in-flight request to avoid duplicated /auth/me calls
    if (inflight.current) return inflight.current

    const p = (async () => {
      setLoading(true)
      try {
        const res = await apiFetch('/auth/me')
        if (res.ok) {
          const json = await res.json()
          setUser(json)
          return json as User
        } else {
          setUser(null)
          return null
        }
      } catch {
        setUser(null)
        return null
      } finally {
        setLoading(false)
        inflight.current = null
      }
    })()

    inflight.current = p
    return p
  }, [])

  useEffect(() => {
    const token = getAuthToken()
    if (token) {
      // kick off fetch but dedupe inside
      void fetchMe()
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const setToken = useCallback(async (token: string) => {
    setAuthToken(token)
    const u = await fetchMe()
    return u
  }, [fetchMe])

  const signOut = () => {
    removeAuthToken()
    setUser(null)
  }

  const refresh = useCallback(async () => fetchMe(), [fetchMe])

  return (
    <AuthContext.Provider value={{ user, loading, setToken, signOut, refresh }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error('useAuth must be used within AuthProvider')
  return ctx
}
