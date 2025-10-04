import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authConfig } from '@/lib/auth-config'
import { prisma } from '@/generated/prisma'
import { UpdateArticleSchema } from '@/lib/validations/knowledge-article'
import { success, error, validationError, notFound } from '@/lib/api-response'

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

    const article = await prisma.knowledgeArticle.findFirst({
      where: {
        id: params.id,
        userId: session.user.id,
      },
    })

    if (!article) {
      return NextResponse.json(notFound('Knowledge article not found'))
    }

    return NextResponse.json(success(article))
  } catch (err) {
    console.error('Error fetching knowledge article:', err)
    return NextResponse.json(error('Failed to fetch knowledge article'), { status: 500 })
  }
}

export async function PUT(request: NextRequest, { params }: RouteParams) {
  try {
    const session = await getServerSession(authConfig)
    if (!session?.user?.id) {
      return NextResponse.json(error('Unauthorized'), { status: 401 })
    }

    const body = await request.json()
    const validation = UpdateArticleSchema.safeParse(body)

    if (!validation.success) {
      return NextResponse.json(validationError(validation.error.issues), { status: 400 })
    }

    // Check if article exists and belongs to user
    const existingArticle = await prisma.knowledgeArticle.findFirst({
      where: {
        id: params.id,
        userId: session.user.id,
      },
    })

    if (!existingArticle) {
      return NextResponse.json(notFound('Knowledge article not found'))
    }

    const updatedArticle = await prisma.knowledgeArticle.update({
      where: { id: params.id },
      data: validation.data,
    })

    return NextResponse.json(success(updatedArticle))
  } catch (err) {
    console.error('Error updating knowledge article:', err)
    return NextResponse.json(error('Failed to update knowledge article'), { status: 500 })
  }
}

export async function DELETE(request: NextRequest, { params }: RouteParams) {
  try {
    const session = await getServerSession(authConfig)
    if (!session?.user?.id) {
      return NextResponse.json(error('Unauthorized'), { status: 401 })
    }

    // Check if article exists and belongs to user
    const existingArticle = await prisma.knowledgeArticle.findFirst({
      where: {
        id: params.id,
        userId: session.user.id,
      },
    })

    if (!existingArticle) {
      return NextResponse.json(notFound('Knowledge article not found'))
    }

    await prisma.knowledgeArticle.delete({
      where: { id: params.id },
    })

    return NextResponse.json(success('Knowledge article deleted successfully'))
  } catch (err) {
    console.error('Error deleting knowledge article:', err)
    return NextResponse.json(error('Failed to delete knowledge article'), { status: 500 })
  }
}
