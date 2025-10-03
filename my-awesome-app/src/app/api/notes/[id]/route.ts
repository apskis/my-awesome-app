import { NextRequest } from 'next/server'
import { PrismaClient } from '@/generated/prisma'
import { UpdateNoteSchema } from '@/lib/validations/note'
import { success, error, validationError, notFound } from '@/lib/api-response'

const prisma = new PrismaClient()

// GET /api/notes/[id] - Get a single note by ID
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params

    const note = await prisma.note.findUnique({
      where: { id },
      include: {
        category: true,
        tags: {
          include: {
            tag: true
          }
        }
      }
    })

    if (!note) {
      return notFound('Note not found')
    }

    // Transform tags
    const transformedNote = {
      ...note,
      tags: note.tags.map((nt: any) => nt.tag)
    }

    return success(transformedNote)

  } catch (err) {
    console.error('Error fetching note:', err)
    return error('Failed to fetch note')
  }
}

// PUT /api/notes/[id] - Update a note
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const body = await request.json()

    // Validate request body
    const validationResult = UpdateNoteSchema.safeParse(body)
    
    if (!validationResult.success) {
      return validationError(validationResult.error.flatten().fieldErrors)
    }

    // Check if note exists
    const existingNote = await prisma.note.findUnique({
      where: { id }
    })

    if (!existingNote) {
      return notFound('Note not found')
    }

    // Update note
    const note = await prisma.note.update({
      where: { id },
      data: validationResult.data,
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

    return success(transformedNote)

  } catch (err) {
    console.error('Error updating note:', err)
    return error('Failed to update note')
  }
}

// DELETE /api/notes/[id] - Delete a note
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params

    // Check if note exists
    const existingNote = await prisma.note.findUnique({
      where: { id }
    })

    if (!existingNote) {
      return notFound('Note not found')
    }

    // Delete note (cascade will delete related NoteTag entries)
    await prisma.note.delete({
      where: { id }
    })

    return success({ message: 'Note deleted successfully' })

  } catch (err) {
    console.error('Error deleting note:', err)
    return error('Failed to delete note')
  }
}
