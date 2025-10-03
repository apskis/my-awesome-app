import { NextRequest } from 'next/server'
import { PrismaClient } from '@/generated/prisma'
import { CreateNoteSchema } from '@/lib/validations/note'
import { success, error, validationError, badRequest } from '@/lib/api-response'

const prisma = new PrismaClient()

// GET /api/notes - Get all notes with filtering and pagination
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    
    // Extract query parameters
    const status = searchParams.get('status')
    const categoryId = searchParams.get('categoryId')
    const search = searchParams.get('search')
    const page = parseInt(searchParams.get('page') || '1')
    const limit = 10
    const skip = (page - 1) * limit

    // Build where clause
    const where: any = {}
    
    if (status) {
      where.status = status
    }
    
    if (categoryId) {
      where.categoryId = categoryId
    }
    
    if (search) {
      where.OR = [
        { title: { contains: search, mode: 'insensitive' } },
        { content: { contains: search, mode: 'insensitive' } }
      ]
    }

    // Get notes with relations
    const [notes, total] = await Promise.all([
      prisma.note.findMany({
        where,
        include: {
          category: true,
          tags: {
            include: {
              tag: true
            }
          }
        },
        orderBy: { updatedAt: 'desc' },
        skip,
        take: limit
      }),
      prisma.note.count({ where })
    ])

    // Transform tags for easier frontend consumption
    const transformedNotes = notes.map((note: any) => ({
      ...note,
      tags: note.tags.map((nt: any) => nt.tag)
    }))

    return success({
      notes: transformedNotes,
      total,
      page,
      totalPages: Math.ceil(total / limit)
    })

  } catch (err) {
    console.error('Error fetching notes:', err)
    return error('Failed to fetch notes')
  }
}

// POST /api/notes - Create a new note
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    
    // Validate request body
    const validationResult = CreateNoteSchema.safeParse(body)
    
    if (!validationResult.success) {
      return validationError(validationResult.error.flatten().fieldErrors)
    }

    const { title, content, status, categoryId } = validationResult.data

    // In a real app, userId would come from an authenticated session
    const demoUser = await prisma.user.findUnique({
      where: { email: 'demo@myawesomeapp.com' },
    })

    if (!demoUser) {
      return error('Demo user not found', 404)
    }

    // Create note in database
    const note = await prisma.note.create({
      data: {
        title,
        content,
        status: status || 'DRAFT',
        categoryId: categoryId || null,
        userId: demoUser.id, // Assign to the demo user
      },
      include: {
        category: true,
        tags: {
          include: {
            tag: true
          }
        }
      }
    })

    // Transform tags
    const transformedNote = {
      ...note,
      tags: note.tags.map((nt: any) => nt.tag)
    }

    return success(transformedNote, 201)

  } catch (err) {
    console.error('Error creating note:', err)
    return error('Failed to create note')
  }
}
