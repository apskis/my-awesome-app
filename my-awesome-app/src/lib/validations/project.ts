import { z } from 'zod'

// Project status enum
export const ProjectStatus = z.enum(['PLANNING', 'IN_PROGRESS', 'ON_HOLD', 'COMPLETED', 'CANCELLED'])

// Base project schema
export const ProjectSchema = z.object({
  id: z.string().cuid(),
  name: z.string().min(1, 'Name is required').max(200, 'Name must be less than 200 characters'),
  description: z.string().max(1000, 'Description must be less than 1000 characters').optional(),
  status: ProjectStatus.default('PLANNING'),
  progress: z.number().min(0, 'Progress must be at least 0').max(100, 'Progress must be at most 100').default(0),
  userId: z.string().cuid(),
  createdAt: z.date(),
  updatedAt: z.date(),
})

// Schema for creating a new project (without id, timestamps, progress, userId)
export const CreateProjectSchema = z.object({
  name: z.string().min(1, 'Name is required').max(200, 'Name must be less than 200 characters'),
  description: z.string().max(1000, 'Description must be less than 1000 characters').optional(),
  status: ProjectStatus.default('PLANNING'),
})

// Schema for updating a project (all fields optional except progress which is calculated)
export const UpdateProjectSchema = z.object({
  name: z.string().min(1, 'Name is required').max(200, 'Name must be less than 200 characters').optional(),
  description: z.string().max(1000, 'Description must be less than 1000 characters').optional(),
  status: ProjectStatus.optional(),
  // Note: progress is calculated automatically, not included in updates
})

// Type exports
export type Project = z.infer<typeof ProjectSchema>
export type CreateProject = z.infer<typeof CreateProjectSchema>
export type UpdateProject = z.infer<typeof UpdateProjectSchema>
export type ProjectStatusType = z.infer<typeof ProjectStatus>
