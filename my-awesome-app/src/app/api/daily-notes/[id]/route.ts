import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authConfig } from '@/lib/auth-config'
import { prisma } from '@/generated/prisma'
import { UpdateDailyNoteSchema } from '@/lib/validations/daily-note'
import { success, error, validationError, notFound } from '@/lib/api-response'
import { parseISO, startOfDay } from 'date-fns'

interface RouteParams {
  params: {
    id: string
  }
}

export async function GET(request: NextRequest, { params }: RouteParams) {
  try {
    const session = await getServerSession(authConfig)
    if (!session?.user?.id) {
      return NextResponse.json(error('Unauthorized'), { status: 401 })
    }

    const dailyNote = await prisma.dailyNote.findFirst({
      where: {
        id: params.id,
        userId: session.user.id,
      },
    })

    if (!dailyNote) {
      return NextResponse.json(notFound('Daily note not found'))
    }

    return NextResponse.json(success(dailyNote))
  } catch (err) {
    console.error('Error fetching daily note:', err)
    return NextResponse.json(error('Failed to fetch daily note'), { status: 500 })
  }
}

export async function PUT(request: NextRequest, { params }: RouteParams) {
  try {
    const session = await getServerSession(authConfig)
    if (!session?.user?.id) {
      return NextResponse.json(error('Unauthorized'), { status: 401 })
    }

    const body = await request.json()
    const validation = UpdateDailyNoteSchema.safeParse(body)

    if (!validation.success) {
      return NextResponse.json(validationError(validation.error.issues), { status: 400 })
    }

    // Check if daily note exists and belongs to user
    const existingNote = await prisma.dailyNote.findFirst({
      where: {
        id: params.id,
        userId: session.user.id,
      },
    })

    if (!existingNote) {
      return NextResponse.json(notFound('Daily note not found'))
    }

    const { date, content, mood } = validation.data

    // If updating date, check for duplicates
    if (date) {
      const normalizedDate = startOfDay(typeof date === 'string' ? parseISO(date) : date)
      
      const duplicateNote = await prisma.dailyNote.findFirst({
        where: {
          userId: session.user.id,
          date: normalizedDate,
          id: { not: params.id }, // Exclude current note
        },
      })

      if (duplicateNote) {
        return NextResponse.json(error('Entry already exists for this date'), { status: 400 })
      }
    }

    // Build update data
    const updateData: any = {}
    if (content !== undefined) updateData.content = content
    if (mood !== undefined) updateData.mood = mood
    if (date !== undefined) {
      updateData.date = startOfDay(typeof date === 'string' ? parseISO(date) : date)
    }

    const updatedNote = await prisma.dailyNote.update({
      where: { id: params.id },
      data: updateData,
    })

    return NextResponse.json(success(updatedNote))
  } catch (err) {
    console.error('Error updating daily note:', err)
    return NextResponse.json(error('Failed to update daily note'), { status: 500 })
  }
}

export async function DELETE(request: NextRequest, { params }: RouteParams) {
  try {
    const session = await getServerSession(authConfig)
    if (!session?.user?.id) {
      return NextResponse.json(error('Unauthorized'), { status: 401 })
    }

    // Check if daily note exists and belongs to user
    const existingNote = await prisma.dailyNote.findFirst({
      where: {
        id: params.id,
        userId: session.user.id,
      },
    })

    if (!existingNote) {
      return NextResponse.json(notFound('Daily note not found'))
    }

    await prisma.dailyNote.delete({
      where: { id: params.id },
    })

    return NextResponse.json(success('Daily note deleted successfully'))
  } catch (err) {
    console.error('Error deleting daily note:', err)
    return NextResponse.json(error('Failed to delete daily note'), { status: 500 })
  }
}
