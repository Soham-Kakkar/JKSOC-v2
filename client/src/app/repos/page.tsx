"use client"

import React, { useEffect, useState } from 'react'
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card'
import { Table, TableHeader, TableRow, TableHead, TableBody, TableCell } from '@/components/ui/table'
import { apiFetch } from '@/lib/api'

type Repo = {
  id: number
  repoUrl: string
  description?: string
  creator?: {
    githubUsername?: string
  }
}
export default function RepositoriesPage() {
  const [repos, setRepos] = useState<Array<Repo>>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    let mounted = true
    const load = async () => {
      setLoading(true)
      setError(null)
      try {
        const res = await apiFetch('/repos')
        if (!res.ok) throw new Error('Failed to fetch')
        const data = await res.json()
        if (!mounted) return
        setRepos(data || [])
      } catch (err) {
        console.error(err)
        setError(err instanceof Error ? err.message : 'Failed to load')
      } finally {
        if (mounted) setLoading(false)
      }
    }
    load()
    return () => { mounted = false }
  }, [])

  return (
    <div className="fw-full px-4 flex flex-col justify-center items-center">
      <h1 className="text-2xl font-bold mb-6">Repositories</h1>
      {loading ? (
        <p>Loading...</p>
      ) : error ? (
        <p className="text-red-500">{error}</p>
      ) : repos.length === 0 ? (
        <p>No repositories found.</p>
      ) : (
        <Card className="w-full max-w-4xl">
          <CardHeader className='text-center'>
            <CardTitle>Approved Repositories</CardTitle>
            <CardDescription>
              All approved repositories and their maintainers
            </CardDescription>
          </CardHeader>

          <CardContent>
            <Table className="min-w-[700px] max-w-full">
              <TableHeader>
                <tr>
                  <TableHead>Repository</TableHead>
                  <TableHead>Maintainer</TableHead>
                  <TableHead>Description</TableHead>
                </tr>
              </TableHeader>

              <TableBody>
                {repos.map((r) => (
                  <TableRow key={r.id}>
                    <TableCell>
                      <a
                        className="text-blue-600 hover:underline"
                        href={`https://${r.repoUrl}`}
                        target="_blank"
                        rel="noreferrer"
                      >
                        {r.repoUrl}
                      </a>
                    </TableCell>
                    <TableCell>{r.creator?.githubUsername || 'Unknown'}</TableCell>
                    <TableCell>
                      {r.description || (
                        <span className="text-muted-foreground">
                          No description
                        </span>
                      )}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
