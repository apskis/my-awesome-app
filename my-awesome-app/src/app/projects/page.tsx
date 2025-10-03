import { Metadata } from 'next'
import { PrismaClient } from '@/generated/prisma'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Progress } from '@/components/ui/progress'
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert'
import { Plus, Calendar, CheckCircle2, Clock, Target } from 'lucide-react'
import Link from 'next/link'
import { formatDistanceToNow } from 'date-fns'

export const metadata: Metadata = {
  title: 'Projects - My Notes App',
  description: 'Track your projects and progress',
}

const prisma = new PrismaClient()

interface ProjectsPageProps {
  searchParams: {
    status?: string
  }
}

async function getProjectsData(status?: string) {
  const demoUser = await prisma.user.findUnique({
    where: { email: 'demo@myawesomeapp.com' },
  })

  if (!demoUser) {
    return []
  }

  // Build where clause
  const where: any = {
    userId: demoUser.id,
  }

  if (status && status !== 'all') {
    where.status = status
  }

  const projects = await prisma.project.findMany({
    where,
    include: {
      _count: {
        select: {
          tasks: true,
        },
      },
    },
    orderBy: [
      { status: 'asc' }, // Active projects first
      { progress: 'desc' }, // Then by progress
    ],
  })

  // Get completed task count for each project
  const projectsWithTaskCounts = await Promise.all(
    projects.map(async (project) => {
      const completedTasks = await prisma.task.count({
        where: {
          projectId: project.id,
          completed: true,
        },
      })

      return {
        ...project,
        completedTasks,
      }
    })
  )

  return projectsWithTaskCounts
}

function getStatusBadgeColor(status: string) {
  switch (status.toLowerCase()) {
    case 'active':
    case 'in_progress':
      return 'bg-primary-blue text-white'
    case 'completed':
    case 'done':
      return 'bg-green-500 text-white'
    case 'on_hold':
    case 'on hold':
      return 'bg-gray-400 text-white'
    case 'planning':
      return 'bg-yellow-500 text-white'
    default:
      return 'bg-gray-500 text-white'
  }
}

function getProgressColor(progress: number) {
  if (progress >= 80) return 'bg-green-500'
  if (progress >= 60) return 'bg-primary-blue'
  if (progress >= 40) return 'bg-yellow-500'
  if (progress >= 20) return 'bg-orange-500'
  return 'bg-red-500'
}

export default async function ProjectsPage({ searchParams }: ProjectsPageProps) {
  const status = searchParams.status

  const projects = await getProjectsData(status)

  const hasProjects = projects.length > 0
  const hasFilters = status && status !== 'all'

  const activeProjects = projects.filter(p => p.status.toLowerCase() === 'active' || p.status.toLowerCase() === 'in_progress')
  const completedProjects = projects.filter(p => p.status.toLowerCase() === 'completed' || p.status.toLowerCase() === 'done')
  const totalTasks = projects.reduce((sum, p) => sum + p._count.tasks, 0)
  const completedTasks = projects.reduce((sum, p) => sum + p.completedTasks, 0)

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Projects</h1>
          <p className="text-muted-foreground mt-1">
            {hasProjects 
              ? `${projects.length} project${projects.length === 1 ? '' : 's'} found`
              : 'No projects yet'
            }
          </p>
        </div>
        <Link href="/projects/new">
          <Button className="bg-primary-blue hover:bg-primary-blue/90">
            <Plus className="w-4 h-4 mr-2" />
            Create Project
          </Button>
        </Link>
      </div>

      {/* Project Statistics */}
      {hasProjects && (
        <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-2">
                <Target className="w-5 h-5 text-primary-blue" />
                <div>
                  <div className="text-2xl font-bold text-foreground">{projects.length}</div>
                  <div className="text-sm text-muted-foreground">Total Projects</div>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-2">
                <Clock className="w-5 h-5 text-yellow-600" />
                <div>
                  <div className="text-2xl font-bold text-foreground">{activeProjects.length}</div>
                  <div className="text-sm text-muted-foreground">Active</div>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-5 h-5 text-green-600" />
                <div>
                  <div className="text-2xl font-bold text-foreground">{completedProjects.length}</div>
                  <div className="text-sm text-muted-foreground">Completed</div>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-2">
                <Calendar className="w-5 h-5 text-accent-cyan" />
                <div>
                  <div className="text-2xl font-bold text-foreground">{totalTasks}</div>
                  <div className="text-sm text-muted-foreground">Total Tasks</div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Status Filter */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Filter by Status</CardTitle>
        </CardHeader>
        <CardContent>
          <Select name="status" defaultValue={status || 'all'}>
            <SelectTrigger className="w-full sm:w-48">
              <SelectValue placeholder="All Status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Status</SelectItem>
              <SelectItem value="active">Active</SelectItem>
              <SelectItem value="in_progress">In Progress</SelectItem>
              <SelectItem value="completed">Completed</SelectItem>
              <SelectItem value="on_hold">On Hold</SelectItem>
              <SelectItem value="planning">Planning</SelectItem>
            </SelectContent>
          </Select>
        </CardContent>
      </Card>

      {/* Projects Grid */}
      {!hasProjects ? (
        <Alert className="text-center py-8">
          <AlertTitle>
            {hasFilters ? 'No projects match your filter' : 'No projects yet'}
          </AlertTitle>
          <AlertDescription className="mt-2">
            {hasFilters 
              ? 'Try adjusting your status filter to see more projects.'
              : 'Start your first project to track your progress!'
            }
          </AlertDescription>
          <Link href="/projects/new">
            <Button className="mt-4 bg-primary-blue hover:bg-primary-blue/90">
              <Plus className="w-4 h-4 mr-2" />
              Create Project
            </Button>
          </Link>
        </Alert>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {projects.map((project) => {
            const taskCompletionRate = project._count.tasks > 0 
              ? Math.round((project.completedTasks / project._count.tasks) * 100)
              : 0

            return (
              <Card 
                key={project.id} 
                className="hover:shadow-lg transition-all duration-200 hover:-translate-y-1"
              >
                <CardHeader className="pb-3">
                  <div className="flex items-start justify-between gap-2">
                    <CardTitle className="text-lg truncate">{project.name}</CardTitle>
                    <Badge className={getStatusBadgeColor(project.status)}>
                      {project.status}
                    </Badge>
                  </div>
                  {project.description && (
                    <p className="text-sm text-muted-foreground line-clamp-2">
                      {project.description}
                    </p>
                  )}
                </CardHeader>
                
                <CardContent className="pt-0">
                  {/* Progress Bar */}
                  <div className="mb-4">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm font-medium text-foreground">Progress</span>
                      <span className="text-sm text-muted-foreground">{project.progress}%</span>
                    </div>
                    <Progress 
                      value={project.progress} 
                      className="h-2"
                      style={{
                        '--progress-background': getProgressColor(project.progress),
                      } as React.CSSProperties}
                    />
                  </div>

                  {/* Task Statistics */}
                  <div className="mb-4">
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-muted-foreground">Tasks</span>
                      <span className="font-medium text-foreground">
                        {project.completedTasks} of {project._count.tasks} completed
                      </span>
                    </div>
                    {project._count.tasks > 0 && (
                      <div className="mt-1">
                        <Progress 
                          value={taskCompletionRate} 
                          className="h-1"
                        />
                        <div className="text-xs text-muted-foreground mt-1">
                          {taskCompletionRate}% task completion
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Created Date */}
                  <div className="flex items-center gap-1 text-xs text-muted-foreground">
                    <Calendar className="w-3 h-3" />
                    <span>Created {formatDistanceToNow(new Date(project.createdAt), { addSuffix: true })}</span>
                  </div>
                </CardContent>
              </Card>
            )
          })}
        </div>
      )}

      {/* Summary Stats */}
      {hasProjects && (
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Project Summary</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="text-center">
                <div className="text-2xl font-bold text-foreground">
                  {Math.round(projects.reduce((sum, p) => sum + p.progress, 0) / projects.length)}%
                </div>
                <div className="text-sm text-muted-foreground">Average Progress</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-foreground">
                  {totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0}%
                </div>
                <div className="text-sm text-muted-foreground">Task Completion</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-foreground">
                  {projects.length > 0 ? Math.round(projects.reduce((sum, p) => sum + p._count.tasks, 0) / projects.length) : 0}
                </div>
                <div className="text-sm text-muted-foreground">Avg Tasks/Project</div>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}