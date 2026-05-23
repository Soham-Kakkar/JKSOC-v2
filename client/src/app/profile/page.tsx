"use client"

import React, { useEffect, useState } from 'react'
import Link from 'next/link'

import { useAuth } from '@/context/AuthContext'
import { apiFetch } from '@/lib/api'

import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Separator } from '@/components/ui/separator'

function ConfirmUpgradeCard({
  onCancel,
  onConfirm,
  busy,
}: {
  onCancel: () => void
  onConfirm: () => Promise<void>
  busy: boolean
}) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div
        className="absolute inset-0 bg-black/60 backdrop-blur-sm"
        onClick={onCancel}
      />

      <Card className="relative z-10 w-full max-w-md border-border/60 shadow-2xl">
        <CardHeader className="space-y-3">
          <CardTitle>Become a Maintainer?</CardTitle>

          <CardDescription className="leading-relaxed">
            Maintainers can submit repositories to JKSoC and collaborate with
            contributors during the program.
          </CardDescription>
        </CardHeader>

        <CardFooter className="flex justify-end gap-2">
          <Button variant="ghost" onClick={onCancel} disabled={busy}>
            Cancel
          </Button>

          <Button onClick={onConfirm} disabled={busy}>
            {busy ? 'Updating...' : 'Confirm'}
          </Button>
        </CardFooter>
      </Card>
    </div>
  )
}

function ConfirmSubmitCard({ onCancel, onConfirm, busy }: { onCancel: () => void; onConfirm: () => Promise<void>; busy: boolean }) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div className="absolute inset-0 bg-black/50" onClick={onCancel} />

      <Card className="relative z-10 max-w-md w-full">
        <CardHeader>
          <CardTitle>Confirm Repository Submission</CardTitle>
          <CardDescription>This action cannot be reversed. Submitting a repository sends it for organizer review.</CardDescription>
        </CardHeader>

        <CardFooter className="justify-end">
          <Button variant="ghost" onClick={onCancel} disabled={busy}>Cancel</Button>
          <Button onClick={onConfirm} disabled={busy}>{busy ? 'Submitting…' : 'Submit Repository'}</Button>
        </CardFooter>
      </Card>
    </div>
  )
}

function ConfirmReviewCard({ action, onCancel, onConfirm, busy }: { action: 'approve' | 'reject'; onCancel: () => void; onConfirm: () => Promise<void>; busy: boolean }) {
  const title = action === 'approve' ? 'Approve Repository?' : 'Reject Repository?'
  const desc = action === 'approve'
    ? 'Approving will mark this repository as APPROVED and include it in the scoring scope.'
    : 'Rejecting will mark this repository as REJECTED and it will not be eligible for the program.'

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={onCancel} />

      <Card className="relative z-10 w-full max-w-md border-border/60 shadow-2xl">
        <CardHeader className="space-y-3">
          <CardTitle>{title}</CardTitle>
          <CardDescription className="leading-relaxed">{desc}</CardDescription>
        </CardHeader>

        <CardFooter className="flex justify-end gap-2">
          <Button variant="ghost" onClick={onCancel} disabled={busy}>Cancel</Button>
          <Button onClick={onConfirm} disabled={busy} className={action === 'reject' ? 'bg-red-600 text-white hover:bg-red-700' : ''}>
            {busy ? (action === 'approve' ? 'Approving…' : 'Rejecting…') : (action === 'approve' ? 'Approve' : 'Reject')}
          </Button>
        </CardFooter>
      </Card>
    </div>
  )
}
type RoleEntry = {
  role?: {
    name?: string
  }
}

type PendingRepo = {
  id: number
  repoUrl: string
  creator?: {
    githubUsername?: string
  }
  createdBy?: number
}

export default function ProfilePage() {
  const { user, loading, refresh } = useAuth()

  const [mounted, setMounted] = useState(false)

  const [busy, setBusy] = useState(false)
  const [message, setMessage] = useState<string | null>(null)

  const [showConfirm, setShowConfirm] = useState(false)

  const [repoUrl, setRepoUrl] = useState('')
  const [repoBusy, setRepoBusy] = useState(false)
  const [repoMessage, setRepoMessage] = useState<string | null>(null)
  const [showSubmitConfirm, setShowSubmitConfirm] = useState(false)

  const [pendingRepos, setPendingRepos] = useState<PendingRepo[]>([])
  const [pendingLoading, setPendingLoading] = useState(false)
  const [pendingError, setPendingError] = useState<string | null>(null)
  const [reviewAction, setReviewAction] = useState<{ id: number; action: 'approve' | 'reject' } | null>(null)
  const [reviewBusy, setReviewBusy] = useState(false)

  const isMaintainer = !!user?.roles?.some(
    (r: RoleEntry) => r.role?.name === 'MAINTAINER'
  )

  const isOrganizer = !!user?.roles?.some(
    (r: RoleEntry) => r.role?.name === 'ORGANIZER'
  )

  useEffect(() => {
    const init = async () => {
      setMounted(true)
    }
    init()
  }, [])

  useEffect(() => {
    if (!isOrganizer) return

    let active = true

    const loadPendingRepos = async () => {
      setPendingLoading(true)
      setPendingError(null)

      try {
        const res = await apiFetch('/repos/pending')

        if (!res.ok) {
          throw new Error('Failed to load repositories')
        }

        const data = await res.json()

        if (!active) return

        setPendingRepos(data || [])
      } catch (err) {
        console.error(err)

        if (!active) return

        setPendingError('Could not load pending repositories.')
      } finally {
        if (active) {
          setPendingLoading(false)
        }
      }
    }

    loadPendingRepos()

    return () => {
      active = false
    }
  }, [isOrganizer])

  const onUpgrade = async () => {
    setBusy(true)
    setMessage(null)

    try {
      const res = await apiFetch('/profile/upgrade-maintainer', {
        method: 'POST',
      })

      const json = await res.json()

      setMessage(json.message || 'Role updated successfully.')

      await refresh()
    } catch (err) {
      console.error(err)

      setMessage('Something went wrong.')
    } finally {
      setBusy(false)
    }
  }

  const submitRepo = async (e?: React.FormEvent) => {
    e?.preventDefault()

    if (!repoUrl) {
      setRepoMessage('Please enter a repository URL.')
      return
    }

    setRepoBusy(true)
    setRepoMessage(null)

    try {
      const res = await apiFetch('/repos/submit', {
        method: 'POST',
        body: JSON.stringify({ repoUrl }),
      })

      if (res.status === 201) {
        setRepoMessage('Repository submitted for review.')
        setRepoUrl('')
      } else {
        const json = await res.json()

        setRepoMessage(json?.message || 'Submission failed.')
      }
    } catch (err) {
      console.error(err)

      setRepoMessage('Something went wrong.')
    } finally {
      setRepoBusy(false)
    }
  }

  const approvePendingRepo = async (id: number) => {
    try {
      const res = await apiFetch(`/repos/${id}/approve`, {
        method: 'POST',
      })

      if (!res.ok) {
        throw new Error('Approval failed')
      }

      setPendingRepos((prev) => prev.filter((r) => r.id !== id))
    } catch (err) {
      console.error(err)
    }
  }

  const rejectPendingRepo = async (id: number) => {
    try {
      const res = await apiFetch(`/repos/${id}/reject`, {
        method: 'POST',
      })

      if (!res.ok) throw new Error('Reject failed')

      setPendingRepos((prev) => prev.filter((r) => r.id !== id))
    } catch (err) {
      console.error(err)
    }
  }

  const confirmReviewAction = async () => {
    if (!reviewAction) return
    setReviewBusy(true)
    const { id, action } = reviewAction
    try {
      if (action === 'approve') {
        await approvePendingRepo(id)
      } else {
        await rejectPendingRepo(id)
      }
    } finally {
      setReviewBusy(false)
      setReviewAction(null)
    }
  }

  if (!mounted) return null

  if (loading) {
    return (
      <div className="mx-auto max-w-5xl p-6">
        <div className="text-muted-foreground">Loading profile...</div>
      </div>
    )
  }

  if (!user) {
    return (
      <div className="mx-auto max-w-5xl p-6">
        <div className="text-muted-foreground">You are not signed in.</div>
      </div>
    )
  }

  return (
    <div className="mx-auto max-w-6xl px-6 py-10">
      <section className="space-y-4">
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div className="space-y-2">
            <h1 className="text-4xl font-black tracking-tight">
              Your Profile
            </h1>

            <p className="text-muted-foreground">
              Manage your account, repositories, and participation in JKSoC.
            </p>
          </div>

          <div className="flex flex-wrap gap-2">
            {isOrganizer && (
              <Badge variant="default" className='py-3 px-4'>Organizer</Badge>
            )}

            {isMaintainer && (
              <Badge variant="secondary" className='py-3 px-4'>Maintainer</Badge>
            )}

            {!isMaintainer && !isOrganizer && (
              <Badge variant="outline">Contributor</Badge>
            )}
          </div>
        </div>
      </section>

      <Separator className="my-8" />

      <div className="grid gap-6 lg:grid-cols-3">
        <Card className="border-border/60 lg:col-span-1">
          <CardHeader>
            <CardTitle>Account</CardTitle>

            <CardDescription>
              Your JKSoC profile and verification status.
            </CardDescription>
          </CardHeader>

          <CardContent className="space-y-5">
            <div className="space-y-1">
              <div className="text-sm text-muted-foreground">
                GitHub Username
              </div>

              <div className="font-medium">
                @{user.githubUsername}
              </div>
            </div>

            <div className="space-y-1">
              <div className="text-sm text-muted-foreground">
                Institute Verification
              </div>

              <div>
                {user.instituteVerified ? (
                  <Badge variant="secondary" className='py-3 px-4'>
                    Verified
                  </Badge>
                ) : (
                  <Badge variant="outline" className='py-3 px-4'>
                    Not Verified
                  </Badge>
                )}
              </div>
            </div>

            {message && (
              <div className="text-sm text-muted-foreground">
                {message}
              </div>
            )}
          </CardContent>

          {!isMaintainer && (
            <CardFooter>
              <Button
                className="w-full"
                disabled={busy || !user.instituteVerified}
                onClick={() => setShowConfirm(true)}
              >
                Become a Maintainer
              </Button>
            </CardFooter>
          )}
        </Card>

        <Card className="border-border/60 lg:col-span-2">
          <CardHeader>
            <CardTitle>Repositories</CardTitle>

            <CardDescription>
              Explore approved repositories and manage submissions.
            </CardDescription>
          </CardHeader>

          <CardContent className="space-y-4">
            <p className="text-sm text-muted-foreground leading-relaxed">
              Browse repositories participating in JKSoC, discover issues to
              work on, and track projects submitted by maintainers.
            </p>
          </CardContent>

          <CardFooter>
            <Link href="/repos">
              <Button>
                Browse Repositories
              </Button>
            </Link>
          </CardFooter>
        </Card>
      </div>

      <div className="mt-8 space-y-6">
        {isMaintainer && (
          <Card className="border-border/60">
            <CardHeader>
              <CardTitle>Submit a Repository</CardTitle>

              <CardDescription>
                Maintainers can submit repositories for organizer review.
              </CardDescription>
            </CardHeader>

            <CardContent>
              <form
                onSubmit={(e) => { e.preventDefault(); setShowSubmitConfirm(true) }}
                className="space-y-4"
              >
                <div className="space-y-2">
                  <label className="text-sm font-medium">
                    Repository URL
                  </label>

                  <Input
                    value={repoUrl}
                    onChange={(e: React.ChangeEvent<HTMLInputElement>) => setRepoUrl(e.target.value)}
                    placeholder="https://github.com/owner/repository"
                    className='mt-2'
                  />
                </div>

                  <div className="flex flex-wrap items-center gap-3">
                  <Button type="submit" disabled={repoBusy}>
                    {repoBusy ? 'Submitting...' : 'Submit Repository'}
                  </Button>

                  {repoMessage && (
                    <p className="text-sm text-muted-foreground">
                      {repoMessage}
                    </p>
                  )}
                </div>
              </form>
            </CardContent>
          </Card>
        )}

        {isOrganizer && (
          <Card className="border-border/60">
            <CardHeader>
              <CardTitle>Pending Repository Reviews</CardTitle>

              <CardDescription>
                Repositories waiting for organizer approval.
              </CardDescription>
            </CardHeader>

            <CardContent>
              {pendingLoading ? (
                <div className="text-sm text-muted-foreground">
                  Loading repositories...
                </div>
              ) : pendingError ? (
                <div className="text-sm text-red-500">
                  {pendingError}
                </div>
              ) : pendingRepos.length === 0 ? (
                <div className="text-sm text-muted-foreground">
                  No pending repositories right now.
                </div>
              ) : (
                <div className="space-y-4">
                  {pendingRepos.map((repo) => (
                    <div
                      key={repo.id}
                      className="flex flex-col gap-4 rounded-lg border p-4 md:flex-row md:items-center md:justify-between"
                    >
                      <div className="space-y-1">
                        <div className="font-medium break-all">
                          {repo.repoUrl}
                        </div>

                        <div className="text-sm text-muted-foreground">
                          Submitted by{' '}
                          {repo.creator?.githubUsername ||
                            repo.createdBy}
                        </div>
                      </div>

                      <div className="flex items-center gap-2">
                        <Button
                          size="sm"
                          onClick={() => setReviewAction({ id: repo.id, action: 'approve' })}
                        >
                          Approve
                        </Button>

                        <Button
                          size="sm"
                          className="bg-red-600 text-white hover:bg-red-700"
                          onClick={() => setReviewAction({ id: repo.id, action: 'reject' })}
                        >
                          Reject
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        )}

        <Card className="border-border/60">
          <CardHeader>
            <CardTitle>Recent Activity</CardTitle>

            <CardDescription>
              Contributions, submissions, and updates will appear here.
            </CardDescription>
          </CardHeader>

          <CardContent>
            <div className="text-sm text-muted-foreground">
              No recent activity yet.
            </div>
          </CardContent>
        </Card>
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

      {showSubmitConfirm && (
        <ConfirmSubmitCard
          onCancel={() => setShowSubmitConfirm(false)}
          onConfirm={async () => {
            setShowSubmitConfirm(false)
            await submitRepo()
          }}
          busy={repoBusy}
        />
      )}

      {reviewAction && (
        <ConfirmReviewCard
          action={reviewAction.action}
          onCancel={() => setReviewAction(null)}
          onConfirm={confirmReviewAction}
          busy={reviewBusy}
        />
      )}

      {showSubmitConfirm && (
        <ConfirmSubmitCard
          onCancel={() => setShowSubmitConfirm(false)}
          onConfirm={async () => {
            setShowSubmitConfirm(false)
            await submitRepo()
          }}
          busy={repoBusy}
        />
      )}
    </div>
  )
}