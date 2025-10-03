'use client'

import { useState, useEffect } from 'react'
import { FileText, FolderOpen, CheckSquare, TrendingUp, Plus, Eye, Loader2 } from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Alert, AlertDescription } from '@/components/ui/alert'
import Link from 'next/link'
import { formatDistanceToNow } from 'date-fns'

interface Note {
  id: string
  title: string
  content: string
  status: string
  category?: {
    id: string
    name: string
    color: string
  }
  createdAt: string
  updatedAt: string
}

interface DashboardStats {
  totalNotes: number
  notesByStatus: {
    DRAFT: number
    PUBLISHED: number
    ARCHIVED: number
  }
  totalCategories: number
  totalTasks: number
  completedTasks: number
  activeProjects: number
}

function getStatusBadgeVariant(status: string) {
  switch (status) {
    case 'DRAFT':
      return 'bg-orange-500 text-white'
    case 'PUBLISHED':
      return 'bg-blue-600 text-white'
    case 'ARCHIVED':
      return 'bg-cyan-400 text-white'
    default:
      return 'bg-gray-500 text-white'
  }
}

export default function DashboardPage() {
  const [stats, setStats] = useState<DashboardStats>({
    totalNotes: 0,
    notesByStatus: { DRAFT: 0, PUBLISHED: 0, ARCHIVED: 0 },
    totalCategories: 0,
    totalTasks: 0,
    completedTasks: 0,
    activeProjects: 0
  })
  const [recentNotes, setRecentNotes] = useState<Note[]>([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        // Fetch recent notes
        const notesResponse = await fetch('/api/notes?page=1')
        if (notesResponse.ok) {
          const notesData = await notesResponse.json()
          setRecentNotes(notesData.notes.slice(0, 5))
          
          // Calculate stats from notes data
          const notesByStatus = notesData.notes.reduce((acc: any, note: Note) => {
            acc[note.status] = (acc[note.status] || 0) + 1
            return acc
          }, { DRAFT: 0, PUBLISHED: 0, ARCHIVED: 0 })

          setStats(prev => ({
            ...prev,
            totalNotes: notesData.total,
            notesByStatus
          }))
        }

        // Fetch categories
        const categoriesResponse = await fetch('/api/categories')
        if (categoriesResponse.ok) {
          const categoriesData = await categoriesResponse.json()
          setStats(prev => ({
            ...prev,
            totalCategories: categoriesData.categories.length
          }))
        }

        // Mock data for tasks and projects (since we don't have those APIs yet)
        setStats(prev => ({
          ...prev,
          totalTasks: 12,
          completedTasks: 8,
          activeProjects: 3
        }))

      } catch (error) {
        console.error('Error fetching dashboard data:', error)
      } finally {
        setIsLoading(false)
      }
    }

    fetchDashboardData()
  }, [])

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="h-8 w-48 bg-gray-200 rounded animate-pulse" />
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {[...Array(4)].map((_, i) => (
            <Card key={i}>
              <CardContent className="p-6">
                <div className="h-6 w-6 bg-gray-200 rounded animate-pulse mb-2" />
                <div className="h-8 w-16 bg-gray-200 rounded animate-pulse mb-1" />
                <div className="h-4 w-24 bg-gray-200 rounded animate-pulse" />
              </CardContent>
            </Card>
          ))}
        </div>
        <Card>
          <CardHeader>
            <div className="h-6 w-32 bg-gray-200 rounded animate-pulse" />
          </CardHeader>
          <CardContent className="space-y-4">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="h-16 w-full bg-gray-200 rounded animate-pulse" />
            ))}
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-blue-600">Dashboard</h1>
          <p className="text-muted-foreground mt-1">
            Welcome back! Here's what's happening with your notes.
          </p>
        </div>
        <Link href="/notes/new">
          <Button className="bg-blue-600 hover:bg-blue-700">
            <Plus className="w-4 h-4 mr-2" />
            Create New Note
          </Button>
        </Link>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {/* Total Notes */}
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Total Notes</p>
                <div className="text-3xl font-bold text-blue-600">{stats.totalNotes}</div>
              </div>
              <FileText className="w-6 h-6 text-blue-600" />
            </div>
          </CardContent>
        </Card>

        {/* Notes by Status */}
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Published</p>
                <div className="text-3xl font-bold text-blue-600">{stats.notesByStatus.PUBLISHED}</div>
              </div>
              <Eye className="w-6 h-6 text-blue-600" />
            </div>
          </CardContent>
        </Card>

        {/* Categories */}
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Categories</p>
                <div className="text-3xl font-bold text-blue-600">{stats.totalCategories}</div>
              </div>
              <FolderOpen className="w-6 h-6 text-blue-600" />
            </div>
          </CardContent>
        </Card>

        {/* Tasks */}
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Tasks</p>
                <div className="text-3xl font-bold text-blue-600">{stats.completedTasks}/{stats.totalTasks}</div>
              </div>
              <CheckSquare className="w-6 h-6 text-blue-600" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Recent Notes */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="text-xl">Recent Notes</CardTitle>
            <Link href="/notes">
              <Button variant="outline" size="sm">
                View All Notes
              </Button>
            </Link>
          </div>
        </CardHeader>
        <CardContent>
          {recentNotes.length === 0 ? (
            <Alert>
              <FileText className="h-4 w-4" />
              <AlertDescription>
                No notes yet. Create your first note to get started!
              </AlertDescription>
            </Alert>
          ) : (
            <div className="space-y-4">
              {recentNotes.map((note) => (
                <div key={note.id} className="flex items-center justify-between p-4 border rounded-lg hover:bg-slate-50 transition-colors">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <Link href={`/notes/${note.id}`} className="font-medium text-slate-800 hover:text-blue-600">
                        {note.title}
                      </Link>
                      <Badge className={getStatusBadgeVariant(note.status)}>
                        {note.status}
                      </Badge>
                      {note.category && (
                        <Badge
                          variant="secondary"
                          style={{ 
                            backgroundColor: note.category.color + '20', 
                            color: note.category.color 
                          }}
                        >
                          {note.category.name}
                        </Badge>
                      )}
                    </div>
                    <p className="text-sm text-muted-foreground">
                      {note.content.length > 100 
                        ? note.content.substring(0, 100) + '...' 
                        : note.content
                      }
                    </p>
                    <p className="text-xs text-muted-foreground mt-1">
                      {formatDistanceToNow(new Date(note.createdAt), { addSuffix: true })}
                    </p>
                  </div>
                  <Link href={`/notes/${note.id}`}>
                    <Button variant="ghost" size="sm">
                      <Eye className="w-4 h-4" />
                    </Button>
                  </Link>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}