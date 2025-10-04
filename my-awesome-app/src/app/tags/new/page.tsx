'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { CreateTagSchema, CreateTag } from '@/lib/validations/tag'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { ArrowLeft } from 'lucide-react'
import Link from 'next/link'
import { toast } from 'sonner'
import { cn } from '@/lib/utils'

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

export default function CreateTagPage() {
  const router = useRouter()
  const [isSubmitting, setIsSubmitting] = useState(false)

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors }
  } = useForm<CreateTag>({
    resolver: zodResolver(CreateTagSchema),
    defaultValues: {
      name: '',
      color: '#3B82F6',
    }
  })

  const watchedColor = watch('color')

  const onSubmit = async (data: CreateTag) => {
    setIsSubmitting(true)
    
    try {
      const response = await fetch('/api/tags', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      })

      if (response.ok) {
        toast.success('Tag created successfully!')
        router.back() // Go back to previous page since tags are often created inline
      } else {
        const errorData = await response.json()
        toast.error(errorData.error || 'Failed to create tag')
      }
    } catch (error) {
      console.error('Error creating tag:', error)
      toast.error('Failed to create tag')
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="container mx-auto max-w-2xl py-8">
      <div className="mb-6">
        <button 
          onClick={() => router.back()}
          className="inline-flex items-center text-sm text-muted-foreground hover:text-foreground mb-4"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back
        </button>
        <h1 className="text-3xl font-bold text-foreground">Create New Tag</h1>
        <p className="text-muted-foreground mt-1">Add a new tag to organize your notes</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Tag Details</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            {/* Name */}
            <div className="space-y-2">
              <Label htmlFor="name">Name *</Label>
              <Input
                id="name"
                {...register('name')}
                placeholder="Enter tag name..."
                className={cn(errors.name && 'border-red-500')}
              />
              {errors.name && (
                <p className="text-sm text-red-500">{errors.name.message}</p>
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
                {isSubmitting ? 'Creating...' : 'Create Tag'}
              </Button>
              <Button
                type="button"
                variant="outline"
                onClick={() => router.back()}
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
