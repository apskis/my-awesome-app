import { Metadata } from 'next'
import { PrismaClient, TaskPriority } from '@/generated/prisma'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Checkbox } from '@/components/ui/checkbox'
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert'
import { Plus, Calendar, AlertTriangle, Clock, CheckCircle2 } from 'lucide-react'
import Link from 'next/link'
import { format, isToday, isTomorrow, isPast, addDays } from 'date-fns'

export const metadata: Metadata = {
  title: 'Tasks - My Notes App',
  description: 'Manage your tasks and to-dos',
}

const prisma = new PrismaClient()

interface TasksPageProps {
  searchParams: {
    completion?: string
    priority?: string
    project?: string
    sort?: string
  }
}

async function getTasksData(completion?: string, priority?: string, project?: string, sort?: string) {
  const demoUser = await prisma.user.findUnique({
    where: { email: 'demo@myawesomeapp.com' },
  })

  if (!demoUser) {
    return {
      tasks: [],
      projects: [],
    }
  }

  // Build where clause
  const where: any = {
    userId: demoUser.id,
  }

  if (completion && completion !== 'all') {
    where.completed = completion === 'completed'
  }

  if (priority && priority !== 'all') {
    where.priority = priority as TaskPriority
  }

  if (project && project !== 'all') {
    where.projectId = project
  }

  // Build orderBy clause
  let orderBy: any = {}
  switch (sort) {
    case 'dueDate':
      orderBy = { dueDate: 'asc' }
      break
    case 'priority':
      orderBy = { priority: 'desc' }
      break
    case 'created':
      orderBy = { createdAt: 'desc' }
      break
    default:
      // Default: incomplete first, then by due date, then by priority
      orderBy = [
        { completed: 'asc' },
        { dueDate: 'asc' },
        { priority: 'desc' },
      ]
  }

  const [tasks, projects] = await Promise.all([
    prisma.task.findMany({
      where,
      include: {
        project: true,
      },
      orderBy,
    }),
    prisma.project.findMany({
      where: { userId: demoUser.id },
      select: { id: true, name: true },
      orderBy: { name: 'asc' },
    }),
  ])

  return {
    tasks,
    projects,
  }
}

function getPriorityBadgeColor(priority: TaskPriority) {
  switch (priority) {
    case TaskPriority.LOW:
      return 'bg-accent-cyan text-white'
    case TaskPriority.MEDIUM:
      return 'bg-warning-orange text-white'
    case TaskPriority.HIGH:
      return 'bg-primary-blue text-white'
    default:
      return 'bg-gray-500 text-white'
  }
}

function getDueDateStatus(dueDate: Date | null, completed: boolean) {
  if (!dueDate) return { status: 'none', text: '', color: '' }
  if (completed) return { status: 'completed', text: 'Completed', color: 'text-green-600' }
  
  if (isPast(dueDate)) {
    return { status: 'overdue', text: 'Overdue', color: 'text-red-600' }
  } else if (isToday(dueDate)) {
    return { status: 'today', text: 'Due today', color: 'text-orange-600' }
  } else if (isTomorrow(dueDate)) {
    return { status: 'tomorrow', text: 'Due tomorrow', color: 'text-yellow-600' }
  } else {
    const daysUntil = Math.ceil((dueDate.getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24))
    if (daysUntil <= 3) {
      return { status: 'soon', text: `Due in ${daysUntil} days`, color: 'text-yellow-600' }
    }
    return { status: 'future', text: format(dueDate, 'MMM d'), color: 'text-gray-600' }
  }
}

export default async function TasksPage({ searchParams }: TasksPageProps) {
  const completion = searchParams.completion
  const priority = searchParams.priority
  const project = searchParams.project
  const sort = searchParams.sort

  const { tasks, projects } = await getTasksData(completion, priority, project, sort)

  const hasTasks = tasks.length > 0
  const hasFilters = completion || priority || project || sort

  const completedCount = tasks.filter(t => t.completed).length
  const overdueCount = tasks.filter(t => 
    t.dueDate && isPast(t.dueDate) && !t.completed
  ).length

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
              <Select name="completion" defaultValue={completion || 'all'}>
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
              <Select name="priority" defaultValue={priority || 'all'}>
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
              <Select name="project" defaultValue={project || 'all'}>
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
              <Select name="sort" defaultValue={sort || 'default'}>
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