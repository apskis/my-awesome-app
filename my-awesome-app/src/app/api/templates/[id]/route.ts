import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authConfig } from '@/lib/auth-config'
import { prisma } from '@/generated/prisma'
import { UpdateTemplateSchema } from '@/lib/validations/template'
import { success, error, validationError, notFound } from '@/lib/api-response'

interface RouteParams {
  params: {
    id: string
  }
}

export async function GET(request: NextRequest, { params }: RouteParams) {
  try {
    const template = await prisma.template.findUnique({
      where: {
        id: params.id,
      },
    })

    if (!template) {
      return NextResponse.json(notFound('Template not found'))
    }

    return NextResponse.json(success(template))
  } catch (err) {
    console.error('Error fetching template:', err)
    return NextResponse.json(error('Failed to fetch template'), { status: 500 })
  }
}

export async function PUT(request: NextRequest, { params }: RouteParams) {
  try {
    const session = await getServerSession(authConfig)
    if (!session?.user?.id) {
      return NextResponse.json(error('Unauthorized'), { status: 401 })
    }

    const body = await request.json()
    const validation = UpdateTemplateSchema.safeParse(body)

    if (!validation.success) {
      return NextResponse.json(validationError(validation.error.issues), { status: 400 })
    }

    // Check if template exists
    const existingTemplate = await prisma.template.findUnique({
      where: {
        id: params.id,
      },
    })

    if (!existingTemplate) {
      return NextResponse.json(notFound('Template not found'))
    }

    const updatedTemplate = await prisma.template.update({
      where: { id: params.id },
      data: validation.data,
    })

    return NextResponse.json(success(updatedTemplate))
  } catch (err) {
    console.error('Error updating template:', err)
    return NextResponse.json(error('Failed to update template'), { status: 500 })
  }
}

export async function DELETE(request: NextRequest, { params }: RouteParams) {
  try {
    const session = await getServerSession(authConfig)
    if (!session?.user?.id) {
      return NextResponse.json(error('Unauthorized'), { status: 401 })
    }

    // Check if template exists
    const existingTemplate = await prisma.template.findUnique({
      where: {
        id: params.id,
      },
    })

    if (!existingTemplate) {
      return NextResponse.json(notFound('Template not found'))
    }

    await prisma.template.delete({
      where: { id: params.id },
    })

    return NextResponse.json(success('Template deleted successfully'))
  } catch (err) {
    console.error('Error deleting template:', err)
    return NextResponse.json(error('Failed to delete template'), { status: 500 })
  }
}
