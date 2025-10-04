'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert'
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '@/components/ui/alert-dialog'
import { Plus, Pencil, Trash2, FileText, Loader2 } from 'lucide-react'
import Link from 'next/link'
import { toast } from 'sonner'

interface Category {
  id: string
  name: string
  description?: string
  color: string
  noteCount: number
}

export default function CategoriesPage() {
  const router = useRouter()
  const [categories, setCategories] = useState<Category[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [isDeleting, setIsDeleting] = useState<string | null>(null)

  // Load categories
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        setIsLoading(true)
        const response = await fetch('/api/categories')
        
        if (response.ok) {
          const data = await response.json()
          setCategories(data.categories || [])
        } else {
          toast.error('Failed to load categories')
        }
      } catch (error) {
        console.error('Failed to fetch categories:', error)
        toast.error('Failed to load categories')
      } finally {
        setIsLoading(false)
      }
    }

    fetchCategories()
  }, [])

  const handleDeleteCategory = async (categoryId: string) => {
    try {
      setIsDeleting(categoryId)
      
      const response = await fetch(`/api/categories/${categoryId}`, {
        method: 'DELETE',
      })

      if (response.ok) {
        // Remove the category from local state
        setCategories(prevCategories => prevCategories.filter(category => category.id !== categoryId))
        toast.success('Category deleted successfully!')
      } else {
        const errorData = await response.json()
        toast.error(errorData.error || 'Failed to delete category')
      }
    } catch (error) {
      console.error('Error deleting category:', error)
      toast.error('Failed to delete category')
    } finally {
      setIsDeleting(null)
    }
  }

  function getCategoryColorStyle(color: string) {
    return {
      backgroundColor: color + '20',
      color: color,
      borderColor: color + '40',
    }
  }

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-center py-12">
          <Loader2 className="w-8 h-8 animate-spin" />
        </div>
      </div>
    )
  }

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
                    {category.noteCount} note{category.noteCount === 1 ? '' : 's'}
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
                  <Link href={`/categories/${category.id}/edit`}>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="flex-1"
                      aria-label={`Edit category ${category.name}`}
                    >
                      <Pencil className="w-4 h-4 mr-2" />
                      Edit
                    </Button>
                  </Link>
                  <AlertDialog>
                    <AlertDialogTrigger asChild>
                      <Button
                        variant="ghost"
                        size="sm"
                        className="flex-1 text-red-600 hover:text-red-700 hover:bg-red-50"
                        aria-label={`Delete category ${category.name}`}
                        disabled={isDeleting === category.id}
                      >
                        {isDeleting === category.id ? (
                          <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                        ) : (
                          <Trash2 className="w-4 h-4 mr-2" />
                        )}
                        Delete
                      </Button>
                    </AlertDialogTrigger>
                    <AlertDialogContent>
                      <AlertDialogHeader>
                        <AlertDialogTitle>Delete Category</AlertDialogTitle>
                        <AlertDialogDescription>
                          Are you sure you want to delete "{category.name}"? This action cannot be undone.
                          {category.noteCount > 0 && (
                            <span className="block mt-2 text-red-600 font-medium">
                              This category has {category.noteCount} note{category.noteCount === 1 ? '' : 's'}. 
                              You must reassign or delete these notes before deleting the category.
                            </span>
                          )}
                        </AlertDialogDescription>
                      </AlertDialogHeader>
                      <AlertDialogFooter>
                        <AlertDialogCancel>Cancel</AlertDialogCancel>
                        <AlertDialogAction
                          onClick={() => handleDeleteCategory(category.id)}
                          className="bg-red-600 hover:bg-red-700"
                          disabled={category.noteCount > 0}
                        >
                          Delete
                        </AlertDialogAction>
                      </AlertDialogFooter>
                    </AlertDialogContent>
                  </AlertDialog>
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
                  {categories.reduce((sum, cat) => sum + cat.noteCount, 0)}
                </div>
                <div className="text-sm text-muted-foreground">Total Notes</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-foreground">
                  {categories.length > 0 
                    ? Math.round(categories.reduce((sum, cat) => sum + cat.noteCount, 0) / categories.length)
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