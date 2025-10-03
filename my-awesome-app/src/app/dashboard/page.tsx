import { Metadata } from 'next'
import { PrismaClient } from '@/generated/prisma'
import { FileText, FolderOpen, CheckSquare, TrendingUp, Plus, Eye } from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Alert, AlertDescription } from '@/components/ui/alert'
import Link from 'next/link'
import { formatDistanceToNow } from 'date-fns'

export const metadata: Metadata = {
  title: 'Dashboard - My Notes App',
  description: 'View your notes dashboard with recent activity and statistics',
}

const prisma = new PrismaClient()

async function getDashboardData() {
  try {
    // Get demo user (in production, this would come from session/auth)
    const demoUser = await prisma.user.findUnique({
      where: { email: 'demo@myawesomeapp.com' },
    })

    if (!demoUser) {
      return {
        stats: {
          totalNotes: 0,
          notesByStatus: { DRAFT: 0, PUBLISHED: 0, ARCHIVED: 0 },
          totalCategories: 0,
          totalTasks: 0,
          completedTasks: 0,
          activeProjects: 0,
        },
        recentNotes: [],
        hasData: false,
      }
    }

    // Get all required data in parallel
    const [
      totalNotes,
      notesByStatus,
      totalCategories,
      totalTasks,
      completedTasks,
      activeProjects,
      recentNotes,
    ] = await Promise.all([
      // Total note count
      prisma.note.count({ where: { userId: demoUser.id } }),
      
      // Notes by status (group count)
      prisma.note.groupBy({
        by: ['status'],
        where: { userId: demoUser.id },
        _count: { status: true },
      }),
      
      // Total categories count
      prisma.category.count({ where: { userId: demoUser.id } }),
      
      // Total tasks count
      prisma.task.count({ where: { userId: demoUser.id } }),
      
      // Completed tasks count
      prisma.task.count({ 
        where: { 
          userId: demoUser.id,
          completed: true 
        } 
      }),
      
      // Active projects count
      prisma.project.count({ 
        where: { 
          userId: demoUser.id,
          status: 'IN_PROGRESS' 
        } 
      }),
      
      // Recent 5 notes with category
      prisma.note.findMany({
        where: { userId: demoUser.id },
        orderBy: { createdAt: 'desc' },
        take: 5,
        include: {
          category: true,
        },
      }),
    ])

    // Transform notes by status into object
    const statusCounts = notesByStatus.reduce((acc, item) => {
      acc[item.status] = item._count.status
      return acc
    }, {} as Record<string, number>)

    return {
      stats: {
        totalNotes,
        notesByStatus: {
          DRAFT: statusCounts.DRAFT || 0,
          PUBLISHED: statusCounts.PUBLISHED || 0,
          ARCHIVED: statusCounts.ARCHIVED || 0,
        },
        totalCategories,
        totalTasks,
        completedTasks,
        activeProjects,
      },
      recentNotes,
      hasData: totalNotes > 0,
    }
  } catch (error) {
    console.error('Error fetching dashboard data:', error)
    return {
      stats: {
        totalNotes: 0,
        notesByStatus: { DRAFT: 0, PUBLISHED: 0, ARCHIVED: 0 },
        totalCategories: 0,
        totalTasks: 0,
        completedTasks: 0,
        activeProjects: 0,
      },
      recentNotes: [],
      hasData: false,
    }
  }
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

function formatDate(date: Date) {
  const now = new Date()
  const diffInDays = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60 * 24))
  
  if (diffInDays === 0) {
    return 'Today'
  } else if (diffInDays === 1) {
    return 'Yesterday'
  } else if (diffInDays < 7) {
    return `${diffInDays} days ago`
  } else {
    return date.toLocaleDateString('en-US', { 
      month: 'short', 
      day: 'numeric', 
      year: 'numeric' 
    })
  }
}

export default async function DashboardPage() {
  const { stats, recentNotes, hasData } = await getDashboardData()

  return (
    <div className="space-y-8 p-4 md:p-6 lg:p-8">
      {/* Page Header */}
      <div>
        <h1 className="text-3xl font-bold text-foreground mb-2">Dashboard</h1>
        <p className="text-muted-foreground">
          Welcome back! Here's what's happening with your productivity hub.
        </p>
      </div>

      {/* Empty State */}
      {!hasData && (
        <Alert className="border-warning-orange/20 bg-warning-orange/5">
          <AlertDescription className="text-center py-8">
            <div className="space-y-4">
              <p className="text-lg font-medium">No notes yet. Create your first note!</p>
              <p className="text-muted-foreground">
                Get started by creating your first note to organize your thoughts and ideas.
              </p>
              <Button asChild className="bg-blue-600 hover:bg-blue-600/90 text-white">
                <Link href="/notes">
                  <Plus className="w-4 h-4 mr-2" />
                  Create New Note
                </Link>
              </Button>
            </div>
          </AlertDescription>
        </Alert>
      )}

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 md:gap-6">
        {/* Total Notes */}
        <Card className="bg-white shadow-sm">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
              <FileText className="w-4 h-4 text-blue-600" />
              Total Notes
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-blue-600">{stats.totalNotes}</div>
            <p className="text-xs text-muted-foreground mt-1">
              Across {stats.totalCategories} categories
            </p>
          </CardContent>
        </Card>

        {/* Notes by Status - Draft */}
        <Card className="bg-white shadow-sm">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Draft Notes
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-warning-orange">{stats.notesByStatus.DRAFT}</div>
            <p className="text-xs text-muted-foreground mt-1">
              In progress
            </p>
          </CardContent>
        </Card>

        {/* Notes by Status - Published */}
        <Card className="bg-white shadow-sm">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Published Notes
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-blue-600">{stats.notesByStatus.PUBLISHED}</div>
            <p className="text-xs text-muted-foreground mt-1">
              Ready to share
            </p>
          </CardContent>
        </Card>

        {/* Notes by Status - Archived */}
        <Card className="bg-white shadow-sm">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Archived Notes
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-accent-cyan">{stats.notesByStatus.ARCHIVED}</div>
            <p className="text-xs text-muted-foreground mt-1">
              Stored away
            </p>
          </CardContent>
        </Card>

        {/* Total Categories */}
        <Card className="bg-white shadow-sm">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
              <FolderOpen className="w-4 h-4 text-accent-cyan" />
              Total Categories
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-accent-cyan">{stats.totalCategories}</div>
            <p className="text-xs text-muted-foreground mt-1">
              Organized content
            </p>
          </CardContent>
        </Card>

        {/* Total Tasks */}
        <Card className="bg-white shadow-sm">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
              <CheckSquare className="w-4 h-4 text-warning-orange" />
              Total Tasks
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-warning-orange">{stats.totalTasks}</div>
            <p className="text-xs text-muted-foreground mt-1">
              {stats.completedTasks} completed
            </p>
          </CardContent>
        </Card>

        {/* Active Projects */}
        <Card className="bg-white shadow-sm">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
              <TrendingUp className="w-4 h-4 text-blue-600" />
              Active Projects
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-blue-600">{stats.activeProjects}</div>
            <p className="text-xs text-muted-foreground mt-1">
              In progress
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Recent Notes Section */}
      <Card className="bg-white shadow-sm">
        <CardHeader>
          <h2 className="text-xl font-semibold text-foreground">Recent Notes</h2>
        </CardHeader>
        <CardContent>
          {recentNotes.length === 0 ? (
            <div className="text-center py-8">
              <p className="text-muted-foreground mb-4">No notes yet. Create your first note!</p>
              <Button asChild className="bg-blue-600 hover:bg-blue-600/90 text-white">
                <Link href="/notes">
                  <Plus className="w-4 h-4 mr-2" />
                  Create New Note
                </Link>
              </Button>
            </div>
          ) : (
            <div className="space-y-4">
              {recentNotes.map((note) => (
                <Link
                  key={note.id}
                  href={`/notes/${note.id}`}
                  className="block p-4 rounded-lg border border-gray-200 hover:border-blue-600 hover:bg-blue-600/5 transition-all duration-200"
                >
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex-1 min-w-0">
                      <h3 className="font-medium text-foreground text-base mb-1 line-clamp-1">
                        {note.title}
                      </h3>
                      <p className="text-sm text-muted-foreground">
                        {formatDate(note.createdAt)}
                      </p>
                    </div>
                    <div className="flex items-center gap-2 flex-shrink-0">
                      {note.category && (
                        <Badge
                          variant="outline"
                          className="text-xs"
                          style={{ 
                            borderColor: note.category.color,
                            color: note.category.color 
                          }}
                        >
                          {note.category.name}
                        </Badge>
                      )}
                      <Badge
                        className={`text-xs ${getStatusBadgeVariant(note.status)}`}
                      >
                        {note.status}
                      </Badge>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Quick Actions */}
      <Card className="bg-white shadow-sm">
        <CardHeader>
          <h2 className="text-xl font-semibold text-foreground">Quick Actions</h2>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col sm:flex-row gap-4">
            <Button asChild className="bg-blue-600 hover:bg-blue-600/90 text-white flex-1">
              <Link href="/notes">
                <Plus className="w-4 h-4 mr-2" />
                Create New Note
              </Link>
            </Button>
            <Button asChild variant="outline" className="flex-1">
              <Link href="/notes">
                <Eye className="w-4 h-4 mr-2" />
                View All Notes
              </Link>
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}