import { z } from 'zod'

// Note status enum
export const NoteStatus = z.enum(['DRAFT', 'PUBLISHED', 'ARCHIVED'])

// Base note schema
export const NoteSchema = z.object({
  id: z.string().uuid(),
  title: z.string().min(1, 'Title is required').max(200, 'Title must be less than 200 characters'),
  content: z.string().min(1, 'Content is required'),
  status: NoteStatus.optional().default('DRAFT'),
  categoryId: z.string().uuid().optional(),
  createdAt: z.date(),
  updatedAt: z.date(),
})

// Schema for creating a new note (without id and timestamps)
export const CreateNoteSchema = z.object({
  title: z.string().min(1, 'Title is required').max(200, 'Title must be less than 200 characters'),
  content: z.string().min(1, 'Content is required'),
  status: NoteStatus.optional().default('DRAFT'),
  categoryId: z.string().uuid().optional(),
})

// Schema for updating a note (all fields optional)
export const UpdateNoteSchema = z.object({
  title: z.string().min(1, 'Title is required').max(200, 'Title must be less than 200 characters').optional(),
  content: z.string().min(1, 'Content is required').optional(),
  status: NoteStatus.optional(),
  categoryId: z.string().uuid().optional(),
})

// Type exports
export type Note = z.infer<typeof NoteSchema>
export type CreateNote = z.infer<typeof CreateNoteSchema>
export type UpdateNote = z.infer<typeof UpdateNoteSchema>
export type NoteStatusType = z.infer<typeof NoteStatus>
