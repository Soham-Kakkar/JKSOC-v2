"use client"

import React, { useState } from 'react'
import { useAuth } from '@/context/AuthContext'
import { Button } from '@/components/ui/button'
import { Card, CardHeader, CardTitle, CardDescription, CardFooter, CardContent } from '@/components/ui/card'
import { apiFetch } from '@/lib/api'

function ConfirmUpgradeCard({ onCancel, onConfirm, busy }: { onCancel: () => void; onConfirm: () => Promise<void>; busy: boolean }) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div className="absolute inset-0 bg-black/50" onClick={onCancel} />

      <Card className="relative z-10 max-w-md w-full">
        <CardHeader>
          <CardTitle>Confirm Change</CardTitle>
          <CardDescription>Upgrading will grant you the MAINTAINER role, which allows repository submissions that must be manually reviewed by organizers.</CardDescription>
        </CardHeader>

        <CardFooter className="justify-end">
          <Button variant="ghost" onClick={onCancel} disabled={busy}>Cancel</Button>
          <Button onClick={onConfirm} disabled={busy}>{busy ? 'Changing…' : 'Confirm Change'}</Button>
        </CardFooter>
      </Card>
    </div>
  )
}

export default function ProfilePage() {
  const { user, loading, refresh } = useAuth()
  const [busy, setBusy] = useState(false)
  const [message, setMessage] = useState<string | null>(null)
  const [showConfirm, setShowConfirm] = useState(false)
  const [mounted, setMounted] = useState(false)

  // Repo submission state (maintainers only)
  const [repoUrl, setRepoUrl] = useState('')
  const [repoBusy, setRepoBusy] = useState(false)
  const [repoMessage, setRepoMessage] = useState<string | null>(null)

  type RoleEntry = { role?: { name?: string } }
  const isMaintainer = !!user?.roles?.some?.((r: RoleEntry) => r.role?.name === 'MAINTAINER')

  React.useEffect(() => {
    const init = async () => {
      setMounted(true)
    }
    init()
  }, [])

  const submitRepo = async (e?: React.FormEvent) => {
    e?.preventDefault()
    if (!repoUrl) {
      setRepoMessage('Please enter a GitHub repository URL')
      return
    }

    setRepoBusy(true)
    setRepoMessage(null)
    try {
      const res = await apiFetch('/repos/submit', { method: 'POST', body: JSON.stringify({ repoUrl }) })
      if (res.status === 201) {
        setRepoMessage('Repository submitted for review')
        setRepoUrl('')
      } else {
        const json = await res.json()
        setRepoMessage(json?.message || 'Failed to submit')
      }
    } catch (err) {
      console.error(err)
      setRepoMessage('Submission failed')
    } finally {
      setRepoBusy(false)
    }
  }

  if (!mounted) return null

  if (loading) return <div className="p-6">Loading...</div>
  if (!user) return <div className="p-6">Not signed in.</div>

  const onUpgrade = async () => {
    setBusy(true)
    setMessage(null)
    try {
      const res = await apiFetch('/profile/upgrade-maintainer', { method: 'POST' })
      const json = await res.json()
      setMessage(json.message || 'Done')
      // refresh user info
      await refresh()
    } catch (err) {
      console.error(err)
      setMessage('Change failed')
    } finally {
      setBusy(false)
    }
  }

  return (
    <main className="max-w-5xl mx-auto p-6">
      <h1 className="text-2xl font-bold mb-4 text-center">Profile</h1>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="flex flex-col h-fit">
          <CardHeader>
            <CardTitle>Account</CardTitle>
            <CardDescription>Basic account information and actions</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <div><strong>GitHub:</strong> {user.githubUsername}</div>
              <div><strong>Institute verified:</strong> {user.instituteVerified ? 'Yes' : 'No'}</div>
            </div>
          </CardContent>
          <CardFooter className='mt-auto'>
            <Button onClick={() => setShowConfirm(true)} disabled={busy || !!user?.roles?.some?.((r) => r.role?.name === 'MAINTAINER') || !user.instituteVerified}>
            Become a Maintainer
            </Button>
            {message && <div className="mt-3 text-sm">{message}</div>}
          </CardFooter>
        </Card>

        <div className="md:col-span-2 space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Maintainer Actions</CardTitle>
              <CardDescription>Submit repositories for organizer review</CardDescription>
            </CardHeader>
            <CardContent>
              {isMaintainer ? (
                <form onSubmit={submitRepo} className="space-y-3">
                  <div>
                    <label className="block text-sm font-medium text-muted-foreground">Repository URL</label>
                    <input value={repoUrl} onChange={(e) => setRepoUrl(e.target.value)} placeholder="https://github.com/owner/repo" className="mt-1 w-full rounded-md border px-3 py-2" />
                  </div>

                  <div className="flex items-center gap-2">
                    <Button type="submit" disabled={repoBusy}>{repoBusy ? 'Submitting…' : 'Submit for Review'}</Button>
                    {repoMessage && <div className="text-sm text-muted-foreground">{repoMessage}</div>}
                  </div>
                </form>
              ) : (
                <div>
                  <p className="text-sm">You must be a maintainer to submit repositories. Upgrade your account if eligible.</p>
                </div>
              )}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Recent Activity</CardTitle>
              <CardDescription>Placeholder for contributions, submissions, and notifications</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-sm text-muted-foreground">No activity shown yet.</div>
            </CardContent>
          </Card>
        </div>
      </div>

      {showConfirm && (
        <ConfirmUpgradeCard
          onCancel={() => setShowConfirm(false)}
          onConfirm={async () => {
            setShowConfirm(false)
            await onUpgrade()
          }}
          busy={busy}
        />
      )}
    </main>
  )
}
