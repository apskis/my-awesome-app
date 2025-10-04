'use client'

import { useState, useEffect } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert'
import { Search, ArchiveRestore, ChevronLeft, ChevronRight, Loader2 } from 'lucide-react'
import Link from 'next/link'
import { formatDistanceToNow } from 'date-fns'
import { toast } from 'sonner'

interface Note {
  id: string
  title: string
  content: string
  status: string
  userId: string
  categoryId?: string
  createdAt: string
  updatedAt: string
  category?: {
    id: string
    name: string
    color: string
  }
  tags: Array<{
    tag: {
      id: string
      name: string
      color: string
    }
  }>
}

export default function ArchivePage() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const [notes, setNotes] = useState<Note[]>([])
  const [loading, setLoading] = useState(true)
  const [restoring, setRestoring] = useState<string | null>(null)
  const [search, setSearch] = useState(searchParams.get('search') || '')
  const [dateFilter, setDateFilter] = useState(searchParams.get('dateFilter') || 'all')
  const [page, setPage] = useState(parseInt(searchParams.get('page') || '1'))
  const [totalCount, setTotalCount] = useState(0)
  const [totalPages, setTotalPages] = useState(0)

  // Fetch archived notes
  useEffect(() => {
    fetchArchivedNotes()
  }, [page, dateFilter])

  const fetchArchivedNotes = async () => {
    try {
      setLoading(true)
      const params = new URLSearchParams()
      params.set('status', 'ARCHIVED')
      params.set('page', page.toString())
      
      if (search) {
        params.set('search', search)
      }
      
      if (dateFilter !== 'all') {
        const now = new Date()
        let dateThreshold: Date

        switch (dateFilter) {
          case '7days':
            dateThreshold = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000)
            break
          case '30days':
            dateThreshold = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000)
            break
          case '90days':
            dateThreshold = new Date(now.getTime() - 90 * 24 * 60 * 60 * 1000)
            break
          default:
            dateThreshold = new Date(0)
        }

        params.set('startDate', dateThreshold.toISOString())
      }

      const response = await fetch(`/api/notes?${params}`)
      if (response.ok) {
        const data = await response.json()
        setNotes(data.data.notes)
        setTotalCount(data.data.total)
        setTotalPages(Math.ceil(data.data.total / 10))
      }
    } catch (error) {
      console.error('Error fetching archived notes:', error)
      toast.error('Failed to load archived notes')
    } finally {
      setLoading(false)
    }
  }

  const handleRestore = async (noteId: string, status: 'PUBLISHED' | 'DRAFT') => {
    try {
      setRestoring(noteId)
      const response = await fetch(`/api/notes/${noteId}/unarchive`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ status }),
      })

      if (response.ok) {
        toast.success('Note restored!')
        fetchArchivedNotes() // Refresh the list
      } else {
        const error = await response.json()
        toast.error(error.message || 'Failed to restore note')
      }
    } catch (error) {
      console.error('Error restoring note:', error)
      toast.error('Failed to restore note')
    } finally {
      setRestoring(null)
    }
  }

function truncateText(text: string, maxLength: number = 100) {
  if (text.length <= maxLength) return text
  return text.substring(0, maxLength) + '...'
}

  const hasNotes = notes.length > 0
  const hasFilters = search || (dateFilter && dateFilter !== 'all')

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-96">
        <Loader2 className="w-8 h-8 animate-spin text-primary-blue" />
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Archive</h1>
          <p className="text-muted-foreground mt-1">
            {totalCount === 0 
              ? 'No archived notes' 
              : `${totalCount} archived note${totalCount === 1 ? '' : 's'} found`
            }
          </p>
        </div>
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
                  placeholder="Search archived notes..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>

            {/* Date Filter */}
            <Select value={dateFilter} onValueChange={setDateFilter}>
              <SelectTrigger className="w-full sm:w-48">
                <SelectValue placeholder="Date Range" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Time</SelectItem>
                <SelectItem value="7days">Last 7 Days</SelectItem>
                <SelectItem value="30days">Last 30 Days</SelectItem>
                <SelectItem value="90days">Last 90 Days</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Archived Notes List */}
      {!hasNotes ? (
        <Alert className="text-center py-8">
          <AlertTitle>
            {hasFilters ? 'No archived notes match your search' : 'No archived notes'}
          </AlertTitle>
          <AlertDescription className="mt-2">
            {hasFilters 
              ? 'Try adjusting your search criteria or date filter.'
              : 'Archive some notes to see them here.'
            }
          </AlertDescription>
        </Alert>
      ) : (
        <>
          {/* Desktop Table View */}
          <Card className="hidden lg:block">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Title</TableHead>
                  <TableHead>Category</TableHead>
                  <TableHead>Tags</TableHead>
                  <TableHead>Archived</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {notes.map((note) => (
                  <TableRow key={note.id} className="hover:bg-accent-cyan/10">
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
                    <TableCell>
                      <Dialog>
                        <DialogTrigger asChild>
                          <Button
                            variant="outline"
                            size="sm"
                            className="text-accent-cyan hover:text-accent-cyan/80"
                            disabled={restoring === note.id}
                          >
                            {restoring === note.id ? (
                              <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                            ) : (
                              <ArchiveRestore className="w-4 h-4 mr-2" />
                            )}
                            Restore
                          </Button>
                        </DialogTrigger>
                        <DialogContent>
                          <DialogHeader>
                            <DialogTitle>Restore Note</DialogTitle>
                            <DialogDescription>
                              Choose how you want to restore "{note.title}":
                            </DialogDescription>
                          </DialogHeader>
                          <DialogFooter>
                            <Button
                              variant="outline"
                              onClick={() => handleRestore(note.id, 'DRAFT')}
                              disabled={restoring === note.id}
                            >
                              Restore as Draft
                            </Button>
                            <Button
                              onClick={() => handleRestore(note.id, 'PUBLISHED')}
                              disabled={restoring === note.id}
                            >
                              Restore as Published
                            </Button>
                          </DialogFooter>
                        </DialogContent>
                      </Dialog>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </Card>

          {/* Mobile/Tablet Card View */}
          <div className="lg:hidden space-y-4">
            {notes.map((note) => (
              <Card key={note.id} className="hover:shadow-lg transition-shadow">
                <CardHeader className="pb-3">
                  <div className="flex items-start justify-between gap-2">
                    <Link href={`/notes/${note.id}`} className="flex-1">
                      <CardTitle className="text-lg hover:text-primary-blue">
                        {note.title}
                      </CardTitle>
                    </Link>
                    <Badge className="bg-accent-cyan text-white">
                      Archived
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent className="pt-0">
                  <p className="text-muted-foreground text-sm mb-3">
                    {truncateText(note.content, 120)}
                  </p>
                  
                  <div className="flex flex-wrap items-center gap-2 text-sm mb-3">
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
                  
                  <div className="flex items-center justify-between">
                    <div className="text-xs text-muted-foreground">
                      Archived {formatDistanceToNow(new Date(note.updatedAt), { addSuffix: true })}
                    </div>
                    <Dialog>
                      <DialogTrigger asChild>
                        <Button
                          variant="outline"
                          size="sm"
                          className="text-accent-cyan hover:text-accent-cyan/80"
                          disabled={restoring === note.id}
                        >
                          {restoring === note.id ? (
                            <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                          ) : (
                            <ArchiveRestore className="w-4 h-4 mr-2" />
                          )}
                          Restore
                        </Button>
                      </DialogTrigger>
                      <DialogContent>
                        <DialogHeader>
                          <DialogTitle>Restore Note</DialogTitle>
                          <DialogDescription>
                            Choose how you want to restore "{note.title}":
                          </DialogDescription>
                        </DialogHeader>
                        <DialogFooter>
                          <Button
                            variant="outline"
                            onClick={() => handleRestore(note.id, 'DRAFT')}
                            disabled={restoring === note.id}
                          >
                            Restore as Draft
                          </Button>
                          <Button
                            onClick={() => handleRestore(note.id, 'PUBLISHED')}
                            disabled={restoring === note.id}
                          >
                            Restore as Published
                          </Button>
                        </DialogFooter>
                      </DialogContent>
                    </Dialog>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Pagination */}
          {totalPages > 1 && (
            <Card>
              <CardContent className="py-4">
                <div className="flex items-center justify-between">
                  <div className="text-sm text-muted-foreground">
                    Showing {((page - 1) * 10) + 1} to {Math.min(page * 10, totalCount)} of {totalCount} archived notes
                  </div>
                  
                  <div className="flex items-center gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      disabled={page === 1}
                      onClick={() => setPage(page - 1)}
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
                          onClick={() => setPage(pageNum)}
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
                      onClick={() => setPage(page + 1)}
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