import { z } from 'zod'

// Hex color validation regex
const hexColorRegex = /^#[0-9A-Fa-f]{6}$/

// Base tag schema
export const TagSchema = z.object({
  id: z.string().cuid(),
  name: z.string().min(1, 'Name is required').max(50, 'Name must be less than 50 characters'),
  color: z.string()
    .min(1, 'Color is required')
    .regex(hexColorRegex, 'Color must be a valid hex color (#RRGGBB format)'),
  createdAt: z.date(),
  updatedAt: z.date(),
})

// Schema for creating a new tag (without id, timestamps)
export const CreateTagSchema = z.object({
  name: z.string().min(1, 'Name is required').max(50, 'Name must be less than 50 characters'),
  color: z.string()
    .min(1, 'Color is required')
    .regex(hexColorRegex, 'Color must be a valid hex color (#RRGGBB format)'),
})

// Schema for updating a tag (all fields optional)
export const UpdateTagSchema = z.object({
  name: z.string().min(1, 'Name is required').max(50, 'Name must be less than 50 characters').optional(),
  color: z.string()
    .regex(hexColorRegex, 'Color must be a valid hex color (#RRGGBB format)')
    .optional(),
})

// Type exports
export type Tag = z.infer<typeof TagSchema>
export type CreateTag = z.infer<typeof CreateTagSchema>
export type UpdateTag = z.infer<typeof UpdateTagSchema>
