import { NextRequest } from 'next/server'
import { PrismaClient } from '@/generated/prisma'
import { UpdateProjectSchema } from '@/lib/validations/project'
import { success, error, validationError, notFound } from '@/lib/api-response'

const prisma = new PrismaClient()

// GET /api/projects/[id] - Get a single project by ID with all tasks
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params

    const project = await prisma.project.findUnique({
      where: { id },
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
      return notFound('Project not found')
    }

    // Calculate task statistics
    const taskCount = project.tasks.length
    const completedTaskCount = project.tasks.filter(task => task.completed).length

    const transformedProject = {
      ...project,
      taskCount,
      completedTaskCount
    }

    return success(transformedProject)

  } catch (err) {
    console.error('Error fetching project:', err)
    return error('Failed to fetch project')
  }
}

// PUT /api/projects/[id] - Update a project
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const body = await request.json()

    // Validate request body
    const validationResult = UpdateProjectSchema.safeParse(body)
    
    if (!validationResult.success) {
      return validationError(validationResult.error.flatten().fieldErrors)
    }

    // Check if project exists
    const existingProject = await prisma.project.findUnique({
      where: { id }
    })

    if (!existingProject) {
      return notFound('Project not found')
    }

    // Prepare update data (exclude progress as it's calculated automatically)
    const updateData: any = {}
    if (validationResult.data.name !== undefined) updateData.name = validationResult.data.name
    if (validationResult.data.description !== undefined) updateData.description = validationResult.data.description
    if (validationResult.data.status !== undefined) updateData.status = validationResult.data.status

    // Update project
    const project = await prisma.project.update({
      where: { id },
      data: updateData,
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

    // Calculate task statistics
    const taskCount = project.tasks.length
    const completedTaskCount = project.tasks.filter(task => task.completed).length

    const transformedProject = {
      ...project,
      taskCount,
      completedTaskCount
    }

    return success(transformedProject)

  } catch (err) {
    console.error('Error updating project:', err)
    return error('Failed to update project')
  }
}

// DELETE /api/projects/[id] - Delete a project
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params

    // Check if project exists
    const existingProject = await prisma.project.findUnique({
      where: { id },
      include: {
        _count: {
          select: {
            tasks: true
          }
        }
      }
    })

    if (!existingProject) {
      return notFound('Project not found')
    }

    // Check if project has tasks
    if (existingProject._count.tasks > 0) {
      return error('Cannot delete project with existing tasks. Please delete or reassign all tasks first.', 400)
    }

    // Delete project
    await prisma.project.delete({
      where: { id }
    })

    return success({ message: 'Project deleted successfully' })

  } catch (err) {
    console.error('Error deleting project:', err)
    return error('Failed to delete project')
  }
}
