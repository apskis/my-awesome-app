import { PrismaClient } from '@/generated/prisma'

const prisma = new PrismaClient()

/**
 * Calculate and update project progress based on task completion
 * @param projectId - The project ID to calculate progress for
 * @returns The new progress percentage (0-100)
 */
export async function calculateProjectProgress(projectId: string): Promise<number> {
  try {
    // Get all tasks for the project
    const tasks = await prisma.task.findMany({
      where: { projectId },
      select: { completed: true }
    })

    const totalTasks = tasks.length
    const completedTasks = tasks.filter(task => task.completed).length

    // Calculate progress percentage
    let progress = 0
    if (totalTasks > 0) {
      progress = Math.round((completedTasks / totalTasks) * 100)
    }

    // Update project progress in database
    await prisma.project.update({
      where: { id: projectId },
      data: { progress }
    })

    return progress
  } catch (error) {
    console.error('Error calculating project progress:', error)
    throw new Error('Failed to calculate project progress')
  }
}

/**
 * Recalculate progress for multiple projects
 * @param projectIds - Array of project IDs to recalculate
 */
export async function calculateMultipleProjectProgress(projectIds: string[]): Promise<void> {
  try {
    await Promise.all(
      projectIds.map(projectId => calculateProjectProgress(projectId))
    )
  } catch (error) {
    console.error('Error calculating multiple project progress:', error)
    throw new Error('Failed to calculate project progress for multiple projects')
  }
}
