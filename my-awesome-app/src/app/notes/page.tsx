import { Metadata } from 'next'
import { PrismaClient } from '@/generated/prisma'
import { Plus, Search, Filter } from 'lucide-react'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import Link from 'next/link'

export const metadata: Metadata = {
  title: 'Notes - My Awesome Notes',
  description: 'View and manage all your notes',
}

const prisma = new PrismaClient()

async function getNotes() {
  // TODO: In production, filter by actual user ID from session
  const demoUser = await prisma.user.findUnique({
    where: { email: 'demo@example.com' },
  })

  if (!demoUser) {
    return []
  }

  const notes = await prisma.note.findMany({
    where: { userId: demoUser.id },
    include: {
      category: true,
      tags: {
        include: {
          tag: true,
        },
      },
    },
    orderBy: { updatedAt: 'desc' },
  })

  return notes
}

function getStatusColor(status: string) {
  switch (status) {
    case 'PUBLISHED':
      return 'bg-primary text-primary-foreground'
    case 'DRAFT':
      return 'bg-warning/20 text-warning border-warning'
    case 'ARCHIVED':
      return 'bg-secondary/20 text-secondary border-secondary'
    default:
      return ''
  }
}

export default async function NotesPage() {
  const notes = await getNotes()

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Notes</h1>
          <p className="text-muted-foreground mt-1">
            Manage your notes, ideas, and documentation
          </p>
        </div>
        <Button className="w-full sm:w-auto">
          <Plus className="w-4 h-4 mr-2" />
          New Note
        </Button>
      </div>

      {/* Search and Filter Bar */}
      <Card>
        <CardContent className="pt-6">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <input
                type="search"
                placeholder="Search notes..."
                className="w-full pl-10 pr-4 py-2 bg-background border border-input rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-ring"
              />
            </div>
            <Button variant="outline" className="w-full sm:w-auto">
              <Filter className="w-4 h-4 mr-2" />
              Filter
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Notes Grid */}
      {notes.length === 0 ? (
        <Card className="p-12">
          <div className="text-center">
            <div className="w-16 h-16 bg-muted rounded-full flex items-center justify-center mx-auto mb-4">
              <Plus className="w-8 h-8 text-muted-foreground" />
            </div>
            <h3 className="text-lg font-semibold text-foreground mb-2">
              No notes yet
            </h3>
            <p className="text-muted-foreground mb-6">
              Get started by creating your first note
            </p>
            <Button>
              <Plus className="w-4 h-4 mr-2" />
              Create Note
            </Button>
          </div>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {notes.map((note) => (
            <Link key={note.id} href={`/notes/${note.id}`}>
              <Card className="h-full hover:shadow-lg hover:border-primary transition-all cursor-pointer group">
                <CardContent className="p-6">
                  {/* Header */}
                  <div className="flex items-start justify-between gap-2 mb-3">
                    <h3 className="font-semibold text-foreground line-clamp-2 group-hover:text-primary transition-colors">
                      {note.title}
                    </h3>
                    <Badge className={getStatusColor(note.status)}>
                      {note.status}
                    </Badge>
                  </div>

                  {/* Content Preview */}
                  <p className="text-sm text-muted-foreground line-clamp-3 mb-4">
                    {note.content.substring(0, 150)}...
                  </p>

                  {/* Footer */}
                  <div className="space-y-3">
                    {/* Category */}
                    {note.category && (
                      <Badge
                        variant="secondary"
                        style={{
                          backgroundColor: note.category.color + '20',
                          color: note.category.color,
                          borderColor: note.category.color + '40',
                        }}
                      >
                        {note.category.name}
                      </Badge>
                    )}

                    {/* Tags */}
                    {note.tags.length > 0 && (
                      <div className="flex flex-wrap gap-2">
                        {note.tags.slice(0, 3).map((noteTag) => (
                          <Badge
                            key={noteTag.tag.id}
                            variant="outline"
                            className="text-xs"
                            style={{
                              borderColor: noteTag.tag.color,
                              color: noteTag.tag.color,
                            }}
                          >
                            {noteTag.tag.name}
                          </Badge>
                        ))}
                        {note.tags.length > 3 && (
                          <Badge variant="outline" className="text-xs">
                            +{note.tags.length - 3}
                          </Badge>
                        )}
                      </div>
                    )}

                    {/* Date */}
                    <div className="text-xs text-muted-foreground pt-2 border-t border-border">
                      Updated {new Date(note.updatedAt).toLocaleDateString()}
                    </div>
                  </div>
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>
      )}

      {/* Stats Footer */}
      <Card>
        <CardContent className="py-4">
          <div className="flex items-center justify-between text-sm">
            <span className="text-muted-foreground">
              Showing {notes.length} {notes.length === 1 ? 'note' : 'notes'}
            </span>
            <div className="flex gap-4">
              <span className="text-muted-foreground">
                Published:{' '}
                <span className="font-medium text-foreground">
                  {notes.filter((n) => n.status === 'PUBLISHED').length}
                </span>
              </span>
              <span className="text-muted-foreground">
                Drafts:{' '}
                <span className="font-medium text-foreground">
                  {notes.filter((n) => n.status === 'DRAFT').length}
                </span>
              </span>
              <span className="text-muted-foreground">
                Archived:{' '}
                <span className="font-medium text-foreground">
                  {notes.filter((n) => n.status === 'ARCHIVED').length}
                </span>
              </span>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

