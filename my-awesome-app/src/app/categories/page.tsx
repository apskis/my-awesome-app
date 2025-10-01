import { Metadata } from 'next'
import { PrismaClient } from '@/generated/prisma'
import { Plus, Tag as TagIcon } from 'lucide-react'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import Link from 'next/link'

export const metadata: Metadata = {
  title: 'Categories - My Awesome Notes',
  description: 'Organize your notes with categories',
}

const prisma = new PrismaClient()

async function getCategories() {
  // TODO: In production, filter by actual user ID from session
  const demoUser = await prisma.user.findUnique({
    where: { email: 'demo@example.com' },
  })

  if (!demoUser) {
    return []
  }

  const categories = await prisma.category.findMany({
    where: { userId: demoUser.id },
    include: {
      _count: {
        select: { notes: true },
      },
    },
    orderBy: { name: 'asc' },
  })

  return categories
}

export default async function CategoriesPage() {
  const categories = await getCategories()

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Categories</h1>
          <p className="text-muted-foreground mt-1">
            Organize your notes into categories
          </p>
        </div>
        <Button className="w-full sm:w-auto">
          <Plus className="w-4 h-4 mr-2" />
          New Category
        </Button>
      </div>

      {/* Categories Grid */}
      {categories.length === 0 ? (
        <Card className="p-12">
          <div className="text-center">
            <div className="w-16 h-16 bg-muted rounded-full flex items-center justify-center mx-auto mb-4">
              <TagIcon className="w-8 h-8 text-muted-foreground" />
            </div>
            <h3 className="text-lg font-semibold text-foreground mb-2">
              No categories yet
            </h3>
            <p className="text-muted-foreground mb-6">
              Create categories to organize your notes better
            </p>
            <Button>
              <Plus className="w-4 h-4 mr-2" />
              Create Category
            </Button>
          </div>
        </Card>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {categories.map((category) => (
            <Link key={category.id} href={`/categories/${category.id}`}>
              <Card
                className="hover:shadow-lg transition-all cursor-pointer group h-full"
                style={{ borderColor: category.color + '40' }}
              >
                <CardContent className="p-6">
                  {/* Color Circle */}
                  <div className="flex items-center gap-4 mb-4">
                    <div
                      className="w-12 h-12 rounded-full flex items-center justify-center group-hover:scale-110 transition-transform"
                      style={{ backgroundColor: category.color + '20' }}
                    >
                      <TagIcon
                        className="w-6 h-6"
                        style={{ color: category.color }}
                      />
                    </div>
                    <div className="flex-1">
                      <h3
                        className="font-semibold text-lg group-hover:scale-105 transition-transform origin-left"
                        style={{ color: category.color }}
                      >
                        {category.name}
                      </h3>
                      <p className="text-sm text-muted-foreground">
                        {category._count.notes} {category._count.notes === 1 ? 'note' : 'notes'}
                      </p>
                    </div>
                  </div>

                  {/* Description */}
                  {category.description && (
                    <p className="text-sm text-muted-foreground line-clamp-2">
                      {category.description}
                    </p>
                  )}

                  {/* Stats Bar */}
                  <div className="mt-4 pt-4 border-t border-border">
                    <div className="flex items-center justify-between text-xs">
                      <span className="text-muted-foreground">Created</span>
                      <span className="text-foreground font-medium">
                        {new Date(category.createdAt).toLocaleDateString()}
                      </span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>
      )}
    </div>
  )
}

