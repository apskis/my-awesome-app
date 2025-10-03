import { NextRequest } from 'next/server'
import { PrismaClient } from '@/generated/prisma'
import { success, error } from '@/lib/api-response'

const prisma = new PrismaClient()

// GET /api/categories - Get all categories
export async function GET(request: NextRequest) {
  try {
    const categories = await prisma.category.findMany({
      orderBy: { name: 'asc' }
    })

    return success({ categories })

  } catch (err) {
    console.error('Error fetching categories:', err)
    return error('Failed to fetch categories')
  }
}
