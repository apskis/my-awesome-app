import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authConfig } from '@/lib/auth-config'
import { prisma } from '@/generated/prisma'
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

    // Get template by id
    const template = await prisma.template.findUnique({
      where: {
        id: params.id,
      },
    })

    if (!template) {
      return NextResponse.json(notFound('Template not found'))
    }

    // Create new note using template content
    const note = await prisma.note.create({
      data: {
        title: `From Template: ${template.name}`,
        content: template.content,
        status: 'DRAFT',
        userId: session.user.id,
      },
    })

    return NextResponse.json(success(note), { status: 201 })
  } catch (err) {
    console.error('Error using template:', err)
    return NextResponse.json(error('Failed to create note from template'), { status: 500 })
  }
}
