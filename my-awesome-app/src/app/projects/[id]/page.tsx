import { Metadata } from 'next'
import { PrismaClient } from '@/generated/prisma'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Progress } from '@/components/ui/progress'
import { Checkbox } from '@/components/ui/checkbox'
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert'
import { ArrowLeft, Calendar, CheckCircle2, Clock, Target, Edit, Trash2 } from 'lucide-react'
import Link from 'next/link'
import { formatDistanceToNow } from 'date-fns'

export const metadata: Metadata = {
  title: 'Project Details - My Notes App',
  description: 'View project details and tasks',
}

const prisma = new PrismaClient()

interface ProjectDetailPageProps {
  params: Promise<{ id: string }>
}

async function getProjectData(projectId: string) {
  const project = await prisma.project.findUnique({
    where: { id: projectId },
    include: {
      tasks: {
        orderBy: [
          { completed: 'asc' },
          { dueDate: 'asc' },
          { priority: 'desc' }
        ]
      }
    }
  })

  if (!project) {
    return null
  }

  const taskCount = project.tasks.length
  const completedTaskCount = project.tasks.filter(task => task.completed).length

  return {
    ...project,
    taskCount,
    completedTaskCount
  }
}

function getStatusBadgeColor(status: string) {
  switch (status) {
    case 'IN_PROGRESS':
      return 'bg-primary-blue text-white'
    case 'COMPLETED':
      return 'bg-green-500 text-white'
    case 'ON_HOLD':
      return 'bg-gray-400 text-white'
    case 'PLANNING':
      return 'bg-yellow-500 text-white'
    case 'CANCELLED':
      return 'bg-red-500 text-white'
    default:
      return 'bg-gray-500 text-white'
  }
}

function getPriorityBadgeColor(priority: string) {
  switch (priority) {
    case 'HIGH':
      return 'bg-red-500 text-white'
    case 'MEDIUM':
      return 'bg-yellow-500 text-white'
    case 'LOW':
      return 'bg-green-500 text-white'
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

export default async function ProjectDetailPage({ params }: ProjectDetailPageProps) {
  const { id } = await params
  const project = await getProjectData(id)

  if (!project) {
    return (
      <div className="container mx-auto max-w-4xl py-8">
        <Alert className="text-center py-8">
          <AlertTitle>Project not found</AlertTitle>
          <AlertDescription className="mt-2">
            The project you're looking for doesn't exist or has been deleted.
          </AlertDescription>
          <Link href="/projects">
            <Button className="mt-4" variant="outline">
              Back to Projects
            </Button>
          </Link>
        </Alert>
      </div>
    )
  }

  const hasTasks = project.tasks.length > 0
  const completedTasks = project.tasks.filter(t => t.completed).length
  const overdueTasks = project.tasks.filter(t => 
    t.dueDate && new Date(t.dueDate) < new Date() && !t.completed
  ).length

  return (
    <div className="container mx-auto max-w-4xl py-8">
      {/* Header */}
      <div className="mb-6">
        <Link 
          href="/projects" 
          className="inline-flex items-center text-sm text-muted-foreground hover:text-foreground mb-4"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to Projects
        </Link>
        <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold text-foreground">{project.name}</h1>
            <div className="flex items-center gap-2 mt-2">
              <Badge className={getStatusBadgeColor(project.status)}>
                {project.status.replace('_', ' ')}
              </Badge>
              <span className="text-sm text-muted-foreground">
                Created {formatDistanceToNow(new Date(project.createdAt), { addSuffix: true })}
              </span>
            </div>
          </div>
          <div className="flex gap-2">
            <Link href={`/projects/${project.id}/edit`}>
              <Button variant="outline" size="sm">
                <Edit className="w-4 h-4 mr-2" />
                Edit
              </Button>
            </Link>
            <Button variant="outline" size="sm" className="text-red-600 hover:text-red-700">
              <Trash2 className="w-4 h-4 mr-2" />
              Delete
            </Button>
          </div>
        </div>
        {project.description && (
          <p className="text-muted-foreground mt-3">{project.description}</p>
        )}
      </div>

      {/* Project Statistics */}
      <div className="grid grid-cols-1 sm:grid-cols-4 gap-4 mb-6">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <Target className="w-5 h-5 text-primary-blue" />
              <div>
                <div className="text-2xl font-bold text-foreground">{project.taskCount}</div>
                <div className="text-sm text-muted-foreground">Total Tasks</div>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-5 h-5 text-green-600" />
              <div>
                <div className="text-2xl font-bold text-foreground">{completedTasks}</div>
                <div className="text-sm text-muted-foreground">Completed</div>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <Clock className="w-5 h-5 text-yellow-600" />
              <div>
                <div className="text-2xl font-bold text-foreground">{project.taskCount - completedTasks}</div>
                <div className="text-sm text-muted-foreground">Pending</div>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <Calendar className="w-5 h-5 text-red-600" />
              <div>
                <div className="text-2xl font-bold text-foreground">{overdueTasks}</div>
                <div className="text-sm text-muted-foreground">Overdue</div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Progress Overview */}
      <Card className="mb-6">
        <CardHeader>
          <CardTitle>Project Progress</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium text-foreground">Overall Progress</span>
            <span className="text-sm text-muted-foreground">{project.progress}%</span>
          </div>
          <Progress 
            value={project.progress} 
            className="h-3 mb-4"
            style={{
              '--progress-background': getProgressColor(project.progress),
            } as React.CSSProperties}
          />
          <div className="text-sm text-muted-foreground">
            {completedTasks} of {project.taskCount} tasks completed
          </div>
        </CardContent>
      </Card>

      {/* Tasks Section */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>Tasks ({project.taskCount})</CardTitle>
            <Link href={`/tasks/new?projectId=${project.id}`}>
              <Button size="sm" className="bg-primary-blue hover:bg-primary-blue/90">
                Add Task
              </Button>
            </Link>
          </div>
        </CardHeader>
        <CardContent>
          {!hasTasks ? (
            <Alert className="text-center py-8">
              <AlertTitle>No tasks yet</AlertTitle>
              <AlertDescription className="mt-2">
                Get started by adding your first task to this project.
              </AlertDescription>
              <Link href={`/tasks/new?projectId=${project.id}`}>
                <Button className="mt-4 bg-primary-blue hover:bg-primary-blue/90">
                  Add First Task
                </Button>
              </Link>
            </Alert>
          ) : (
            <div className="space-y-3">
              {project.tasks.map((task) => {
                const isOverdue = task.dueDate && new Date(task.dueDate) < new Date() && !task.completed
                
                return (
                  <Card 
                    key={task.id} 
                    className={`transition-all duration-200 ${
                      task.completed 
                        ? 'opacity-60 bg-gray-50' 
                        : 'hover:shadow-md'
                    }`}
                  >
                    <CardContent className="p-4">
                      <div className="flex items-start gap-3">
                        {/* Checkbox */}
                        <Checkbox
                          checked={task.completed}
                          className="mt-1"
                          aria-label={`Mark task "${task.title}" as ${task.completed ? 'incomplete' : 'complete'}`}
                        />
                        
                        {/* Task Content */}
                        <div className="flex-1 min-w-0">
                          <div className="flex items-start justify-between gap-2">
                            <h3 className={`font-medium text-foreground ${
                              task.completed ? 'line-through text-muted-foreground' : ''
                            }`}>
                              {task.title}
                            </h3>
                            <div className="flex items-center gap-2 flex-shrink-0">
                              <Badge className={getPriorityBadgeColor(task.priority)}>
                                {task.priority}
                              </Badge>
                            </div>
                          </div>
                          
                          {task.description && (
                            <p className="text-sm text-muted-foreground mt-1">
                              {task.description}
                            </p>
                          )}
                          
                          <div className="flex items-center gap-4 mt-2 text-sm">
                            {task.dueDate && (
                              <div className={`flex items-center gap-1 ${isOverdue ? 'text-red-600' : 'text-muted-foreground'}`}>
                                <Calendar className="w-3 h-3" />
                                <span>
                                  Due {formatDistanceToNow(new Date(task.dueDate), { addSuffix: true })}
                                  {isOverdue && ' (Overdue)'}
                                </span>
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                )
              })}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
