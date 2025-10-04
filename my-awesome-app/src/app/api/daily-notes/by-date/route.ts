import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authConfig } from '@/lib/auth-config'
import { prisma } from '@/generated/prisma'
import { success, error, notFound } from '@/lib/api-response'
import { parseISO, startOfDay } from 'date-fns'

export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authConfig)
    if (!session?.user?.id) {
      return NextResponse.json(error('Unauthorized'), { status: 401 })
    }

    const { searchParams } = new URL(request.url)
    const dateParam = searchParams.get('date')

    if (!dateParam) {
      return NextResponse.json(error('Date parameter is required'), { status: 400 })
    }

    // Parse and normalize date to start of day
    const normalizedDate = startOfDay(parseISO(dateParam))

    const dailyNote = await prisma.dailyNote.findFirst({
      where: {
        userId: session.user.id,
        date: normalizedDate,
      },
    })

    if (!dailyNote) {
      return NextResponse.json(notFound('Daily note not found for this date'))
    }

    return NextResponse.json(success(dailyNote))
  } catch (err) {
    console.error('Error fetching daily note by date:', err)
    return NextResponse.json(error('Failed to fetch daily note'), { status: 500 })
  }
}
