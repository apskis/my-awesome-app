import { Metadata } from 'next'
import { PrismaClient } from '@/generated/prisma'
import { Plus, TrendingUp, Clock, CheckCircle } from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import Link from 'next/link'

export const metadata: Metadata = {
  title: 'Projects - My Awesome Notes',
  description: 'Manage your projects and track progress',
}

const prisma = new PrismaClient()

async function getProjects() {
  // TODO: In production, filter by actual user ID from session
  const demoUser = await prisma.user.findUnique({
    where: { email: 'demo@example.com' },
  })

  if (!demoUser) {
    return []
  }

  const projects = await prisma.project.findMany({
    where: { userId: demoUser.id },
    include: {
      tasks: {
        select: {
          id: true,
          completed: true,
        },
      },
    },
    orderBy: { updatedAt: 'desc' },
  })

  return projects
}

function getStatusColor(status: string) {
  switch (status) {
    case 'COMPLETED':
      return 'bg-primary text-primary-foreground'
    case 'IN_PROGRESS':
      return 'bg-secondary text-secondary-foreground'
    case 'PLANNING':
      return 'bg-warning/20 text-warning border-warning'
    case 'ON_HOLD':
      return 'bg-muted text-muted-foreground border-muted-foreground'
    case 'CANCELLED':
      return 'bg-destructive/20 text-destructive border-destructive'
    default:
      return ''
  }
}

function getStatusIcon(status: string) {
  switch (status) {
    case 'COMPLETED':
      return CheckCircle
    case 'IN_PROGRESS':
      return TrendingUp
    case 'PLANNING':
      return Clock
    default:
      return Clock
  }
}

export default async function ProjectsPage() {
  const projects = await getProjects()

  const stats = {
    total: projects.length,
    inProgress: projects.filter((p) => p.status === 'IN_PROGRESS').length,
    completed: projects.filter((p) => p.status === 'COMPLETED').length,
    planning: projects.filter((p) => p.status === 'PLANNING').length,
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Projects</h1>
          <p className="text-muted-foreground mt-1">
            Track and manage your projects
          </p>
        </div>
        <Button className="w-full sm:w-auto">
          <Plus className="w-4 h-4 mr-2" />
          New Project
        </Button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Total Projects
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-foreground">{stats.total}</div>
          </CardContent>
        </Card>

        <Card className="border-l-4 border-l-secondary">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              In Progress
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-foreground">{stats.inProgress}</div>
          </CardContent>
        </Card>

        <Card className="border-l-4 border-l-primary">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Completed
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-foreground">{stats.completed}</div>
          </CardContent>
        </Card>

        <Card className="border-l-4 border-l-warning">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Planning
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-foreground">{stats.planning}</div>
          </CardContent>
        </Card>
      </div>

      {/* Projects Grid */}
      {projects.length === 0 ? (
        <Card className="p-12">
          <div className="text-center">
            <div className="w-16 h-16 bg-muted rounded-full flex items-center justify-center mx-auto mb-4">
              <Plus className="w-8 h-8 text-muted-foreground" />
            </div>
            <h3 className="text-lg font-semibold text-foreground mb-2">
              No projects yet
            </h3>
            <p className="text-muted-foreground mb-6">
              Start organizing your work by creating your first project
            </p>
            <Button>
              <Plus className="w-4 h-4 mr-2" />
              Create Project
            </Button>
          </div>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
          {projects.map((project) => {
            const StatusIcon = getStatusIcon(project.status)
            const totalTasks = project.tasks.length
            const completedTaskCount = project.tasks.filter((t) => t.completed).length

            return (
              <Link key={project.id} href={`/projects/${project.id}`}>
                <Card className="h-full hover:shadow-lg hover:border-primary transition-all cursor-pointer group">
                  <CardContent className="p-6">
                    {/* Header */}
                    <div className="flex items-start justify-between gap-2 mb-4">
                      <div className="flex items-start gap-3 flex-1 min-w-0">
                        <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center flex-shrink-0 group-hover:bg-primary group-hover:text-primary-foreground transition-colors">
                          <StatusIcon className="w-5 h-5 text-primary group-hover:text-primary-foreground" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <h3 className="font-semibold text-foreground line-clamp-2 group-hover:text-primary transition-colors">
                            {project.name}
                          </h3>
                        </div>
                      </div>
                      <Badge className={getStatusColor(project.status)}>
                        {project.status.replace('_', ' ')}
                      </Badge>
                    </div>

                    {/* Description */}
                    {project.description && (
                      <p className="text-sm text-muted-foreground line-clamp-2 mb-4">
                        {project.description}
                      </p>
                    )}

                    {/* Progress Bar */}
                    <div className="space-y-2 mb-4">
                      <div className="flex items-center justify-between text-xs text-muted-foreground">
                        <span>Progress</span>
                        <span className="font-medium">{project.progress}%</span>
                      </div>
                      <div className="w-full bg-muted rounded-full h-2.5">
                        <div
                          className="bg-primary h-2.5 rounded-full transition-all"
                          style={{ width: `${project.progress}%` }}
                        />
                      </div>
                    </div>

                    {/* Tasks Summary */}
                    {totalTasks > 0 && (
                      <div className="flex items-center justify-between text-xs pt-3 border-t border-border">
                        <span className="text-muted-foreground">Tasks</span>
                        <span className="font-medium text-foreground">
                          {completedTaskCount}/{totalTasks} completed
                        </span>
                      </div>
                    )}

                    {/* Last Updated */}
                    <div className="text-xs text-muted-foreground mt-2">
                      Updated {new Date(project.updatedAt).toLocaleDateString()}
                    </div>
                  </CardContent>
                </Card>
              </Link>
            )
          })}
        </div>
      )}
    </div>
  )
}

