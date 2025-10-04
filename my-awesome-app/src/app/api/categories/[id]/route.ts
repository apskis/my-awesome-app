import { NextRequest } from 'next/server'
import { PrismaClient } from '@/generated/prisma'
import { UpdateCategorySchema } from '@/lib/validations/category'
import { success, error, validationError, notFound, badRequest } from '@/lib/api-response'

const prisma = new PrismaClient()

// GET /api/categories/[id] - Get a single category by ID
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params

    const category = await prisma.category.findUnique({
      where: { id },
      include: {
        notes: {
          orderBy: { updatedAt: 'desc' }
        },
        _count: {
          select: {
            notes: true
          }
        }
      }
    })

    if (!category) {
      return notFound('Category not found')
    }

    // Transform category to include note count
    const transformedCategory = {
      ...category,
      noteCount: category._count.notes
    }

    return success(transformedCategory)

  } catch (err) {
    console.error('Error fetching category:', err)
    return error('Failed to fetch category')
  }
}

// PUT /api/categories/[id] - Update a category
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const body = await request.json()

    // Validate request body
    const validationResult = UpdateCategorySchema.safeParse(body)
    
    if (!validationResult.success) {
      return validationError(validationResult.error.flatten().fieldErrors)
    }

    // Check if category exists
    const existingCategory = await prisma.category.findUnique({
      where: { id }
    })

    if (!existingCategory) {
      return notFound('Category not found')
    }

    // If updating name, check for duplicates
    if (validationResult.data.name && validationResult.data.name !== existingCategory.name) {
      const duplicateCategory = await prisma.category.findFirst({
        where: {
          name: validationResult.data.name,
          userId: existingCategory.userId,
          id: { not: id }
        }
      })

      if (duplicateCategory) {
        return badRequest('A category with this name already exists')
      }
    }

    // Update category
    const category = await prisma.category.update({
      where: { id },
      data: validationResult.data,
      include: {
        _count: {
          select: {
            notes: true
          }
        }
      }
    })

    // Transform category to include note count
    const transformedCategory = {
      ...category,
      noteCount: category._count.notes
    }

    return success(transformedCategory)

  } catch (err) {
    console.error('Error updating category:', err)
    return error('Failed to update category')
  }
}

// DELETE /api/categories/[id] - Delete a category
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params

    // Check if category exists
    const existingCategory = await prisma.category.findUnique({
      where: { id },
      include: {
        _count: {
          select: {
            notes: true
          }
        }
      }
    })

    if (!existingCategory) {
      return notFound('Category not found')
    }

    // Check if category has notes
    if (existingCategory._count.notes > 0) {
      return badRequest('Cannot delete category that has notes. Please reassign or delete the notes first.')
    }

    // Delete category
    await prisma.category.delete({
      where: { id }
    })

    return success({ message: 'Category deleted successfully' })

  } catch (err) {
    console.error('Error deleting category:', err)
    return error('Failed to delete category')
  }
}
