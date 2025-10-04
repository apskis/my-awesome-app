'use client'

import { useState, useEffect } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Checkbox } from '@/components/ui/checkbox'
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert'
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '@/components/ui/alert-dialog'
import { Plus, Calendar, AlertTriangle, Clock, CheckCircle2, Edit, Trash2, Loader2 } from 'lucide-react'
import Link from 'next/link'
import { format, isToday, isTomorrow, isPast, addDays } from 'date-fns'
import { toast } from 'sonner'

interface Task {
  id: string
  title: string
  description?: string
  completed: boolean
  priority: 'LOW' | 'MEDIUM' | 'HIGH'
  dueDate?: string
  projectId?: string
  project?: {
    id: string
    name: string
  }
  createdAt: string
  updatedAt: string
}

interface Project {
  id: string
  name: string
}

export default function TasksPage() {
  const router = useRouter()
  const searchParams = useSearchParams()
  
  const [tasks, setTasks] = useState<Task[]>([])
  const [projects, setProjects] = useState<Project[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [isToggling, setIsToggling] = useState<string | null>(null)
  const [isDeleting, setIsDeleting] = useState<string | null>(null)
  
  // Filter states
  const [completion, setCompletion] = useState(searchParams.get('completion') || 'all')
  const [priority, setPriority] = useState(searchParams.get('priority') || 'all')
  const [project, setProject] = useState(searchParams.get('project') || 'all')
  const [sort, setSort] = useState(searchParams.get('sort') || 'default')

  // Load tasks and projects
  useEffect(() => {
    const fetchData = async () => {
      try {
        setIsLoading(true)
        
        // Build query params
        const params = new URLSearchParams()
        if (completion !== 'all') {
          if (completion === 'completed') params.set('completed', 'true')
          if (completion === 'incomplete') params.set('completed', 'false')
        }
        if (priority !== 'all') params.set('priority', priority)
        if (project !== 'all') params.set('projectId', project)
        if (sort !== 'default') params.set('sort', sort)

        const [tasksResponse, projectsResponse] = await Promise.all([
          fetch(`/api/tasks?${params.toString()}`),
          fetch('/api/projects')
        ])

        if (tasksResponse.ok) {
          const tasksData = await tasksResponse.json()
          setTasks(tasksData.tasks || [])
        }

        if (projectsResponse.ok) {
          const projectsData = await projectsResponse.json()
          setProjects(projectsData.projects || [])
        }
      } catch (error) {
        console.error('Failed to fetch data:', error)
        toast.error('Failed to load tasks')
      } finally {
        setIsLoading(false)
      }
    }

    fetchData()
  }, [completion, priority, project, sort])

  const handleToggleTask = async (taskId: string, currentCompleted: boolean) => {
    try {
      setIsToggling(taskId)
      
      const response = await fetch(`/api/tasks/${taskId}/toggle`, {
        method: 'POST',
      })

      if (response.ok) {
        const updatedTask = await response.json()
        
        // Update the task in the local state
        setTasks(prevTasks => 
          prevTasks.map(task => 
            task.id === taskId 
              ? { ...task, completed: !currentCompleted }
              : task
          )
        )
        
        toast.success(
          !currentCompleted ? 'Task marked as complete!' : 'Task marked as incomplete!'
        )
      } else {
        toast.error('Failed to update task')
      }
    } catch (error) {
      console.error('Error toggling task:', error)
      toast.error('Failed to update task')
    } finally {
      setIsToggling(null)
    }
  }

  const handleDeleteTask = async (taskId: string) => {
    try {
      setIsDeleting(taskId)
      
      const response = await fetch(`/api/tasks/${taskId}`, {
        method: 'DELETE',
      })

      if (response.ok) {
        // Remove the task from local state
        setTasks(prevTasks => prevTasks.filter(task => task.id !== taskId))
        toast.success('Task deleted successfully!')
      } else {
        toast.error('Failed to delete task')
      }
    } catch (error) {
      console.error('Error deleting task:', error)
      toast.error('Failed to delete task')
    } finally {
      setIsDeleting(null)
    }
  }

  const updateUrl = () => {
    const params = new URLSearchParams()
    if (completion !== 'all') params.set('completion', completion)
    if (priority !== 'all') params.set('priority', priority)
    if (project !== 'all') params.set('project', project)
    if (sort !== 'default') params.set('sort', sort)
    
    const newUrl = params.toString() ? `?${params.toString()}` : ''
    router.push(`/tasks${newUrl}`, { scroll: false })
  }

  // Update URL when filters change
  useEffect(() => {
    updateUrl()
  }, [completion, priority, project, sort])

  const hasTasks = tasks.length > 0
  const hasFilters = completion !== 'all' || priority !== 'all' || project !== 'all' || sort !== 'default'

  const completedCount = tasks.filter(t => t.completed).length
  const overdueCount = tasks.filter(t => 
    t.dueDate && isPast(new Date(t.dueDate)) && !t.completed
  ).length

  function getPriorityBadgeColor(priority: string) {
    switch (priority) {
      case 'LOW':
        return 'bg-accent-cyan text-white'
      case 'MEDIUM':
        return 'bg-warning-orange text-white'
      case 'HIGH':
        return 'bg-primary-blue text-white'
      default:
        return 'bg-gray-500 text-white'
    }
  }

  function getDueDateStatus(dueDate: string | null, completed: boolean) {
    if (!dueDate) return { status: 'none', text: '', color: '' }
    if (completed) return { status: 'completed', text: 'Completed', color: 'text-green-600' }
    
    const due = new Date(dueDate)
    if (isPast(due)) {
      return { status: 'overdue', text: 'Overdue', color: 'text-red-600' }
    } else if (isToday(due)) {
      return { status: 'today', text: 'Due today', color: 'text-orange-600' }
    } else if (isTomorrow(due)) {
      return { status: 'tomorrow', text: 'Due tomorrow', color: 'text-yellow-600' }
    } else {
      const daysUntil = Math.ceil((due.getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24))
      if (daysUntil <= 3) {
        return { status: 'soon', text: `Due in ${daysUntil} days`, color: 'text-yellow-600' }
      }
      return { status: 'future', text: format(due, 'MMM d'), color: 'text-gray-600' }
    }
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
          <h1 className="text-3xl font-bold text-foreground">Tasks</h1>
          <p className="text-muted-foreground mt-1">
            {hasTasks 
              ? `${tasks.length} task${tasks.length === 1 ? '' : 's'} found`
              : 'No tasks yet'
            }
          </p>
        </div>
        <Link href="/tasks/new">
          <Button className="bg-primary-blue hover:bg-primary-blue/90">
            <Plus className="w-4 h-4 mr-2" />
            Create Task
          </Button>
        </Link>
      </div>

      {/* Task Statistics */}
      {hasTasks && (
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-5 h-5 text-green-600" />
                <div>
                  <div className="text-2xl font-bold text-foreground">{completedCount}</div>
                  <div className="text-sm text-muted-foreground">Completed</div>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-2">
                <AlertTriangle className="w-5 h-5 text-red-600" />
                <div>
                  <div className="text-2xl font-bold text-foreground">{overdueCount}</div>
                  <div className="text-sm text-muted-foreground">Overdue</div>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-2">
                <Clock className="w-5 h-5 text-primary-blue" />
                <div>
                  <div className="text-2xl font-bold text-foreground">{tasks.length - completedCount}</div>
                  <div className="text-sm text-muted-foreground">Pending</div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Filters */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Filters & Sort</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {/* Completion Filter */}
            <div>
              <label className="text-sm font-medium text-foreground mb-2 block">Status</label>
              <Select value={completion} onValueChange={setCompletion}>
                <SelectTrigger>
                  <SelectValue placeholder="All Tasks" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Tasks</SelectItem>
                  <SelectItem value="incomplete">Incomplete</SelectItem>
                  <SelectItem value="completed">Completed</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Priority Filter */}
            <div>
              <label className="text-sm font-medium text-foreground mb-2 block">Priority</label>
              <Select value={priority} onValueChange={setPriority}>
                <SelectTrigger>
                  <SelectValue placeholder="All Priorities" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Priorities</SelectItem>
                  <SelectItem value="HIGH">High</SelectItem>
                  <SelectItem value="MEDIUM">Medium</SelectItem>
                  <SelectItem value="LOW">Low</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Project Filter */}
            <div>
              <label className="text-sm font-medium text-foreground mb-2 block">Project</label>
              <Select value={project} onValueChange={setProject}>
                <SelectTrigger>
                  <SelectValue placeholder="All Projects" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Projects</SelectItem>
                  {projects.map((proj) => (
                    <SelectItem key={proj.id} value={proj.id}>
                      {proj.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Sort */}
            <div>
              <label className="text-sm font-medium text-foreground mb-2 block">Sort By</label>
              <Select value={sort} onValueChange={setSort}>
                <SelectTrigger>
                  <SelectValue placeholder="Sort By" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="default">Default (Incomplete First)</SelectItem>
                  <SelectItem value="dueDate">Due Date</SelectItem>
                  <SelectItem value="priority">Priority</SelectItem>
                  <SelectItem value="created">Created Date</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Tasks List */}
      {!hasTasks ? (
        <Alert className="text-center py-8">
          <AlertTitle>
            {hasFilters ? 'No tasks match your filters' : 'No tasks yet'}
          </AlertTitle>
          <AlertDescription className="mt-2">
            {hasFilters 
              ? 'Try adjusting your filters to see more tasks.'
              : 'Add your first task to get started!'
            }
          </AlertDescription>
          <Link href="/tasks/new">
            <Button className="mt-4 bg-primary-blue hover:bg-primary-blue/90">
              <Plus className="w-4 h-4 mr-2" />
              Create Task
            </Button>
          </Link>
        </Alert>
      ) : (
        <div className="space-y-3">
          {tasks.map((task) => {
            const dueDateStatus = getDueDateStatus(task.dueDate, task.completed)
            
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
                    <div className="relative">
                      <Checkbox
                        checked={task.completed}
                        onCheckedChange={() => handleToggleTask(task.id, task.completed)}
                        disabled={isToggling === task.id}
                        className="mt-1"
                        aria-label={`Mark task "${task.title}" as ${task.completed ? 'incomplete' : 'complete'}`}
                      />
                      {isToggling === task.id && (
                        <div className="absolute inset-0 flex items-center justify-center">
                          <Loader2 className="w-3 h-3 animate-spin" />
                        </div>
                      )}
                    </div>
                    
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
                        {task.project && (
                          <div className="flex items-center gap-1 text-muted-foreground">
                            <span>Project:</span>
                            <Badge variant="outline" className="text-xs">
                              {task.project.name}
                            </Badge>
                          </div>
                        )}
                        
                        {task.dueDate && (
                          <div className={`flex items-center gap-1 ${dueDateStatus.color}`}>
                            <Calendar className="w-3 h-3" />
                            <span>{dueDateStatus.text}</span>
                            {dueDateStatus.status === 'overdue' && (
                              <AlertTriangle className="w-3 h-3" />
                            )}
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Action Buttons */}
                    <div className="flex items-center gap-2 flex-shrink-0">
                      <Link href={`/tasks/${task.id}/edit`}>
                        <Button variant="ghost" size="sm">
                          <Edit className="w-4 h-4" />
                        </Button>
                      </Link>
                      <AlertDialog>
                        <AlertDialogTrigger asChild>
                          <Button 
                            variant="ghost" 
                            size="sm" 
                            className="text-red-600 hover:text-red-700"
                            disabled={isDeleting === task.id}
                          >
                            {isDeleting === task.id ? (
                              <Loader2 className="w-4 h-4 animate-spin" />
                            ) : (
                              <Trash2 className="w-4 h-4" />
                            )}
                          </Button>
                        </AlertDialogTrigger>
                        <AlertDialogContent>
                          <AlertDialogHeader>
                            <AlertDialogTitle>Delete Task</AlertDialogTitle>
                            <AlertDialogDescription>
                              Are you sure you want to delete "{task.title}"? This action cannot be undone.
                            </AlertDialogDescription>
                          </AlertDialogHeader>
                          <AlertDialogFooter>
                            <AlertDialogCancel>Cancel</AlertDialogCancel>
                            <AlertDialogAction
                              onClick={() => handleDeleteTask(task.id)}
                              className="bg-red-600 hover:bg-red-700"
                            >
                              Delete
                            </AlertDialogAction>
                          </AlertDialogFooter>
                        </AlertDialogContent>
                      </AlertDialog>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )
          })}
        </div>
      )}
    </div>
  )
}