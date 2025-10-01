import { Metadata } from 'next'
import { PrismaClient } from '@/generated/prisma'
import { FileText, FolderOpen, CheckSquare, TrendingUp } from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import Link from 'next/link'

export const metadata: Metadata = {
  title: 'Dashboard - My Awesome Notes',
  description: 'Overview of your notes, tasks, and projects',
}

const prisma = new PrismaClient()

async function getDashboardData() {
  // TODO: In production, filter by actual user ID from session
  const demoUser = await prisma.user.findUnique({
    where: { email: 'demo@example.com' },
  })

  if (!demoUser) {
    return {
      stats: { notes: 0, projects: 0, tasks: 0, categories: 0 },
      recentNotes: [],
      projects: [],
      upcomingTasks: [],
    }
  }

  const [notes, projects, tasks, categories, recentNotes, upcomingTasks] = await Promise.all([
    prisma.note.count({ where: { userId: demoUser.id } }),
    prisma.project.count({ where: { userId: demoUser.id } }),
    prisma.task.count({ where: { userId: demoUser.id } }),
    prisma.category.count({ where: { userId: demoUser.id } }),
    prisma.note.findMany({
      where: { userId: demoUser.id },
      orderBy: { updatedAt: 'desc' },
      take: 5,
      include: {
        category: true,
      },
    }),
    prisma.task.findMany({
      where: {
        userId: demoUser.id,
        completed: false,
        dueDate: { gte: new Date() },
      },
      orderBy: { dueDate: 'asc' },
      take: 5,
      include: {
        project: true,
      },
    }),
  ])

  const projectsList = await prisma.project.findMany({
    where: { userId: demoUser.id },
    orderBy: { updatedAt: 'desc' },
    take: 4,
  })

  return {
    stats: { notes, projects, tasks, categories },
    recentNotes,
    projects: projectsList,
    upcomingTasks,
  }
}

export default async function DashboardPage() {
  const { stats, recentNotes, projects, upcomingTasks } = await getDashboardData()

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-foreground mb-2">Dashboard</h1>
        <p className="text-muted-foreground">
          Welcome back! Here's what's happening with your productivity hub.
        </p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card className="border-l-4 border-l-primary">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Total Notes
            </CardTitle>
            <FileText className="w-4 h-4 text-primary" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-foreground">{stats.notes}</div>
            <p className="text-xs text-muted-foreground mt-1">
              Across {stats.categories} categories
            </p>
          </CardContent>
        </Card>

        <Card className="border-l-4 border-l-secondary">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Active Projects
            </CardTitle>
            <FolderOpen className="w-4 h-4 text-secondary" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-foreground">{stats.projects}</div>
            <p className="text-xs text-muted-foreground mt-1">
              In progress & planning
            </p>
          </CardContent>
        </Card>

        <Card className="border-l-4 border-l-warning">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Total Tasks
            </CardTitle>
            <CheckSquare className="w-4 h-4 text-warning" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-foreground">{stats.tasks}</div>
            <p className="text-xs text-muted-foreground mt-1">
              {upcomingTasks.length} upcoming
            </p>
          </CardContent>
        </Card>

        <Card className="border-l-4 border-l-chart-4">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Productivity
            </CardTitle>
            <TrendingUp className="w-4 h-4 text-chart-4" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-foreground">85%</div>
            <p className="text-xs text-muted-foreground mt-1">
              +12% from last week
            </p>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Notes */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Recent Notes</CardTitle>
          </CardHeader>
          <CardContent>
            {recentNotes.length === 0 ? (
              <p className="text-sm text-muted-foreground text-center py-8">
                No notes yet. Create your first note to get started!
              </p>
            ) : (
              <div className="space-y-3">
                {recentNotes.map((note) => (
                  <Link
                    key={note.id}
                    href={`/notes/${note.id}`}
                    className="block p-3 rounded-lg hover:bg-accent transition-colors"
                  >
                    <div className="flex items-start justify-between gap-2">
                      <div className="flex-1 min-w-0">
                        <h4 className="font-medium text-sm text-foreground truncate">
                          {note.title}
                        </h4>
                        <p className="text-xs text-muted-foreground mt-1">
                          {new Date(note.updatedAt).toLocaleDateString()}
                        </p>
                      </div>
                      <div className="flex items-center gap-2 flex-shrink-0">
                        {note.category && (
                          <Badge
                            variant="secondary"
                            className="text-xs"
                            style={{ backgroundColor: note.category.color + '20', color: note.category.color }}
                          >
                            {note.category.name}
                          </Badge>
                        )}
                        <Badge
                          variant={
                            note.status === 'PUBLISHED'
                              ? 'default'
                              : note.status === 'DRAFT'
                              ? 'outline'
                              : 'secondary'
                          }
                          className="text-xs"
                        >
                          {note.status}
                        </Badge>
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            )}
            <Link
              href="/notes"
              className="block text-center text-sm text-primary hover:text-primary/80 mt-4 font-medium"
            >
              View all notes →
            </Link>
          </CardContent>
        </Card>

        {/* Upcoming Tasks */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Upcoming Tasks</CardTitle>
          </CardHeader>
          <CardContent>
            {upcomingTasks.length === 0 ? (
              <p className="text-sm text-muted-foreground text-center py-8">
                No upcoming tasks. You're all caught up! 🎉
              </p>
            ) : (
              <div className="space-y-3">
                {upcomingTasks.map((task) => (
                  <div
                    key={task.id}
                    className="flex items-start gap-3 p-3 rounded-lg hover:bg-accent transition-colors"
                  >
                    <input
                      type="checkbox"
                      className="mt-1 rounded border-input"
                      defaultChecked={task.completed}
                    />
                    <div className="flex-1 min-w-0">
                      <h4 className="font-medium text-sm text-foreground">
                        {task.title}
                      </h4>
                      <div className="flex items-center gap-2 mt-1">
                        {task.dueDate && (
                          <span className="text-xs text-muted-foreground">
                            Due: {new Date(task.dueDate).toLocaleDateString()}
                          </span>
                        )}
                        {task.project && (
                          <Badge variant="outline" className="text-xs">
                            {task.project.name}
                          </Badge>
                        )}
                      </div>
                    </div>
                    <Badge
                      variant={
                        task.priority === 'HIGH'
                          ? 'destructive'
                          : task.priority === 'MEDIUM'
                          ? 'default'
                          : 'secondary'
                      }
                      className="text-xs"
                    >
                      {task.priority}
                    </Badge>
                  </div>
                ))}
              </div>
            )}
            <Link
              href="/tasks"
              className="block text-center text-sm text-primary hover:text-primary/80 mt-4 font-medium"
            >
              View all tasks →
            </Link>
          </CardContent>
        </Card>
      </div>

      {/* Projects Overview */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Active Projects</CardTitle>
        </CardHeader>
        <CardContent>
          {projects.length === 0 ? (
            <p className="text-sm text-muted-foreground text-center py-8">
              No projects yet. Start organizing your work into projects!
            </p>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {projects.map((project) => (
                <Link
                  key={project.id}
                  href={`/projects/${project.id}`}
                  className="block p-4 border border-border rounded-lg hover:border-primary hover:bg-accent/50 transition-colors"
                >
                  <div className="flex items-start justify-between mb-3">
                    <h4 className="font-semibold text-foreground">{project.name}</h4>
                    <Badge
                      variant={
                        project.status === 'COMPLETED'
                          ? 'default'
                          : project.status === 'IN_PROGRESS'
                          ? 'secondary'
                          : 'outline'
                      }
                    >
                      {project.status.replace('_', ' ')}
                    </Badge>
                  </div>
                  {project.description && (
                    <p className="text-sm text-muted-foreground line-clamp-2 mb-3">
                      {project.description}
                    </p>
                  )}
                  <div className="space-y-2">
                    <div className="flex items-center justify-between text-xs text-muted-foreground">
                      <span>Progress</span>
                      <span className="font-medium">{project.progress}%</span>
                    </div>
                    <div className="w-full bg-muted rounded-full h-2">
                      <div
                        className="bg-primary h-2 rounded-full transition-all"
                        style={{ width: `${project.progress}%` }}
                      />
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          )}
          <Link
            href="/projects"
            className="block text-center text-sm text-primary hover:text-primary/80 mt-4 font-medium"
          >
            View all projects →
          </Link>
        </CardContent>
      </Card>
    </div>
  )
}

