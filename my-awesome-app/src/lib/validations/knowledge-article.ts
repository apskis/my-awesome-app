import { z } from 'zod'

// Base knowledge article schema
export const KnowledgeArticleSchema = z.object({
  id: z.string().cuid(),
  title: z.string().min(1, 'Title is required').max(200, 'Title must be less than 200 characters'),
  content: z.string().min(1, 'Content is required'),
  category: z.string().max(100, 'Category must be less than 100 characters').optional(),
  tags: z.array(z.string()).optional(),
  userId: z.string().cuid(),
  createdAt: z.date(),
  updatedAt: z.date(),
})

// Schema for creating a new knowledge article (without id, timestamps, userId)
export const CreateArticleSchema = z.object({
  title: z.string().min(1, 'Title is required').max(200, 'Title must be less than 200 characters'),
  content: z.string().min(1, 'Content is required'),
  category: z.string().max(100, 'Category must be less than 100 characters').optional(),
  tags: z.array(z.string()).optional(),
})

// Schema for updating a knowledge article (all fields optional)
export const UpdateArticleSchema = z.object({
  title: z.string().min(1, 'Title is required').max(200, 'Title must be less than 200 characters').optional(),
  content: z.string().min(1, 'Content is required').optional(),
  category: z.string().max(100, 'Category must be less than 100 characters').optional(),
  tags: z.array(z.string()).optional(),
})

// Type exports
export type KnowledgeArticle = z.infer<typeof KnowledgeArticleSchema>
export type CreateArticle = z.infer<typeof CreateArticleSchema>
export type UpdateArticle = z.infer<typeof UpdateArticleSchema>
