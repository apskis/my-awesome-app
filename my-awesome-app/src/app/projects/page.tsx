'use client'

import { useState, useEffect } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Progress } from '@/components/ui/progress'
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert'
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '@/components/ui/alert-dialog'
import { Plus, Calendar, CheckCircle2, Clock, Target, Edit, Trash2, Loader2 } from 'lucide-react'
import Link from 'next/link'
import { formatDistanceToNow } from 'date-fns'
import { toast } from 'sonner'

interface Project {
  id: string
  name: string
  description?: string
  status: 'PLANNING' | 'IN_PROGRESS' | 'ON_HOLD' | 'COMPLETED' | 'CANCELLED'
  progress: number
  userId: string
  createdAt: string
  updatedAt: string
  taskCount: number
  completedTaskCount: number
}

export default function ProjectsPage() {
  const router = useRouter()
  const searchParams = useSearchParams()
  
  const [projects, setProjects] = useState<Project[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [isDeleting, setIsDeleting] = useState<string | null>(null)
  
  // Filter state
  const [status, setStatus] = useState(searchParams.get('status') || 'all')

  // Load projects
  useEffect(() => {
    const fetchProjects = async () => {
      try {
        setIsLoading(true)
        
        // Build query params
        const params = new URLSearchParams()
        if (status !== 'all') params.set('status', status)

        const response = await fetch(`/api/projects?${params.toString()}`)

        if (response.ok) {
          const data = await response.json()
          setProjects(data.projects || [])
        } else {
          toast.error('Failed to load projects')
        }
      } catch (error) {
        console.error('Failed to fetch projects:', error)
        toast.error('Failed to load projects')
      } finally {
        setIsLoading(false)
      }
    }

    fetchProjects()
  }, [status])

  const handleDeleteProject = async (projectId: string) => {
    try {
      setIsDeleting(projectId)
      
      const response = await fetch(`/api/projects/${projectId}`, {
        method: 'DELETE',
      })

      if (response.ok) {
        // Remove the project from local state
        setProjects(prevProjects => prevProjects.filter(project => project.id !== projectId))
        toast.success('Project deleted successfully!')
      } else {
        const errorData = await response.json()
        toast.error(errorData.error || 'Failed to delete project')
      }
    } catch (error) {
      console.error('Error deleting project:', error)
      toast.error('Failed to delete project')
    } finally {
      setIsDeleting(null)
    }
  }

  const updateUrl = () => {
    const params = new URLSearchParams()
    if (status !== 'all') params.set('status', status)
    
    const newUrl = params.toString() ? `?${params.toString()}` : ''
    router.push(`/projects${newUrl}`, { scroll: false })
  }

  // Update URL when filter changes
  useEffect(() => {
    updateUrl()
  }, [status])

  const hasProjects = projects.length > 0
  const hasFilters = status !== 'all'

  const activeProjects = projects.filter(p => p.status === 'IN_PROGRESS')
  const completedProjects = projects.filter(p => p.status === 'COMPLETED')
  const totalTasks = projects.reduce((sum, p) => sum + p.taskCount, 0)
  const completedTasks = projects.reduce((sum, p) => sum + p.completedTaskCount, 0)

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

  function getProgressColor(progress: number) {
    if (progress >= 80) return 'bg-green-500'
    if (progress >= 60) return 'bg-primary-blue'
    if (progress >= 40) return 'bg-yellow-500'
    if (progress >= 20) return 'bg-orange-500'
    return 'bg-red-500'
  }

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-center py-12">
          <Loader2 className="w-8 h-8 animate-spin" />
        </div>
      </div>
    )
  }

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
          <Select value={status} onValueChange={setStatus}>
            <SelectTrigger className="w-full sm:w-48">
              <SelectValue placeholder="All Status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Status</SelectItem>
              <SelectItem value="PLANNING">Planning</SelectItem>
              <SelectItem value="IN_PROGRESS">In Progress</SelectItem>
              <SelectItem value="ON_HOLD">On Hold</SelectItem>
              <SelectItem value="COMPLETED">Completed</SelectItem>
              <SelectItem value="CANCELLED">Cancelled</SelectItem>
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
            const taskCompletionRate = project.taskCount > 0 
              ? Math.round((project.completedTaskCount / project.taskCount) * 100)
              : 0

            return (
              <Card 
                key={project.id} 
                className="hover:shadow-lg transition-all duration-200 hover:-translate-y-1"
              >
                <CardHeader className="pb-3">
                  <div className="flex items-start justify-between gap-2">
                    <Link href={`/projects/${project.id}`} className="flex-1">
                      <CardTitle className="text-lg truncate hover:text-primary-blue cursor-pointer">
                        {project.name}
                      </CardTitle>
                    </Link>
                    <Badge className={getStatusBadgeColor(project.status)}>
                      {project.status.replace('_', ' ')}
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
                        {project.completedTaskCount} of {project.taskCount} completed
                      </span>
                    </div>
                    {project.taskCount > 0 && (
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
                  <div className="flex items-center gap-1 text-xs text-muted-foreground mb-4">
                    <Calendar className="w-3 h-3" />
                    <span>Created {formatDistanceToNow(new Date(project.createdAt), { addSuffix: true })}</span>
                  </div>

                  {/* Action Buttons */}
                  <div className="flex items-center justify-between">
                    <Link href={`/projects/${project.id}/edit`}>
                      <Button variant="outline" size="sm">
                        <Edit className="w-4 h-4 mr-2" />
                        Edit
                      </Button>
                    </Link>
                    <AlertDialog>
                      <AlertDialogTrigger asChild>
                        <Button 
                          variant="outline" 
                          size="sm" 
                          className="text-red-600 hover:text-red-700"
                          disabled={isDeleting === project.id}
                        >
                          {isDeleting === project.id ? (
                            <Loader2 className="w-4 h-4 animate-spin" />
                          ) : (
                            <>
                              <Trash2 className="w-4 h-4 mr-2" />
                              Delete
                            </>
                          )}
                        </Button>
                      </AlertDialogTrigger>
                      <AlertDialogContent>
                        <AlertDialogHeader>
                          <AlertDialogTitle>Delete Project</AlertDialogTitle>
                          <AlertDialogDescription>
                            Are you sure you want to delete "{project.name}"? This action cannot be undone.
                            {project.taskCount > 0 && (
                              <span className="block mt-2 text-red-600 font-medium">
                                This project has {project.taskCount} task{project.taskCount === 1 ? '' : 's'}. 
                                You must delete or reassign all tasks before deleting the project.
                              </span>
                            )}
                          </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                          <AlertDialogCancel>Cancel</AlertDialogCancel>
                          <AlertDialogAction
                            onClick={() => handleDeleteProject(project.id)}
                            className="bg-red-600 hover:bg-red-700"
                            disabled={project.taskCount > 0}
                          >
                            Delete
                          </AlertDialogAction>
                        </AlertDialogFooter>
                      </AlertDialogContent>
                    </AlertDialog>
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
                  {projects.length > 0 ? Math.round(projects.reduce((sum, p) => sum + p.taskCount, 0) / projects.length) : 0}
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