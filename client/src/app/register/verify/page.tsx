"use client"

import React, { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import AuthCard from "@/components/auth/AuthCard"
import { apiFetch } from "@/lib/api"

export default function VerifyInstitutePage() {
  const router = useRouter()
  const [email, setEmail] = useState("")
  const [institute, setInstitute] = useState("")
  const [otp, setOtp] = useState("")
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")
  const [step, setStep] = useState<1 | 2>(1)

  useEffect(() => {
    const init = async () => {
      const pendingEmail = localStorage.getItem("pending_email")
      const pendingInstitute = localStorage.getItem("pending_institute")
      if (pendingEmail) setEmail(pendingEmail)
      if (pendingInstitute) setInstitute(pendingInstitute)
      // if we have pending data, auto-send OTP and go to step 2
      if (pendingEmail || pendingInstitute) {
        setLoading(true)
        setError("")
        try {
          const res = await apiFetch('/institute/submit', {
            method: 'POST',
            body: JSON.stringify({ email: pendingEmail || '', institute: pendingInstitute || '' }),
          })
          const data = await res.json()
          if (res.ok) {
            localStorage.removeItem("pending_email")
            localStorage.removeItem("pending_institute")
            setStep(2)
          } else {
            setError(data.message || "Failed to submit details")
          }
        } catch (err) {
          setError("An error occurred: " + (err as Error).message)
        } finally {
          setLoading(false)
        }
      }
    }
    void init()
  }, [])

  async function handleSubmitDetails() {
    setLoading(true)
    setError("")
    try {
      const res = await apiFetch('/institute/submit', {
        method: 'POST',
        body: JSON.stringify({ email, institute }),
      })
      const data = await res.json()
      if (res.ok) {
        localStorage.removeItem("pending_email")
        localStorage.removeItem("pending_institute")
        return true
      } else {
        setError(data.message || "Failed to submit details")
        return false
      }
    } catch (err) {
      setError("An error occurred: " + (err as Error).message)
      return false
    } finally {
      setLoading(false)
    }
  }

  async function handleVerifyOtp() {
    setLoading(true)
    setError("")
    try {
      const res = await apiFetch('/institute/verify', {
        method: 'POST',
        body: JSON.stringify({ email, code: otp }),
      })
      const data = await res.json()
      if (res.ok) {
        router.push('/')
      } else {
        setError(data.message || "Invalid OTP")
      }
    } catch (err) {
      setError("An error occurred: " + (err as Error).message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center">
      <AuthCard>
        <h2 className="text-xl font-semibold mb-4">
          Enter Verification Code
        </h2>

        {error && <p className="text-red-500 text-sm mb-4">{error}</p>}
        {step === 1 ? (
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
              <Button
                onClick={async () => {
                  const ok = await handleSubmitDetails()
                  if (ok) setStep(2)
                }}
                disabled={loading}
              >
                {loading ? 'Sending...' : 'Send OTP'}
              </Button>
            </div>
          </div>
        ) : (
          <div className="flex flex-col gap-4">
            <p className="text-sm text-muted-foreground mb-2">
              We&apos;ve sent a 6-digit code to <b>{email}</b>.
            </p>
            <label className="text-sm">OTP Code</label>
            <input
              className="rounded-md border border-input bg-transparent px-4 py-2 text-center text-2xl tracking-widest"
              value={otp}
              onChange={(e) => setOtp(e.target.value)}
              placeholder="000000"
              maxLength={6}
            />
            <Button onClick={handleVerifyOtp} disabled={loading}>
              {loading ? "Verifying..." : "Verify OTP"}
            </Button>
          </div>
        )}
      </AuthCard>
    </div>
  )
}
