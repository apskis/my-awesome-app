import { NextRequest } from 'next/server'
import { PrismaClient } from '@/generated/prisma'
import { success, error, notFound } from '@/lib/api-response'

const prisma = new PrismaClient()

// DELETE /api/notes/[id]/tags/[tagId] - Remove tag from note
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string; tagId: string }> }
) {
  try {
    const { id, tagId } = await params

    // Find and delete the NoteTag relationship
    const noteTag = await prisma.noteTag.findUnique({
      where: {
        noteId_tagId: {
          noteId: id,
          tagId: tagId
        }
      }
    })

    if (!noteTag) {
      return notFound('Tag is not assigned to this note')
    }

    // Delete the relationship
    await prisma.noteTag.delete({
      where: {
        noteId_tagId: {
          noteId: id,
          tagId: tagId
        }
      }
    })

    return success({ message: 'Tag removed from note successfully' })

  } catch (err) {
    console.error('Error removing tag from note:', err)
    return error('Failed to remove tag from note')
  }
}
