import { z } from 'zod'

// Task priority enum
export const TaskPriority = z.enum(['LOW', 'MEDIUM', 'HIGH'])

// Base task schema
export const TaskSchema = z.object({
  id: z.string().cuid(),
  title: z.string().min(1, 'Title is required').max(200, 'Title must be less than 200 characters'),
  description: z.string().max(1000, 'Description must be less than 1000 characters').optional(),
  completed: z.boolean().default(false),
  priority: TaskPriority.default('LOW'),
  dueDate: z.string().datetime().optional(),
  projectId: z.string().cuid().optional(),
  userId: z.string().cuid(),
  createdAt: z.date(),
  updatedAt: z.date(),
})

// Schema for creating a new task (without id, timestamps, userId)
export const CreateTaskSchema = z.object({
  title: z.string().min(1, 'Title is required').max(200, 'Title must be less than 200 characters'),
  description: z.string().max(1000, 'Description must be less than 1000 characters').optional(),
  completed: z.boolean().default(false),
  priority: TaskPriority.default('LOW'),
  dueDate: z.string().datetime().optional(),
  projectId: z.string().cuid().optional(),
})

// Schema for updating a task (all fields optional)
export const UpdateTaskSchema = z.object({
  title: z.string().min(1, 'Title is required').max(200, 'Title must be less than 200 characters').optional(),
  description: z.string().max(1000, 'Description must be less than 1000 characters').optional(),
  completed: z.boolean().optional(),
  priority: TaskPriority.optional(),
  dueDate: z.string().datetime().optional(),
  projectId: z.string().cuid().optional(),
})

// Type exports
export type Task = z.infer<typeof TaskSchema>
export type CreateTask = z.infer<typeof CreateTaskSchema>
export type UpdateTask = z.infer<typeof UpdateTaskSchema>
export type TaskPriorityType = z.infer<typeof TaskPriority>
