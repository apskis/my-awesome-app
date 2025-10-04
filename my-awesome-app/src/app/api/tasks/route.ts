import { NextRequest } from 'next/server'
import { PrismaClient } from '@/generated/prisma'
import { CreateTaskSchema } from '@/lib/validations/task'
import { success, error, validationError } from '@/lib/api-response'

const prisma = new PrismaClient()

// GET /api/tasks - Get all tasks with filtering
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    
    // Extract query parameters
    const completed = searchParams.get('completed')
    const priority = searchParams.get('priority')
    const projectId = searchParams.get('projectId')
    const overdue = searchParams.get('overdue')
    const page = parseInt(searchParams.get('page') || '1')
    const limit = 20
    const skip = (page - 1) * limit

    // Build where clause
    const where: any = {}
    
    if (completed !== null) {
      where.completed = completed === 'true'
    }
    
    if (priority) {
      where.priority = priority
    }
    
    if (projectId) {
      where.projectId = projectId
    }
    
    if (overdue === 'true') {
      const today = new Date()
      today.setHours(0, 0, 0, 0)
      where.dueDate = { lt: today }
      where.completed = false
    }

    // Get demo user (in real app, get from session)
    const demoUser = await prisma.user.findUnique({
      where: { email: 'demo@myawesomeapp.com' },
    })

    if (!demoUser) {
      return error('Demo user not found', 404)
    }

    where.userId = demoUser.id

    // Get tasks with relations
    const [tasks, total] = await Promise.all([
      prisma.task.findMany({
        where,
        include: {
          project: true
        },
        orderBy: [
          { completed: 'asc' },
          { dueDate: 'asc' },
          { priority: 'desc' }
        ],
        skip,
        take: limit
      }),
      prisma.task.count({ where })
    ])

    return success({
      tasks,
      total,
      page,
      totalPages: Math.ceil(total / limit)
    })

  } catch (err) {
    console.error('Error fetching tasks:', err)
    return error('Failed to fetch tasks')
  }
}

// POST /api/tasks - Create a new task
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    
    // Validate request body
    const validationResult = CreateTaskSchema.safeParse(body)
    
    if (!validationResult.success) {
      return validationError(validationResult.error.flatten().fieldErrors)
    }

    const { title, description, completed, priority, dueDate, projectId } = validationResult.data

    // Get demo user (in real app, get from session)
    const demoUser = await prisma.user.findUnique({
      where: { email: 'demo@myawesomeapp.com' },
    })

    if (!demoUser) {
      return error('Demo user not found', 404)
    }

    // Create task in database
    const task = await prisma.task.create({
      data: {
        title,
        description,
        completed: completed || false,
        priority: priority || 'LOW',
        dueDate: dueDate ? new Date(dueDate) : null,
        projectId: projectId || null,
        userId: demoUser.id,
      },
      include: {
        project: true
      }
    })

    // If task has projectId, recalculate project progress
    if (projectId) {
      const { calculateProjectProgress } = await import('@/lib/utils/project-progress')
      await calculateProjectProgress(projectId)
    }

    return success(task, 201)

  } catch (err) {
    console.error('Error creating task:', err)
    return error('Failed to create task')
  }
}
