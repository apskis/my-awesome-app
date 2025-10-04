import { NextRequest } from 'next/server'
import { PrismaClient } from '@/generated/prisma'
import { CreateProjectSchema } from '@/lib/validations/project'
import { success, error, validationError } from '@/lib/api-response'

const prisma = new PrismaClient()

// GET /api/projects - Get all projects with task statistics
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    
    // Extract query parameters
    const status = searchParams.get('status')
    const page = parseInt(searchParams.get('page') || '1')
    const limit = 20
    const skip = (page - 1) * limit

    // Build where clause
    const where: any = {}
    
    if (status) {
      where.status = status
    }

    // Get demo user (in real app, get from session)
    const demoUser = await prisma.user.findUnique({
      where: { email: 'demo@myawesomeapp.com' },
    })

    if (!demoUser) {
      return error('Demo user not found', 404)
    }

    where.userId = demoUser.id

    // Get projects with task counts
    const [projects, total] = await Promise.all([
      prisma.project.findMany({
        where,
        include: {
          _count: {
            select: {
              tasks: true
            }
          },
          tasks: {
            select: {
              completed: true
            }
          }
        },
        orderBy: [
          { status: 'asc' },
          { progress: 'desc' }
        ],
        skip,
        take: limit
      }),
      prisma.project.count({ where })
    ])

    // Transform projects to include task statistics
    const transformedProjects = projects.map(project => ({
      id: project.id,
      name: project.name,
      description: project.description,
      status: project.status,
      progress: project.progress,
      userId: project.userId,
      createdAt: project.createdAt,
      updatedAt: project.updatedAt,
      taskCount: project._count.tasks,
      completedTaskCount: project.tasks.filter(task => task.completed).length
    }))

    return success({
      projects: transformedProjects,
      total,
      page,
      totalPages: Math.ceil(total / limit)
    })

  } catch (err) {
    console.error('Error fetching projects:', err)
    return error('Failed to fetch projects')
  }
}

// POST /api/projects - Create a new project
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    
    // Validate request body
    const validationResult = CreateProjectSchema.safeParse(body)
    
    if (!validationResult.success) {
      return validationError(validationResult.error.flatten().fieldErrors)
    }

    const { name, description, status } = validationResult.data

    // Get demo user (in real app, get from session)
    const demoUser = await prisma.user.findUnique({
      where: { email: 'demo@myawesomeapp.com' },
    })

    if (!demoUser) {
      return error('Demo user not found', 404)
    }

    // Create project in database
    const project = await prisma.project.create({
      data: {
        name,
        description,
        status: status || 'PLANNING',
        progress: 0, // Always start at 0
        userId: demoUser.id,
      }
    })

    return success(project, 201)

  } catch (err) {
    console.error('Error creating project:', err)
    return error('Failed to create project')
  }
}
