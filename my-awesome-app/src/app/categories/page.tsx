import { Metadata } from 'next'
import { PrismaClient } from '@/generated/prisma'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert'
import { Plus, Pencil, Trash2, FileText } from 'lucide-react'
import Link from 'next/link'

export const metadata: Metadata = {
  title: 'Categories - My Notes App',
  description: 'Manage your note categories',
}

const prisma = new PrismaClient()

async function getCategoriesData() {
  const demoUser = await prisma.user.findUnique({
    where: { email: 'demo@myawesomeapp.com' },
  })

  if (!demoUser) {
    return []
  }

  const categories = await prisma.category.findMany({
    where: { userId: demoUser.id },
    include: {
      _count: {
        select: {
          notes: true,
        },
      },
    },
    orderBy: { name: 'asc' },
  })

  return categories
}

function getCategoryColorStyle(color: string) {
  return {
    backgroundColor: color + '20',
    color: color,
    borderColor: color + '40',
  }
}

export default async function CategoriesPage() {
  const categories = await getCategoriesData()

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Categories</h1>
          <p className="text-muted-foreground mt-1">
            {categories.length === 0 
              ? 'No categories yet' 
              : `${categories.length} categor${categories.length === 1 ? 'y' : 'ies'} found`
            }
          </p>
        </div>
        <Link href="/categories/new">
          <Button className="bg-primary-blue hover:bg-primary-blue/90">
            <Plus className="w-4 h-4 mr-2" />
            Add Category
          </Button>
        </Link>
      </div>

      {/* Categories Grid */}
      {categories.length === 0 ? (
        <Alert className="text-center py-8">
          <AlertTitle>No categories yet</AlertTitle>
          <AlertDescription className="mt-2">
            Create your first category to organize your notes better.
          </AlertDescription>
          <Link href="/categories/new">
            <Button className="mt-4 bg-primary-blue hover:bg-primary-blue/90">
              <Plus className="w-4 h-4 mr-2" />
              Add Category
            </Button>
          </Link>
        </Alert>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {categories.map((category) => (
            <Card 
              key={category.id} 
              className="hover:shadow-lg transition-all duration-200 hover:-translate-y-1"
            >
              <CardHeader className="pb-3">
                <div className="flex items-start justify-between gap-2">
                  <div className="flex-1 min-w-0">
                    <CardTitle className="text-lg truncate">{category.name}</CardTitle>
                    {category.description && (
                      <p className="text-sm text-muted-foreground mt-1 line-clamp-2">
                        {category.description}
                      </p>
                    )}
                  </div>
                  <Badge
                    variant="secondary"
                    className="flex-shrink-0"
                    style={getCategoryColorStyle(category.color)}
                  >
                    {category.color}
                  </Badge>
                </div>
              </CardHeader>
              
              <CardContent className="pt-0">
                {/* Note Count */}
                <div className="flex items-center gap-2 mb-4">
                  <FileText className="w-4 h-4 text-muted-foreground" />
                  <span className="text-sm text-muted-foreground">
                    {category._count.notes} note{category._count.notes === 1 ? '' : 's'}
                  </span>
                </div>

                {/* Color Indicator */}
                <div className="mb-4">
                  <div 
                    className="w-full h-2 rounded-full"
                    style={{ backgroundColor: category.color }}
                  />
                </div>

                {/* Action Buttons */}
                <div className="flex items-center gap-2">
                  <Button
                    variant="ghost"
                    size="sm"
                    className="flex-1"
                    aria-label={`Edit category ${category.name}`}
                  >
                    <Pencil className="w-4 h-4 mr-2" />
                    Edit
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="flex-1 text-red-600 hover:text-red-700 hover:bg-red-50"
                    aria-label={`Delete category ${category.name}`}
                  >
                    <Trash2 className="w-4 h-4 mr-2" />
                    Delete
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {/* Summary Stats */}
      {categories.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Summary</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="text-center">
                <div className="text-2xl font-bold text-foreground">
                  {categories.length}
                </div>
                <div className="text-sm text-muted-foreground">Total Categories</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-foreground">
                  {categories.reduce((sum, cat) => sum + cat._count.notes, 0)}
                </div>
                <div className="text-sm text-muted-foreground">Total Notes</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-foreground">
                  {categories.length > 0 
                    ? Math.round(categories.reduce((sum, cat) => sum + cat._count.notes, 0) / categories.length)
                    : 0
                  }
                </div>
                <div className="text-sm text-muted-foreground">Avg Notes/Category</div>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}