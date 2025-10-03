import { Metadata } from 'next'
import { PrismaClient, NoteStatus } from '@/generated/prisma'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert'
import { Search, Plus, ChevronLeft, ChevronRight } from 'lucide-react'
import Link from 'next/link'
import { formatDistanceToNow } from 'date-fns'

export const metadata: Metadata = {
  title: 'Notes - My Notes App',
  description: 'Browse and manage all your notes',
}

const prisma = new PrismaClient()

interface NotesPageProps {
  searchParams: {
    page?: string
    search?: string
    status?: string
    category?: string
  }
}

async function getNotesData(page: number = 1, search?: string, status?: string, category?: string) {
  const demoUser = await prisma.user.findUnique({
    where: { email: 'demo@myawesomeapp.com' },
  })

  if (!demoUser) {
    return {
      notes: [],
      totalCount: 0,
      categories: [],
      totalPages: 0,
    }
  }

  const pageSize = 10
  const skip = (page - 1) * pageSize

  // Build where clause
  const where: any = {
    userId: demoUser.id,
  }

  if (search) {
    where.title = {
      contains: search,
      mode: 'insensitive',
    }
  }

  if (status && status !== 'all') {
    where.status = status as NoteStatus
  }

  if (category && category !== 'all') {
    where.categoryId = category
  }

  const [notes, totalCount, categories] = await Promise.all([
    prisma.note.findMany({
      where,
      include: {
        category: true,
        tags: {
          include: {
            tag: true,
          },
        },
      },
      orderBy: { updatedAt: 'desc' },
      skip,
      take: pageSize,
    }),
    prisma.note.count({ where }),
    prisma.category.findMany({
      where: { userId: demoUser.id },
      orderBy: { name: 'asc' },
    }),
  ])

  const totalPages = Math.ceil(totalCount / pageSize)

  return {
    notes,
    totalCount,
    categories,
    totalPages,
  }
}

function getStatusBadgeColor(status: NoteStatus) {
  switch (status) {
    case NoteStatus.DRAFT:
      return 'bg-warning-orange text-white hover:bg-warning-orange/80'
    case NoteStatus.PUBLISHED:
      return 'bg-primary-blue text-white hover:bg-primary-blue/80'
    case NoteStatus.ARCHIVED:
      return 'bg-accent-cyan text-white hover:bg-accent-cyan/80'
    default:
      return 'bg-gray-500 text-white hover:bg-gray-500/80'
  }
}

function truncateText(text: string, maxLength: number = 100) {
  if (text.length <= maxLength) return text
  return text.substring(0, maxLength) + '...'
}

export default async function NotesPage({ searchParams }: NotesPageProps) {
  const page = parseInt(searchParams.page || '1')
  const search = searchParams.search
  const status = searchParams.status
  const category = searchParams.category

  const { notes, totalCount, categories, totalPages } = await getNotesData(page, search, status, category)

  const hasNotes = notes.length > 0
  const hasFilters = search || (status && status !== 'all') || (category && category !== 'all')

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Notes</h1>
          <p className="text-muted-foreground mt-1">
            {totalCount === 0 
              ? 'No notes yet' 
              : `${totalCount} note${totalCount === 1 ? '' : 's'} found`
            }
          </p>
        </div>
        <Link href="/notes/new">
          <Button className="bg-primary-blue hover:bg-primary-blue/90">
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
          <div className="flex flex-col sm:flex-row gap-4">
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
          </div>
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
            <Button className="mt-4 bg-primary-blue hover:bg-primary-blue/90">
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
                  <TableRow key={note.id} className="hover:bg-accent-cyan/10 cursor-pointer">
                    <TableCell>
                      <Link href={`/notes/${note.id}`} className="block">
                        <div className="font-medium text-foreground hover:text-primary-blue">
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
                        {note.tags.slice(0, 2).map((noteTag) => (
                          <Badge
                            key={noteTag.tag.id}
                            variant="outline"
                            className="text-xs"
                            style={{ color: noteTag.tag.color }}
                          >
                            {noteTag.tag.name}
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
                      <CardTitle className="text-lg hover:text-primary-blue">
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
                      
                      {note.tags.slice(0, 3).map((noteTag) => (
                        <Badge
                          key={noteTag.tag.id}
                          variant="outline"
                          className="text-xs"
                          style={{ color: noteTag.tag.color }}
                        >
                          {noteTag.tag.name}
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
                    Showing {((page - 1) * 10) + 1} to {Math.min(page * 10, totalCount)} of {totalCount} notes
                  </div>
                  
                  <div className="flex items-center gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      disabled={page === 1}
                      aria-label="Previous page"
                    >
                      <ChevronLeft className="w-4 h-4" />
                    </Button>
                    
                    {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                      const pageNum = i + 1
                      return (
                        <Button
                          key={pageNum}
                          variant={pageNum === page ? "default" : "outline"}
                          size="sm"
                          className={pageNum === page ? "bg-primary-blue" : ""}
                          aria-label={`Go to page ${pageNum}`}
                          aria-current={pageNum === page ? "page" : undefined}
                        >
                          {pageNum}
                        </Button>
                      )
                    })}
                    
                    <Button
                      variant="outline"
                      size="sm"
                      disabled={page === totalPages}
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