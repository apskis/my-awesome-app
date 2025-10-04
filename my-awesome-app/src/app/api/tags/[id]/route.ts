import { NextRequest } from 'next/server'
import { PrismaClient } from '@/generated/prisma'
import { UpdateTagSchema } from '@/lib/validations/tag'
import { success, error, validationError, notFound, badRequest } from '@/lib/api-response'

const prisma = new PrismaClient()

// GET /api/tags/[id] - Get a single tag by ID
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params

    const tag = await prisma.tag.findUnique({
      where: { id },
      include: {
        notes: {
          include: {
            note: true
          },
          orderBy: {
            note: {
              updatedAt: 'desc'
            }
          }
        }
      }
    })

    if (!tag) {
      return notFound('Tag not found')
    }

    // Transform tag to include notes and note count
    const transformedTag = {
      id: tag.id,
      name: tag.name,
      color: tag.color,
      createdAt: tag.createdAt,
      updatedAt: tag.updatedAt,
      noteCount: tag.notes.length,
      notes: tag.notes.map(nt => nt.note)
    }

    return success(transformedTag)

  } catch (err) {
    console.error('Error fetching tag:', err)
    return error('Failed to fetch tag')
  }
}

// PUT /api/tags/[id] - Update a tag
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const body = await request.json()

    // Validate request body
    const validationResult = UpdateTagSchema.safeParse(body)
    
    if (!validationResult.success) {
      return validationError(validationResult.error.flatten().fieldErrors)
    }

    // Check if tag exists
    const existingTag = await prisma.tag.findUnique({
      where: { id }
    })

    if (!existingTag) {
      return notFound('Tag not found')
    }

    // Update tag
    const tag = await prisma.tag.update({
      where: { id },
      data: validationResult.data
    })

    return success(tag)

  } catch (err) {
    console.error('Error updating tag:', err)
    
    // Handle unique constraint violation
    if (err instanceof Error && err.message.includes('Unique constraint')) {
      return badRequest('A tag with this name already exists')
    }
    
    return error('Failed to update tag')
  }
}

// DELETE /api/tags/[id] - Delete a tag
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params

    // Check if tag exists
    const existingTag = await prisma.tag.findUnique({
      where: { id }
    })

    if (!existingTag) {
      return notFound('Tag not found')
    }

    // Delete tag (cascade will handle NoteTag relationships)
    await prisma.tag.delete({
      where: { id }
    })

    return success({ message: 'Tag deleted successfully' })

  } catch (err) {
    console.error('Error deleting tag:', err)
    return error('Failed to delete tag')
  }
}
