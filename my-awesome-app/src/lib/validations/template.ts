import { z } from 'zod'

// Base template schema
export const TemplateSchema = z.object({
  id: z.string().cuid(),
  name: z.string().min(1, 'Name is required').max(200, 'Name must be less than 200 characters'),
  description: z.string().max(500, 'Description must be less than 500 characters').optional(),
  content: z.string().min(1, 'Content is required'),
  category: z.string().max(100, 'Category must be less than 100 characters').optional(),
  createdAt: z.date(),
  updatedAt: z.date(),
})

// Schema for creating a new template (without id, timestamps)
export const CreateTemplateSchema = z.object({
  name: z.string().min(1, 'Name is required').max(200, 'Name must be less than 200 characters'),
  description: z.string().max(500, 'Description must be less than 500 characters').optional(),
  content: z.string().min(1, 'Content is required'),
  category: z.string().max(100, 'Category must be less than 100 characters').optional(),
})

// Schema for updating a template (all fields optional)
export const UpdateTemplateSchema = z.object({
  name: z.string().min(1, 'Name is required').max(200, 'Name must be less than 200 characters').optional(),
  description: z.string().max(500, 'Description must be less than 500 characters').optional(),
  content: z.string().min(1, 'Content is required').optional(),
  category: z.string().max(100, 'Category must be less than 100 characters').optional(),
})

// Type exports
export type Template = z.infer<typeof TemplateSchema>
export type CreateTemplate = z.infer<typeof CreateTemplateSchema>
export type UpdateTemplate = z.infer<typeof UpdateTemplateSchema>
