import { NextRequest } from 'next/server'
import { PrismaClient } from '@/generated/prisma'
import { CreateTagSchema } from '@/lib/validations/tag'
import { success, error, validationError, badRequest } from '@/lib/api-response'

const prisma = new PrismaClient()

// GET /api/tags - Get all tags with note counts
export async function GET(request: NextRequest) {
  try {
    const tags = await prisma.tag.findMany({
      include: {
        _count: {
          select: {
            notes: true
          }
        }
      },
      orderBy: { name: 'asc' }
    })

    // Transform tags to include note count
    const transformedTags = tags.map(tag => ({
      id: tag.id,
      name: tag.name,
      color: tag.color,
      createdAt: tag.createdAt,
      updatedAt: tag.updatedAt,
      noteCount: tag._count.notes
    }))

    return success({
      tags: transformedTags,
      total: tags.length
    })

  } catch (err) {
    console.error('Error fetching tags:', err)
    return error('Failed to fetch tags')
  }
}

// POST /api/tags - Create a new tag
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    
    // Validate request body
    const validationResult = CreateTagSchema.safeParse(body)
    
    if (!validationResult.success) {
      return validationError(validationResult.error.flatten().fieldErrors)
    }

    const { name, color } = validationResult.data

    // Create tag in database
    const tag = await prisma.tag.create({
      data: {
        name,
        color,
      }
    })

    return success(tag, 201)

  } catch (err) {
    console.error('Error creating tag:', err)
    
    // Handle unique constraint violation
    if (err instanceof Error && err.message.includes('Unique constraint')) {
      return badRequest('A tag with this name already exists')
    }
    
    return error('Failed to create tag')
  }
}
