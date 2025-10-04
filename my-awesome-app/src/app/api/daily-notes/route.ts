import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authConfig } from '@/lib/auth-config'
import { prisma } from '@/generated/prisma'
import { CreateDailyNoteSchema } from '@/lib/validations/daily-note'
import { success, error, validationError } from '@/lib/api-response'
import { parseISO, startOfDay } from 'date-fns'

export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authConfig)
    if (!session?.user?.id) {
      return NextResponse.json(error('Unauthorized'), { status: 401 })
    }

    const { searchParams } = new URL(request.url)
    const startDate = searchParams.get('startDate')
    const endDate = searchParams.get('endDate')
    const mood = searchParams.get('mood')

    // Build where clause
    const where: any = {
      userId: session.user.id,
    }

    if (startDate) {
      where.date = {
        ...where.date,
        gte: startOfDay(parseISO(startDate)),
      }
    }

    if (endDate) {
      where.date = {
        ...where.date,
        lte: startOfDay(parseISO(endDate)),
      }
    }

    if (mood) {
      where.mood = mood
    }

    const dailyNotes = await prisma.dailyNote.findMany({
      where,
      orderBy: {
        date: 'desc',
      },
    })

    return NextResponse.json(success({
      dailyNotes,
      total: dailyNotes.length,
    }))
  } catch (err) {
    console.error('Error fetching daily notes:', err)
    return NextResponse.json(error('Failed to fetch daily notes'), { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authConfig)
    if (!session?.user?.id) {
      return NextResponse.json(error('Unauthorized'), { status: 401 })
    }

    const body = await request.json()
    const validation = CreateDailyNoteSchema.safeParse(body)

    if (!validation.success) {
      return NextResponse.json(validationError(validation.error.issues), { status: 400 })
    }

    const { date, content, mood } = validation.data

    // Normalize date to start of day
    const normalizedDate = startOfDay(typeof date === 'string' ? parseISO(date) : date)

    // Check if daily note already exists for this date
    const existingNote = await prisma.dailyNote.findFirst({
      where: {
        userId: session.user.id,
        date: normalizedDate,
      },
    })

    if (existingNote) {
      return NextResponse.json(error('Entry already exists for this date'), { status: 400 })
    }

    const dailyNote = await prisma.dailyNote.create({
      data: {
        date: normalizedDate,
        content,
        mood,
        userId: session.user.id,
      },
    })

    return NextResponse.json(success(dailyNote), { status: 201 })
  } catch (err) {
    console.error('Error creating daily note:', err)
    return NextResponse.json(error('Failed to create daily note'), { status: 500 })
  }
}
