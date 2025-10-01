import { Metadata } from 'next'
import { PrismaClient } from '@/generated/prisma'
import { Plus, Calendar, Flag } from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'

export const metadata: Metadata = {
  title: 'Tasks - My Awesome Notes',
  description: 'Manage your tasks and to-dos',
}

const prisma = new PrismaClient()

async function getTasks() {
  // TODO: In production, filter by actual user ID from session
  const demoUser = await prisma.user.findUnique({
    where: { email: 'demo@example.com' },
  })

  if (!demoUser) {
    return []
  }

  const tasks = await prisma.task.findMany({
    where: { userId: demoUser.id },
    include: {
      project: true,
    },
    orderBy: [
      { completed: 'asc' },
      { dueDate: 'asc' },
    ],
  })

  return tasks
}

function getPriorityColor(priority: string) {
  switch (priority) {
    case 'HIGH':
      return 'bg-destructive text-destructive-foreground'
    case 'MEDIUM':
      return 'bg-warning text-warning-foreground'
    case 'LOW':
      return 'bg-secondary text-secondary-foreground'
    default:
      return 'bg-muted'
  }
}

function isOverdue(dueDate: Date | null) {
  if (!dueDate) return false
  return new Date(dueDate) < new Date()
}

export default async function TasksPage() {
  const tasks = await getTasks()
  const activeTasks = tasks.filter((t) => !t.completed)
  const completedTasks = tasks.filter((t) => t.completed)

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Tasks</h1>
          <p className="text-muted-foreground mt-1">
            Manage your to-dos and stay organized
          </p>
        </div>
        <Button className="w-full sm:w-auto">
          <Plus className="w-4 h-4 mr-2" />
          New Task
        </Button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <Card className="border-l-4 border-l-warning">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Active Tasks
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-foreground">{activeTasks.length}</div>
          </CardContent>
        </Card>

        <Card className="border-l-4 border-l-primary">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Completed
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-foreground">{completedTasks.length}</div>
          </CardContent>
        </Card>

        <Card className="border-l-4 border-l-destructive">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Overdue
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-foreground">
              {activeTasks.filter((t) => isOverdue(t.dueDate)).length}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Tasks Tabs */}
      <Tabs defaultValue="active" className="w-full">
        <TabsList className="w-full sm:w-auto">
          <TabsTrigger value="active" className="flex-1 sm:flex-none">
            Active ({activeTasks.length})
          </TabsTrigger>
          <TabsTrigger value="completed" className="flex-1 sm:flex-none">
            Completed ({completedTasks.length})
          </TabsTrigger>
          <TabsTrigger value="all" className="flex-1 sm:flex-none">
            All ({tasks.length})
          </TabsTrigger>
        </TabsList>

        <TabsContent value="active" className="mt-6">
          {activeTasks.length === 0 ? (
            <Card className="p-12">
              <div className="text-center">
                <div className="w-16 h-16 bg-muted rounded-full flex items-center justify-center mx-auto mb-4">
                  <Plus className="w-8 h-8 text-muted-foreground" />
                </div>
                <h3 className="text-lg font-semibold text-foreground mb-2">
                  No active tasks
                </h3>
                <p className="text-muted-foreground mb-6">
                  You're all caught up! Create a new task to get started.
                </p>
                <Button>
                  <Plus className="w-4 h-4 mr-2" />
                  Create Task
                </Button>
              </div>
            </Card>
          ) : (
            <div className="space-y-3">
              {activeTasks.map((task) => (
                <Card
                  key={task.id}
                  className={`hover:shadow-md transition-all ${
                    isOverdue(task.dueDate) ? 'border-l-4 border-l-destructive' : ''
                  }`}
                >
                  <CardContent className="p-4">
                    <div className="flex items-start gap-4">
                      <input
                        type="checkbox"
                        className="mt-1 w-5 h-5 rounded border-input text-primary focus:ring-primary cursor-pointer"
                        defaultChecked={task.completed}
                      />
                      <div className="flex-1 min-w-0">
                        <h3 className="font-medium text-foreground mb-2">
                          {task.title}
                        </h3>
                        <div className="flex flex-wrap items-center gap-2">
                          <Badge className={getPriorityColor(task.priority)}>
                            <Flag className="w-3 h-3 mr-1" />
                            {task.priority}
                          </Badge>
                          {task.dueDate && (
                            <Badge
                              variant={isOverdue(task.dueDate) ? 'destructive' : 'outline'}
                            >
                              <Calendar className="w-3 h-3 mr-1" />
                              {new Date(task.dueDate).toLocaleDateString()}
                            </Badge>
                          )}
                          {task.project && (
                            <Badge variant="secondary">
                              {task.project.name}
                            </Badge>
                          )}
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </TabsContent>

        <TabsContent value="completed" className="mt-6">
          {completedTasks.length === 0 ? (
            <Card className="p-12">
              <div className="text-center">
                <p className="text-muted-foreground">
                  No completed tasks yet. Keep working!
                </p>
              </div>
            </Card>
          ) : (
            <div className="space-y-3">
              {completedTasks.map((task) => (
                <Card key={task.id} className="opacity-60 hover:opacity-100 transition-opacity">
                  <CardContent className="p-4">
                    <div className="flex items-start gap-4">
                      <input
                        type="checkbox"
                        className="mt-1 w-5 h-5 rounded border-input text-primary focus:ring-primary cursor-pointer"
                        defaultChecked={true}
                      />
                      <div className="flex-1 min-w-0">
                        <h3 className="font-medium text-foreground line-through mb-2">
                          {task.title}
                        </h3>
                        <div className="flex flex-wrap items-center gap-2">
                          <Badge className={getPriorityColor(task.priority)}>
                            {task.priority}
                          </Badge>
                          {task.project && (
                            <Badge variant="secondary">
                              {task.project.name}
                            </Badge>
                          )}
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </TabsContent>

        <TabsContent value="all" className="mt-6">
          <div className="space-y-3">
            {tasks.map((task) => (
              <Card
                key={task.id}
                className={`hover:shadow-md transition-all ${
                  task.completed ? 'opacity-60' : ''
                } ${isOverdue(task.dueDate) && !task.completed ? 'border-l-4 border-l-destructive' : ''}`}
              >
                <CardContent className="p-4">
                  <div className="flex items-start gap-4">
                    <input
                      type="checkbox"
                      className="mt-1 w-5 h-5 rounded border-input text-primary focus:ring-primary cursor-pointer"
                      defaultChecked={task.completed}
                    />
                    <div className="flex-1 min-w-0">
                      <h3 className={`font-medium text-foreground mb-2 ${task.completed ? 'line-through' : ''}`}>
                        {task.title}
                      </h3>
                      <div className="flex flex-wrap items-center gap-2">
                        <Badge className={getPriorityColor(task.priority)}>
                          <Flag className="w-3 h-3 mr-1" />
                          {task.priority}
                        </Badge>
                        {task.dueDate && (
                          <Badge
                            variant={isOverdue(task.dueDate) && !task.completed ? 'destructive' : 'outline'}
                          >
                            <Calendar className="w-3 h-3 mr-1" />
                            {new Date(task.dueDate).toLocaleDateString()}
                          </Badge>
                        )}
                        {task.project && (
                          <Badge variant="secondary">
                            {task.project.name}
                          </Badge>
                        )}
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}

