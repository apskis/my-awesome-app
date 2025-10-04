import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authConfig } from '@/lib/auth-config'
import { prisma } from '@/generated/prisma'
import { archiveNote } from '@/lib/utils/archive'
import { success, error, notFound } from '@/lib/api-response'

interface RouteParams {
  params: {
    id: string
  }
}

export async function POST(request: NextRequest, { params }: RouteParams) {
  try {
    const session = await getServerSession(authConfig)
    if (!session?.user?.id) {
      return NextResponse.json(error('Unauthorized'), { status: 401 })
    }

    // Check if note exists and belongs to user
    const existingNote = await prisma.note.findFirst({
      where: {
        id: params.id,
        userId: session.user.id,
      },
    })

    if (!existingNote) {
      return NextResponse.json(notFound('Note not found'))
    }

    const archivedNote = await archiveNote(params.id)

    return NextResponse.json(success(archivedNote))
  } catch (err) {
    console.error('Error archiving note:', err)
    return NextResponse.json(error('Failed to archive note'), { status: 500 })
  }
}
