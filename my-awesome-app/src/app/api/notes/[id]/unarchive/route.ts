import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authConfig } from '@/lib/auth-config'
import { prisma } from '@/generated/prisma'
import { unarchiveNote } from '@/lib/utils/archive'
import { success, error, notFound, validationError } from '@/lib/api-response'
import { z } from 'zod'

interface RouteParams {
  params: {
    id: string
  }
}

const UnarchiveSchema = z.object({
  status: z.enum(['PUBLISHED', 'DRAFT']).default('PUBLISHED'),
})

export async function POST(request: NextRequest, { params }: RouteParams) {
  try {
    const session = await getServerSession(authConfig)
    if (!session?.user?.id) {
      return NextResponse.json(error('Unauthorized'), { status: 401 })
    }

    const body = await request.json()
    const validation = UnarchiveSchema.safeParse(body)

    if (!validation.success) {
      return NextResponse.json(validationError(validation.error.issues), { status: 400 })
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

    const restoredNote = await unarchiveNote(params.id, validation.data.status)

    return NextResponse.json(success(restoredNote))
  } catch (err) {
    console.error('Error unarchiving note:', err)
    return NextResponse.json(error('Failed to restore note'), { status: 500 })
  }
}
