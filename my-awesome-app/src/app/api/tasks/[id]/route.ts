import { NextRequest } from 'next/server'
import { PrismaClient } from '@/generated/prisma'
import { UpdateTaskSchema } from '@/lib/validations/task'
import { success, error, validationError, notFound } from '@/lib/api-response'

const prisma = new PrismaClient()

// GET /api/tasks/[id] - Get a single task by ID
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params

    const task = await prisma.task.findUnique({
      where: { id },
      include: {
        project: true
      }
    })

    if (!task) {
      return notFound('Task not found')
    }

    return success(task)

  } catch (err) {
    console.error('Error fetching task:', err)
    return error('Failed to fetch task')
  }
}

// PUT /api/tasks/[id] - Update a task
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const body = await request.json()

    // Validate request body
    const validationResult = UpdateTaskSchema.safeParse(body)
    
    if (!validationResult.success) {
      return validationError(validationResult.error.flatten().fieldErrors)
    }

    // Get existing task to check for project changes
    const existingTask = await prisma.task.findUnique({
      where: { id },
      select: { completed: true, projectId: true }
    })

    if (!existingTask) {
      return notFound('Task not found')
    }

    // Prepare update data
    const updateData: any = {}
    if (validationResult.data.title !== undefined) updateData.title = validationResult.data.title
    if (validationResult.data.description !== undefined) updateData.description = validationResult.data.description
    if (validationResult.data.completed !== undefined) updateData.completed = validationResult.data.completed
    if (validationResult.data.priority !== undefined) updateData.priority = validationResult.data.priority
    if (validationResult.data.dueDate !== undefined) {
      updateData.dueDate = validationResult.data.dueDate ? new Date(validationResult.data.dueDate) : null
    }
    if (validationResult.data.projectId !== undefined) updateData.projectId = validationResult.data.projectId

    // Update task
    const task = await prisma.task.update({
      where: { id },
      data: updateData,
      include: {
        project: true
      }
    })

    // Check if we need to recalculate project progress
    const { calculateProjectProgress } = await import('@/lib/utils/project-progress')
    const projectsToUpdate = new Set<string>()

    // If completion status changed, update both old and new projects
    if (existingTask.completed !== validationResult.data.completed) {
      if (existingTask.projectId) projectsToUpdate.add(existingTask.projectId)
      if (validationResult.data.projectId) projectsToUpdate.add(validationResult.data.projectId)
    }

    // If project changed, update both old and new projects
    if (existingTask.projectId !== validationResult.data.projectId) {
      if (existingTask.projectId) projectsToUpdate.add(existingTask.projectId)
      if (validationResult.data.projectId) projectsToUpdate.add(validationResult.data.projectId)
    }

    // Recalculate progress for affected projects
    if (projectsToUpdate.size > 0) {
      await Promise.all(
        Array.from(projectsToUpdate).map(projectId => calculateProjectProgress(projectId))
      )
    }

    return success(task)

  } catch (err) {
    console.error('Error updating task:', err)
    return error('Failed to update task')
  }
}

// DELETE /api/tasks/[id] - Delete a task
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params

    // Get task to check projectId before deletion
    const existingTask = await prisma.task.findUnique({
      where: { id },
      select: { projectId: true }
    })

    if (!existingTask) {
      return notFound('Task not found')
    }

    // Delete task
    await prisma.task.delete({
      where: { id }
    })

    // If task had projectId, recalculate project progress
    if (existingTask.projectId) {
      const { calculateProjectProgress } = await import('@/lib/utils/project-progress')
      await calculateProjectProgress(existingTask.projectId)
    }

    return success({ message: 'Task deleted successfully' })

  } catch (err) {
    console.error('Error deleting task:', err)
    return error('Failed to delete task')
  }
}
