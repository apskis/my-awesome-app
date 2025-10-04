import { NextRequest } from 'next/server'
import { PrismaClient } from '@/generated/prisma'
import { CreateCategorySchema } from '@/lib/validations/category'
import { success, error, validationError, badRequest } from '@/lib/api-response'

const prisma = new PrismaClient()

// GET /api/categories - Get all categories with note counts
export async function GET(request: NextRequest) {
  try {
    const categories = await prisma.category.findMany({
      include: {
        _count: {
          select: {
            notes: true
          }
        }
      },
      orderBy: { name: 'asc' }
    })

    // Transform categories to include note count
    const transformedCategories = categories.map(category => ({
      id: category.id,
      name: category.name,
      description: category.description,
      color: category.color,
      userId: category.userId,
      createdAt: category.createdAt,
      updatedAt: category.updatedAt,
      noteCount: category._count.notes
    }))

    return success({
      categories: transformedCategories,
      total: categories.length
    })

  } catch (err) {
    console.error('Error fetching categories:', err)
    return error('Failed to fetch categories')
  }
}

// POST /api/categories - Create a new category
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    
    // Validate request body
    const validationResult = CreateCategorySchema.safeParse(body)
    
    if (!validationResult.success) {
      return validationError(validationResult.error.flatten().fieldErrors)
    }

    const { name, description, color } = validationResult.data

    // Get demo user (in real app, get from session)
    const demoUser = await prisma.user.findUnique({
      where: { email: 'demo@myawesomeapp.com' },
    })

    if (!demoUser) {
      return error('Demo user not found', 404)
    }

    // Check if category name already exists for this user
    const existingCategory = await prisma.category.findFirst({
      where: {
        name,
        userId: demoUser.id
      }
    })

    if (existingCategory) {
      return badRequest('A category with this name already exists')
    }

    // Create category in database
    const category = await prisma.category.create({
      data: {
        name,
        description,
        color,
        userId: demoUser.id,
      }
    })

    return success(category, 201)

  } catch (err) {
    console.error('Error creating category:', err)
    return error('Failed to create category')
  }
}