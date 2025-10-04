import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authConfig } from '@/lib/auth-config'
import { prisma } from '@/generated/prisma'
import { CreateArticleSchema } from '@/lib/validations/knowledge-article'
import { success, error, validationError } from '@/lib/api-response'

export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authConfig)
    if (!session?.user?.id) {
      return NextResponse.json(error('Unauthorized'), { status: 401 })
    }

    const { searchParams } = new URL(request.url)
    const category = searchParams.get('category')
    const tag = searchParams.get('tag')
    const search = searchParams.get('search')

    // Build where clause
    const where: any = {
      userId: session.user.id,
    }

    if (category) {
      where.category = category
    }

    if (tag) {
      where.tags = {
        has: tag,
      }
    }

    if (search) {
      where.OR = [
        {
          title: {
            contains: search,
            mode: 'insensitive',
          },
        },
        {
          content: {
            contains: search,
            mode: 'insensitive',
          },
        },
      ]
    }

    const articles = await prisma.knowledgeArticle.findMany({
      where,
      orderBy: {
        createdAt: 'desc',
      },
    })

    return NextResponse.json(success({
      articles,
      total: articles.length,
    }))
  } catch (err) {
    console.error('Error fetching knowledge articles:', err)
    return NextResponse.json(error('Failed to fetch knowledge articles'), { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authConfig)
    if (!session?.user?.id) {
      return NextResponse.json(error('Unauthorized'), { status: 401 })
    }

    const body = await request.json()
    const validation = CreateArticleSchema.safeParse(body)

    if (!validation.success) {
      return NextResponse.json(validationError(validation.error.issues), { status: 400 })
    }

    const { title, content, category, tags } = validation.data

    const article = await prisma.knowledgeArticle.create({
      data: {
        title,
        content,
        category,
        tags: tags || [],
        userId: session.user.id,
      },
    })

    return NextResponse.json(success(article), { status: 201 })
  } catch (err) {
    console.error('Error creating knowledge article:', err)
    return NextResponse.json(error('Failed to create knowledge article'), { status: 500 })
  }
}
