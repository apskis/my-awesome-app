'use client'

import { useState, useEffect } from 'react'
import { useRouter, useParams } from 'next/navigation'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { UpdateTaskSchema, UpdateTask } from '@/lib/validations/task'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Checkbox } from '@/components/ui/checkbox'
import { Label } from '@/components/ui/label'
import { Calendar } from '@/components/ui/calendar'
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'
import { CalendarIcon, ArrowLeft, Loader2 } from 'lucide-react'
import { format } from 'date-fns'
import Link from 'next/link'
import { toast } from 'sonner'
import { cn } from '@/lib/utils'

interface Task {
  id: string
  title: string
  description?: string
  completed: boolean
  priority: 'LOW' | 'MEDIUM' | 'HIGH'
  dueDate?: string
  projectId?: string
  project?: {
    id: string
    name: string
  }
}

interface Project {
  id: string
  name: string
}

export default function EditTaskPage() {
  const router = useRouter()
  const params = useParams()
  const taskId = params.id as string
  
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isLoading, setIsLoading] = useState(true)
  const [task, setTask] = useState<Task | null>(null)
  const [projects, setProjects] = useState<Project[]>([])
  const [selectedDate, setSelectedDate] = useState<Date | undefined>()

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors }
  } = useForm<UpdateTask>({
    resolver: zodResolver(UpdateTaskSchema),
    defaultValues: {
      title: '',
      description: '',
      completed: false,
      priority: 'LOW',
      dueDate: undefined,
      projectId: undefined,
    }
  })

  const watchedCompleted = watch('completed')

  // Load task and projects data
  useEffect(() => {
    const fetchData = async () => {
      try {
        const [taskResponse, projectsResponse] = await Promise.all([
          fetch(`/api/tasks/${taskId}`),
          fetch('/api/projects')
        ])

        if (taskResponse.ok) {
          const taskData = await taskResponse.json()
          const task = taskData
          setTask(task)
          
          // Set form values
          setValue('title', task.title)
          setValue('description', task.description || '')
          setValue('completed', task.completed)
          setValue('priority', task.priority)
          setValue('projectId', task.projectId || '')
          
          // Set date if exists
          if (task.dueDate) {
            setSelectedDate(new Date(task.dueDate))
          }
        } else {
          toast.error('Task not found')
          router.push('/tasks')
          return
        }

        if (projectsResponse.ok) {
          const projectsData = await projectsResponse.json()
          setProjects(projectsData.projects || [])
        }
      } catch (error) {
        console.error('Failed to fetch data:', error)
        toast.error('Failed to load task data')
        router.push('/tasks')
      } finally {
        setIsLoading(false)
      }
    }

    if (taskId) {
      fetchData()
    }
  }, [taskId, setValue, router])

  const onSubmit = async (data: UpdateTask) => {
    setIsSubmitting(true)
    
    try {
      const submitData = {
        ...data,
        dueDate: selectedDate ? selectedDate.toISOString() : undefined,
      }

      const response = await fetch(`/api/tasks/${taskId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(submitData),
      })

      if (response.ok) {
        toast.success('Task updated successfully!')
        router.push('/tasks')
      } else {
        const errorData = await response.json()
        toast.error(errorData.error || 'Failed to update task')
      }
    } catch (error) {
      console.error('Error updating task:', error)
      toast.error('Failed to update task')
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

  if (!task) {
    return (
      <div className="container mx-auto max-w-2xl py-8">
        <div className="text-center py-12">
          <h1 className="text-2xl font-bold text-foreground mb-4">Task not found</h1>
          <Link href="/tasks">
            <Button variant="outline">Back to Tasks</Button>
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="container mx-auto max-w-2xl py-8">
      <div className="mb-6">
        <Link 
          href="/tasks" 
          className="inline-flex items-center text-sm text-muted-foreground hover:text-foreground mb-4"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to Tasks
        </Link>
        <h1 className="text-3xl font-bold text-foreground">Edit Task</h1>
        <p className="text-muted-foreground mt-1">Update your task details</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Task Details</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            {/* Title */}
            <div className="space-y-2">
              <Label htmlFor="title">Title *</Label>
              <Input
                id="title"
                {...register('title')}
                placeholder="Enter task title..."
                className={cn(errors.title && 'border-red-500')}
              />
              {errors.title && (
                <p className="text-sm text-red-500">{errors.title.message}</p>
              )}
            </div>

            {/* Description */}
            <div className="space-y-2">
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                {...register('description')}
                placeholder="Enter task description (optional)..."
                rows={4}
                className={cn(errors.description && 'border-red-500')}
              />
              {errors.description && (
                <p className="text-sm text-red-500">{errors.description.message}</p>
              )}
            </div>

            {/* Completed Checkbox */}
            <div className="flex items-center space-x-2">
              <Checkbox
                id="completed"
                checked={watchedCompleted}
                onCheckedChange={(checked) => setValue('completed', checked as boolean)}
              />
              <Label htmlFor="completed" className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                Mark as completed
              </Label>
            </div>

            {/* Priority */}
            <div className="space-y-2">
              <Label htmlFor="priority">Priority</Label>
              <Select onValueChange={(value) => setValue('priority', value as any)} defaultValue={task.priority}>
                <SelectTrigger>
                  <SelectValue placeholder="Select priority" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="LOW">Low</SelectItem>
                  <SelectItem value="MEDIUM">Medium</SelectItem>
                  <SelectItem value="HIGH">High</SelectItem>
                </SelectContent>
              </Select>
              {errors.priority && (
                <p className="text-sm text-red-500">{errors.priority.message}</p>
              )}
            </div>

            {/* Due Date */}
            <div className="space-y-2">
              <Label>Due Date</Label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    className={cn(
                      'w-full justify-start text-left font-normal',
                      !selectedDate && 'text-muted-foreground'
                    )}
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {selectedDate ? format(selectedDate, 'PPP') : 'Pick a date'}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0">
                  <Calendar
                    mode="single"
                    selected={selectedDate}
                    onSelect={setSelectedDate}
                    initialFocus
                  />
                </PopoverContent>
              </Popover>
            </div>

            {/* Project */}
            <div className="space-y-2">
              <Label htmlFor="project">Project</Label>
              <Select onValueChange={(value) => setValue('projectId', value)} defaultValue={task.projectId || ''}>
                <SelectTrigger>
                  <SelectValue placeholder="Select project (optional)" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="">No Project</SelectItem>
                  {projects.map((project) => (
                    <SelectItem key={project.id} value={project.id}>
                      {project.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {errors.projectId && (
                <p className="text-sm text-red-500">{errors.projectId.message}</p>
              )}
            </div>

            {/* Submit Buttons */}
            <div className="flex gap-3 pt-4">
              <Button
                type="submit"
                disabled={isSubmitting}
                className="bg-primary-blue hover:bg-primary-blue/90"
              >
                {isSubmitting ? 'Updating...' : 'Update Task'}
              </Button>
              <Button
                type="button"
                variant="outline"
                onClick={() => router.push('/tasks')}
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
