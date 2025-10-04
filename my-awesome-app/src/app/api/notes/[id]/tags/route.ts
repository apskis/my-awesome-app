import { NextRequest } from 'next/server'
import { PrismaClient } from '@/generated/prisma'
import { success, error, notFound, badRequest } from '@/lib/api-response'

const prisma = new PrismaClient()

// GET /api/notes/[id]/tags - Get all tags for a specific note
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params

    // Check if note exists
    const note = await prisma.note.findUnique({
      where: { id }
    })

    if (!note) {
      return notFound('Note not found')
    }

    // Get all tags for this note
    const noteTags = await prisma.noteTag.findMany({
      where: { noteId: id },
      include: {
        tag: true
      }
    })

    const tags = noteTags.map(nt => nt.tag)

    return success({ tags })

  } catch (err) {
    console.error('Error fetching note tags:', err)
    return error('Failed to fetch note tags')
  }
}

// POST /api/notes/[id]/tags - Add tag to note
export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const body = await request.json()
    const { tagId } = body

    if (!tagId) {
      return badRequest('tagId is required')
    }

    // Check if note exists
    const note = await prisma.note.findUnique({
      where: { id }
    })

    if (!note) {
      return notFound('Note not found')
    }

    // Check if tag exists
    const tag = await prisma.tag.findUnique({
      where: { id: tagId }
    })

    if (!tag) {
      return notFound('Tag not found')
    }

    // Check if relationship already exists
    const existingRelation = await prisma.noteTag.findUnique({
      where: {
        noteId_tagId: {
          noteId: id,
          tagId: tagId
        }
      }
    })

    if (existingRelation) {
      return badRequest('Tag is already assigned to this note')
    }

    // Create NoteTag relationship
    const noteTag = await prisma.noteTag.create({
      data: {
        noteId: id,
        tagId: tagId
      },
      include: {
        tag: true
      }
    })

    return success({ tag: noteTag.tag }, 201)

  } catch (err) {
    console.error('Error adding tag to note:', err)
    return error('Failed to add tag to note')
  }
}
