'use client'

import { useState, useEffect } from 'react'
import { useRouter, useParams } from 'next/navigation'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { UpdateCategorySchema, UpdateCategory } from '@/lib/validations/category'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Label } from '@/components/ui/label'
import { ArrowLeft, Loader2 } from 'lucide-react'
import Link from 'next/link'
import { toast } from 'sonner'
import { cn } from '@/lib/utils'

interface Category {
  id: string
  name: string
  description?: string
  color: string
  noteCount: number
}

const defaultColors = [
  '#3B82F6', // Blue
  '#EF4444', // Red
  '#10B981', // Green
  '#F59E0B', // Yellow
  '#8B5CF6', // Purple
  '#EC4899', // Pink
  '#06B6D4', // Cyan
  '#84CC16', // Lime
  '#F97316', // Orange
  '#6B7280', // Gray
]

export default function EditCategoryPage() {
  const router = useRouter()
  const params = useParams()
  const categoryId = params.id as string
  
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isLoading, setIsLoading] = useState(true)
  const [category, setCategory] = useState<Category | null>(null)

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors }
  } = useForm<UpdateCategory>({
    resolver: zodResolver(UpdateCategorySchema),
    defaultValues: {
      name: '',
      description: '',
      color: '#3B82F6',
    }
  })

  const watchedColor = watch('color')

  // Load category data
  useEffect(() => {
    const fetchCategory = async () => {
      try {
        const response = await fetch(`/api/categories/${categoryId}`)
        
        if (response.ok) {
          const categoryData = await response.json()
          const category = categoryData
          setCategory(category)
          
          // Set form values
          setValue('name', category.name)
          setValue('description', category.description || '')
          setValue('color', category.color)
        } else {
          toast.error('Category not found')
          router.push('/categories')
          return
        }
      } catch (error) {
        console.error('Failed to fetch category:', error)
        toast.error('Failed to load category data')
        router.push('/categories')
      } finally {
        setIsLoading(false)
      }
    }

    if (categoryId) {
      fetchCategory()
    }
  }, [categoryId, setValue, router])

  const onSubmit = async (data: UpdateCategory) => {
    setIsSubmitting(true)
    
    try {
      const response = await fetch(`/api/categories/${categoryId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      })

      if (response.ok) {
        toast.success('Category updated successfully!')
        router.push('/categories')
      } else {
        const errorData = await response.json()
        toast.error(errorData.error || 'Failed to update category')
      }
    } catch (error) {
      console.error('Error updating category:', error)
      toast.error('Failed to update category')
    } finally {
      setIsSubmitting(false)
    }
  }

  if (isLoading) {
    return (
      <div className="container mx-auto max-w-2xl py-8">
        <div className="flex items-center justify-center py-12">
          <Loader2 className="w-8 h-8 animate-spin" />
        </div>
      </div>
    )
  }

  if (!category) {
    return (
      <div className="container mx-auto max-w-2xl py-8">
        <div className="text-center py-12">
          <h1 className="text-2xl font-bold text-foreground mb-4">Category not found</h1>
          <Link href="/categories">
            <Button variant="outline">Back to Categories</Button>
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="container mx-auto max-w-2xl py-8">
      <div className="mb-6">
        <Link 
          href="/categories" 
          className="inline-flex items-center text-sm text-muted-foreground hover:text-foreground mb-4"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to Categories
        </Link>
        <h1 className="text-3xl font-bold text-foreground">Edit Category</h1>
        <p className="text-muted-foreground mt-1">Update your category details</p>
        {category.noteCount > 0 && (
          <p className="text-sm text-orange-600 mt-2">
            This category has {category.noteCount} note{category.noteCount === 1 ? '' : 's'}
          </p>
        )}
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Category Details</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            {/* Name */}
            <div className="space-y-2">
              <Label htmlFor="name">Name *</Label>
              <Input
                id="name"
                {...register('name')}
                placeholder="Enter category name..."
                className={cn(errors.name && 'border-red-500')}
              />
              {errors.name && (
                <p className="text-sm text-red-500">{errors.name.message}</p>
              )}
            </div>

            {/* Description */}
            <div className="space-y-2">
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                {...register('description')}
                placeholder="Enter category description (optional)..."
                rows={4}
                className={cn(errors.description && 'border-red-500')}
              />
              {errors.description && (
                <p className="text-sm text-red-500">{errors.description.message}</p>
              )}
            </div>

            {/* Color */}
            <div className="space-y-2">
              <Label htmlFor="color">Color *</Label>
              
              {/* Color Input */}
              <div className="flex items-center gap-3">
                <input
                  type="color"
                  id="color"
                  value={watchedColor}
                  onChange={(e) => setValue('color', e.target.value)}
                  className="w-12 h-10 border border-input rounded-md cursor-pointer"
                />
                <Input
                  {...register('color')}
                  placeholder="#3B82F6"
                  className={cn('flex-1', errors.color && 'border-red-500')}
                />
              </div>
              
              {/* Color Presets */}
              <div className="space-y-2">
                <p className="text-sm text-muted-foreground">Or choose from presets:</p>
                <div className="flex flex-wrap gap-2">
                  {defaultColors.map((color) => (
                    <button
                      key={color}
                      type="button"
                      onClick={() => setValue('color', color)}
                      className={cn(
                        'w-8 h-8 rounded-full border-2 transition-all hover:scale-110',
                        watchedColor === color ? 'border-foreground' : 'border-gray-300'
                      )}
                      style={{ backgroundColor: color }}
                      aria-label={`Select color ${color}`}
                    />
                  ))}
                </div>
              </div>
              
              {errors.color && (
                <p className="text-sm text-red-500">{errors.color.message}</p>
              )}
            </div>

            {/* Submit Buttons */}
            <div className="flex gap-3 pt-4">
              <Button
                type="submit"
                disabled={isSubmitting}
                className="bg-primary-blue hover:bg-primary-blue/90"
              >
                {isSubmitting ? 'Updating...' : 'Update Category'}
              </Button>
              <Button
                type="button"
                variant="outline"
                onClick={() => router.push('/categories')}
                disabled={isSubmitting}
              >
                Cancel
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}
