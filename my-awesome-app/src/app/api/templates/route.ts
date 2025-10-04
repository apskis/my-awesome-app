import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authConfig } from '@/lib/auth-config'
import { prisma } from '@/generated/prisma'
import { CreateTemplateSchema } from '@/lib/validations/template'
import { success, error, validationError } from '@/lib/api-response'

export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authConfig)
    if (!session?.user?.id) {
      return NextResponse.json(error('Unauthorized'), { status: 401 })
    }

    const { searchParams } = new URL(request.url)
    const category = searchParams.get('category')

    // Build where clause
    const where: any = {}

    if (category) {
      where.category = category
    }

    const templates = await prisma.template.findMany({
      where,
      orderBy: {
        name: 'asc',
      },
    })

    return NextResponse.json(success({
      templates,
      total: templates.length,
    }))
  } catch (err) {
    console.error('Error fetching templates:', err)
    return NextResponse.json(error('Failed to fetch templates'), { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authConfig)
    if (!session?.user?.id) {
      return NextResponse.json(error('Unauthorized'), { status: 401 })
    }

    const body = await request.json()
    const validation = CreateTemplateSchema.safeParse(body)

    if (!validation.success) {
      return NextResponse.json(validationError(validation.error.issues), { status: 400 })
    }

    const { name, description, content, category } = validation.data

    const template = await prisma.template.create({
      data: {
        name,
        description,
        content,
        category,
      },
    })

    return NextResponse.json(success(template), { status: 201 })
  } catch (err) {
    console.error('Error creating template:', err)
    return NextResponse.json(error('Failed to create template'), { status: 500 })
  }
}
