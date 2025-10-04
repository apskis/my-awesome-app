import { z } from 'zod'

// Hex color validation regex
const hexColorRegex = /^#[0-9A-Fa-f]{6}$/

// Base category schema
export const CategorySchema = z.object({
  id: z.string().cuid(),
  name: z.string().min(1, 'Name is required').max(100, 'Name must be less than 100 characters'),
  description: z.string().max(500, 'Description must be less than 500 characters').optional(),
  color: z.string()
    .min(1, 'Color is required')
    .regex(hexColorRegex, 'Color must be a valid hex color (#RRGGBB format)'),
  userId: z.string().cuid(),
  createdAt: z.date(),
  updatedAt: z.date(),
})

// Schema for creating a new category (without id, timestamps, userId)
export const CreateCategorySchema = z.object({
  name: z.string().min(1, 'Name is required').max(100, 'Name must be less than 100 characters'),
  description: z.string().max(500, 'Description must be less than 500 characters').optional(),
  color: z.string()
    .min(1, 'Color is required')
    .regex(hexColorRegex, 'Color must be a valid hex color (#RRGGBB format)'),
})

// Schema for updating a category (all fields optional)
export const UpdateCategorySchema = z.object({
  name: z.string().min(1, 'Name is required').max(100, 'Name must be less than 100 characters').optional(),
  description: z.string().max(500, 'Description must be less than 500 characters').optional(),
  color: z.string()
    .regex(hexColorRegex, 'Color must be a valid hex color (#RRGGBB format)')
    .optional(),
})

// Type exports
export type Category = z.infer<typeof CategorySchema>
export type CreateCategory = z.infer<typeof CreateCategorySchema>
export type UpdateCategory = z.infer<typeof UpdateCategorySchema>
