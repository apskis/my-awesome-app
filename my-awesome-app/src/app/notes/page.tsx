'use client'

import { useState, useEffect } from 'react'
import { useSearchParams, useRouter } from 'next/navigation'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert'
import { Search, Plus, ChevronLeft, ChevronRight, Loader2 } from 'lucide-react'
import Link from 'next/link'
import { formatDistanceToNow } from 'date-fns'

interface Note {
  id: string
  title: string
  content: string
  status: string
  categoryId?: string
  category?: {
    id: string
    name: string
    color: string
  }
  tags: Array<{
    id: string
    name: string
    color: string
  }>
  createdAt: string
  updatedAt: string
}

interface Category {
  id: string
  name: string
  color: string
}

interface NotesResponse {
  notes: Note[]
  total: number
  page: number
  totalPages: number
}

interface CategoriesResponse {
  categories: Category[]
}

function getStatusBadgeColor(status: string) {
  switch (status) {
    case 'DRAFT':
      return 'bg-orange-500 text-white hover:bg-orange-500/80'
    case 'PUBLISHED':
      return 'bg-blue-600 text-white hover:bg-blue-600/80'
    case 'ARCHIVED':
      return 'bg-cyan-400 text-white hover:bg-cyan-400/80'
    default:
      return 'bg-gray-500 text-white hover:bg-gray-500/80'
  }
}

function truncateText(text: string, maxLength: number = 100) {
  if (text.length <= maxLength) return text
  return text.substring(0, maxLength) + '...'
}

export default function NotesPage() {
  const searchParams = useSearchParams()
  const router = useRouter()
  
  const [notes, setNotes] = useState<Note[]>([])
  const [categories, setCategories] = useState<Category[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [totalCount, setTotalCount] = useState(0)
  const [totalPages, setTotalPages] = useState(0)
  const [currentPage, setCurrentPage] = useState(1)
  
  const search = searchParams.get('search') || ''
  const status = searchParams.get('status') || ''
  const category = searchParams.get('category') || ''

  // Fetch notes and categories
  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true)
      try {
        // Build query parameters
        const params = new URLSearchParams()
        if (search) params.append('search', search)
        if (status && status !== 'all') params.append('status', status)
        if (category && category !== 'all') params.append('categoryId', category)
        params.append('page', currentPage.toString())

        const [notesResponse, categoriesResponse] = await Promise.all([
          fetch(`/api/notes?${params.toString()}`),
          fetch('/api/categories')
        ])

        if (notesResponse.ok) {
          const notesData: NotesResponse = await notesResponse.json()
          setNotes(notesData.notes)
          setTotalCount(notesData.total)
          setTotalPages(notesData.totalPages)
        }

        if (categoriesResponse.ok) {
          const categoriesData: CategoriesResponse = await categoriesResponse.json()
          setCategories(categoriesData.categories)
        }
      } catch (error) {
        console.error('Error fetching data:', error)
      } finally {
        setIsLoading(false)
      }
    }

    fetchData()
  }, [search, status, category, currentPage])

  const handleSearch = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    const formData = new FormData(e.currentTarget)
    const newSearch = formData.get('search') as string
    const newStatus = formData.get('status') as string
    const newCategory = formData.get('category') as string

    const params = new URLSearchParams()
    if (newSearch) params.append('search', newSearch)
    if (newStatus && newStatus !== 'all') params.append('status', newStatus)
    if (newCategory && newCategory !== 'all') params.append('category', newCategory)

    router.push(`/notes?${params.toString()}`)
  }

  const hasNotes = notes.length > 0
  const hasFilters = search || (status && status !== 'all') || (category && category !== 'all')

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <div className="h-8 w-24 bg-gray-200 rounded animate-pulse" />
            <div className="h-4 w-32 bg-gray-200 rounded animate-pulse mt-2" />
          </div>
          <div className="h-10 w-40 bg-gray-200 rounded animate-pulse" />
        </div>
        <Card>
          <CardHeader>
            <div className="h-6 w-32 bg-gray-200 rounded animate-pulse" />
          </CardHeader>
          <CardContent>
            <div className="flex flex-col sm:flex-row gap-4">
              <div className="flex-1 h-10 bg-gray-200 rounded animate-pulse" />
              <div className="h-10 w-40 bg-gray-200 rounded animate-pulse" />
              <div className="h-10 w-48 bg-gray-200 rounded animate-pulse" />
              <div className="h-10 w-32 bg-gray-200 rounded animate-pulse" />
            </div>
          </CardContent>
        </Card>
        <div className="space-y-4">
          {[...Array(3)].map((_, i) => (
            <Card key={i}>
              <CardContent className="p-6">
                <div className="h-6 w-3/4 bg-gray-200 rounded animate-pulse mb-2" />
                <div className="h-4 w-full bg-gray-200 rounded animate-pulse mb-2" />
                <div className="h-4 w-2/3 bg-gray-200 rounded animate-pulse" />
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-slate-800">Notes</h1>
          <p className="text-muted-foreground mt-1">
            {totalCount === 0 
              ? 'No notes yet' 
              : `${totalCount} note${totalCount === 1 ? '' : 's'} found`
            }
          </p>
        </div>
        <Link href="/notes/new">
          <Button className="bg-blue-600 hover:bg-blue-700">
            <Plus className="w-4 h-4 mr-2" />
            Create New Note
          </Button>
        </Link>
      </div>

      {/* Search and Filters */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Search & Filter</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSearch} className="flex flex-col sm:flex-row gap-4">
            {/* Search Input */}
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <Input
                  placeholder="Search notes..."
                  defaultValue={search}
                  className="pl-10"
                  name="search"
                />
              </div>
            </div>

            {/* Status Filter */}
            <Select name="status" defaultValue={status || 'all'}>
              <SelectTrigger className="w-full sm:w-40">
                <SelectValue placeholder="Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="DRAFT">Draft</SelectItem>
                <SelectItem value="PUBLISHED">Published</SelectItem>
                <SelectItem value="ARCHIVED">Archived</SelectItem>
              </SelectContent>
            </Select>

            {/* Category Filter */}
            <Select name="category" defaultValue={category || 'all'}>
              <SelectTrigger className="w-full sm:w-48">
                <SelectValue placeholder="Category" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Categories</SelectItem>
                {categories.map((cat) => (
                  <SelectItem key={cat.id} value={cat.id}>
                    {cat.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            {/* Apply Filters Button */}
            <Button type="submit" variant="outline" className="w-full sm:w-auto">
              Apply Filters
            </Button>
          </form>
        </CardContent>
      </Card>

      {/* Notes List */}
      {!hasNotes ? (
        <Alert className="text-center py-8">
          <AlertTitle>
            {hasFilters ? 'No notes match your search' : 'No notes found'}
          </AlertTitle>
          <AlertDescription className="mt-2">
            {hasFilters 
              ? 'Try adjusting your search criteria or filters.'
              : 'Create your first note to get started!'
            }
          </AlertDescription>
          <Link href="/notes/new">
            <Button className="mt-4 bg-blue-600 hover:bg-blue-700">
              <Plus className="w-4 h-4 mr-2" />
              Create New Note
            </Button>
          </Link>
        </Alert>
      ) : (
        <>
          {/* Desktop Table View */}
          <Card className="hidden lg:block">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Title</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Category</TableHead>
                  <TableHead>Tags</TableHead>
                  <TableHead>Updated</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {notes.map((note) => (
                  <TableRow key={note.id} className="hover:bg-cyan-400/10 cursor-pointer">
                    <TableCell>
                      <Link href={`/notes/${note.id}`} className="block">
                        <div className="font-medium text-slate-800 hover:text-blue-600">
                          {note.title}
                        </div>
                        <div className="text-sm text-muted-foreground mt-1">
                          {truncateText(note.content, 80)}
                        </div>
                      </Link>
                    </TableCell>
                    <TableCell>
                      <Badge className={getStatusBadgeColor(note.status)}>
                        {note.status}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      {note.category ? (
                        <Badge
                          variant="secondary"
                          style={{ 
                            backgroundColor: note.category.color + '20', 
                            color: note.category.color 
                          }}
                        >
                          {note.category.name}
                        </Badge>
                      ) : (
                        <span className="text-muted-foreground text-sm">No category</span>
                      )}
                    </TableCell>
                    <TableCell>
                      <div className="flex flex-wrap gap-1">
                        {note.tags.slice(0, 2).map((tag) => (
                          <Badge
                            key={tag.id}
                            variant="outline"
                            className="text-xs"
                            style={{ color: tag.color }}
                          >
                            {tag.name}
                          </Badge>
                        ))}
                        {note.tags.length > 2 && (
                          <span className="text-xs text-muted-foreground">
                            +{note.tags.length - 2} more
                          </span>
                        )}
                      </div>
                    </TableCell>
                    <TableCell className="text-sm text-muted-foreground">
                      {formatDistanceToNow(new Date(note.updatedAt), { addSuffix: true })}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </Card>

          {/* Mobile/Tablet Card View */}
          <div className="lg:hidden space-y-4">
            {notes.map((note) => (
              <Card key={note.id} className="hover:shadow-lg transition-shadow cursor-pointer">
                <Link href={`/notes/${note.id}`}>
                  <CardHeader className="pb-3">
                    <div className="flex items-start justify-between gap-2">
                      <CardTitle className="text-lg hover:text-blue-600">
                        {note.title}
                      </CardTitle>
                      <Badge className={getStatusBadgeColor(note.status)}>
                        {note.status}
                      </Badge>
                    </div>
                  </CardHeader>
                  <CardContent className="pt-0">
                    <p className="text-muted-foreground text-sm mb-3">
                      {truncateText(note.content, 120)}
                    </p>
                    
                    <div className="flex flex-wrap items-center gap-2 text-sm">
                      {note.category && (
                        <Badge
                          variant="secondary"
                          style={{ 
                            backgroundColor: note.category.color + '20', 
                            color: note.category.color 
                          }}
                        >
                          {note.category.name}
                        </Badge>
                      )}
                      
                      {note.tags.slice(0, 3).map((tag) => (
                        <Badge
                          key={tag.id}
                          variant="outline"
                          className="text-xs"
                          style={{ color: tag.color }}
                        >
                          {tag.name}
                        </Badge>
                      ))}
                      
                      {note.tags.length > 3 && (
                        <span className="text-xs text-muted-foreground">
                          +{note.tags.length - 3} more
                        </span>
                      )}
                    </div>
                    
                    <div className="mt-3 text-xs text-muted-foreground">
                      Updated {formatDistanceToNow(new Date(note.updatedAt), { addSuffix: true })}
                    </div>
                  </CardContent>
                </Link>
              </Card>
            ))}
          </div>

          {/* Pagination */}
          {totalPages > 1 && (
            <Card>
              <CardContent className="py-4">
                <div className="flex items-center justify-between">
                  <div className="text-sm text-muted-foreground">
                    Showing {((currentPage - 1) * 10) + 1} to {Math.min(currentPage * 10, totalCount)} of {totalCount} notes
                  </div>
                  
                  <div className="flex items-center gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      disabled={currentPage === 1}
                      onClick={() => setCurrentPage(currentPage - 1)}
                      aria-label="Previous page"
                    >
                      <ChevronLeft className="w-4 h-4" />
                    </Button>
                    
                    {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                      const pageNum = i + 1
                      return (
                        <Button
                          key={pageNum}
                          variant={pageNum === currentPage ? "default" : "outline"}
                          size="sm"
                          className={pageNum === currentPage ? "bg-blue-600" : ""}
                          onClick={() => setCurrentPage(pageNum)}
                          aria-label={`Go to page ${pageNum}`}
                          aria-current={pageNum === currentPage ? "page" : undefined}
                        >
                          {pageNum}
                        </Button>
                      )
                    })}
                    
                    <Button
                      variant="outline"
                      size="sm"
                      disabled={currentPage === totalPages}
                      onClick={() => setCurrentPage(currentPage + 1)}
                      aria-label="Next page"
                    >
                      <ChevronRight className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}
        </>
      )}
    </div>
  )
}