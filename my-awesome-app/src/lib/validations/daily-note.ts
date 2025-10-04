import { z } from 'zod'

// Base daily note schema
export const DailyNoteSchema = z.object({
  id: z.string().cuid(),
  date: z.date(),
  content: z.string().min(1, 'Content is required'),
  mood: z.string().max(50, 'Mood must be less than 50 characters').optional(),
  userId: z.string().cuid(),
  createdAt: z.date(),
  updatedAt: z.date(),
})

// Schema for creating a new daily note (without id, timestamps, userId)
export const CreateDailyNoteSchema = z.object({
  date: z.string().datetime().or(z.date()),
  content: z.string().min(1, 'Content is required'),
  mood: z.string().max(50, 'Mood must be less than 50 characters').optional(),
})

// Schema for updating a daily note (all fields optional)
export const UpdateDailyNoteSchema = z.object({
  date: z.string().datetime().or(z.date()).optional(),
  content: z.string().min(1, 'Content is required').optional(),
  mood: z.string().max(50, 'Mood must be less than 50 characters').optional(),
})

// Type exports
export type DailyNote = z.infer<typeof DailyNoteSchema>
export type CreateDailyNote = z.infer<typeof CreateDailyNoteSchema>
export type UpdateDailyNote = z.infer<typeof UpdateDailyNoteSchema>
