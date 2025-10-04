import { NextRequest } from 'next/server'
import { PrismaClient } from '@/generated/prisma'
import { success, error, notFound } from '@/lib/api-response'

const prisma = new PrismaClient()

// POST /api/tasks/[id]/toggle - Toggle task completion status
export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params

    // Get existing task
    const existingTask = await prisma.task.findUnique({
      where: { id },
      select: { completed: true, projectId: true }
    })

    if (!existingTask) {
      return notFound('Task not found')
    }

    // Toggle completion status
    const newCompleted = !existingTask.completed

    // Update task
    const task = await prisma.task.update({
      where: { id },
      data: { completed: newCompleted },
      include: {
        project: true
      }
    })

    // If task has projectId, recalculate project progress
    if (existingTask.projectId) {
      const { calculateProjectProgress } = await import('@/lib/utils/project-progress')
      await calculateProjectProgress(existingTask.projectId)
    }

    return success(task)

  } catch (err) {
    console.error('Error toggling task:', err)
    return error('Failed to toggle task completion')
  }
}
