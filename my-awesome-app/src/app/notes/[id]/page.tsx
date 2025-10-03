import { Metadata } from 'next'
import { PrismaClient, NoteStatus } from '@/generated/prisma'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert'
import { Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbList, BreadcrumbPage, BreadcrumbSeparator } from '@/components/ui/breadcrumb'
import { ArrowLeft, Edit, Trash2, Calendar, Tag, Folder } from 'lucide-react'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import { formatDistanceToNow } from 'date-fns'

const prisma = new PrismaClient()

interface NoteDetailPageProps {
  params: {
    id: string
  }
}

async function getNoteData(id: string) {
  const demoUser = await prisma.user.findUnique({
    where: { email: 'demo@myawesomeapp.com' },
  })

  if (!demoUser) {
    return null
  }

  const note = await prisma.note.findFirst({
    where: {
      id,
      userId: demoUser.id,
    },
    include: {
      category: true,
      tags: {
        include: {
          tag: true,
        },
      },
    },
  })

  if (!note) {
    return null
  }

  // Get related notes (same category or shared tags)
  const relatedNotes = await prisma.note.findMany({
    where: {
      id: { not: note.id },
      userId: demoUser.id,
      OR: [
        { categoryId: note.categoryId },
        {
          tags: {
            some: {
              tagId: {
                in: note.tags.map(nt => nt.tagId),
              },
            },
          },
        },
      ],
    },
    include: {
      category: true,
      tags: {
        include: {
          tag: true,
        },
      },
    },
    orderBy: { updatedAt: 'desc' },
    take: 5,
  })

  return {
    note,
    relatedNotes,
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

export async function generateMetadata({ params }: NoteDetailPageProps): Promise<Metadata> {
  const data = await getNoteData(params.id)
  
  if (!data) {
    return {
      title: 'Note Not Found - My Notes App',
      description: 'The requested note could not be found.',
    }
  }

  const { note } = data
  const description = note.content.length > 150 
    ? note.content.substring(0, 150) + '...'
    : note.content

  return {
    title: `${note.title} - My Notes App`,
    description,
  }
}

export default async function NoteDetailPage({ params }: NoteDetailPageProps) {
  const data = await getNoteData(params.id)

  if (!data) {
    notFound()
  }

  const { note, relatedNotes } = data

  return (
    <div className="space-y-6">
      {/* Breadcrumb Navigation */}
      <Breadcrumb aria-label="Breadcrumb">
        <BreadcrumbList>
          <BreadcrumbItem>
            <BreadcrumbLink asChild>
              <Link href="/dashboard">Dashboard</Link>
            </BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbLink asChild>
              <Link href="/notes">Notes</Link>
            </BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbPage>{note.title}</BreadcrumbPage>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>

      {/* Header with Actions */}
      <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
        <div className="flex-1">
          <div className="flex items-center gap-3 mb-2">
            <h1 className="text-3xl font-bold text-foreground">{note.title}</h1>
            <Badge className={getStatusBadgeColor(note.status)}>
              {note.status}
            </Badge>
          </div>
          
          {/* Metadata */}
          <div className="flex flex-wrap items-center gap-4 text-sm text-muted-foreground">
            <div className="flex items-center gap-1">
              <Calendar className="w-4 h-4" />
              <span>Created {formatDistanceToNow(new Date(note.createdAt), { addSuffix: true })}</span>
            </div>
            
            {note.updatedAt !== note.createdAt && (
              <div className="flex items-center gap-1">
                <Calendar className="w-4 h-4" />
                <span>Updated {formatDistanceToNow(new Date(note.updatedAt), { addSuffix: true })}</span>
              </div>
            )}
            
            {note.category && (
              <div className="flex items-center gap-1">
                <Folder className="w-4 h-4" />
                <span>Category: {note.category.name}</span>
              </div>
            )}
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center gap-2">
          <Link href="/notes">
            <Button variant="outline" size="sm">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Notes
            </Button>
          </Link>
          <Link href={`/notes/${note.id}/edit`}>
            <Button variant="outline" size="sm">
              <Edit className="w-4 h-4 mr-2" />
              Edit Note
            </Button>
          </Link>
          <Button variant="destructive" size="sm">
            <Trash2 className="w-4 h-4 mr-2" />
            Delete
          </Button>
        </div>
      </div>

      {/* Main Content */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Note Content */}
        <div className="lg:col-span-2">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <span>Content</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="prose prose-gray max-w-none">
                <div className="whitespace-pre-wrap text-foreground leading-relaxed">
                  {note.content}
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Category and Tags */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Details</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* Category */}
              {note.category && (
                <div>
                  <h4 className="text-sm font-medium text-foreground mb-2 flex items-center gap-2">
                    <Folder className="w-4 h-4" />
                    Category
                  </h4>
                  <Badge
                    variant="secondary"
                    className="text-sm"
                    style={{ 
                      backgroundColor: note.category.color + '20', 
                      color: note.category.color 
                    }}
                  >
                    {note.category.name}
                  </Badge>
                </div>
              )}

              {/* Tags */}
              {note.tags.length > 0 && (
                <div>
                  <h4 className="text-sm font-medium text-foreground mb-2 flex items-center gap-2">
                    <Tag className="w-4 h-4" />
                    Tags
                  </h4>
                  <div className="flex flex-wrap gap-2">
                    {note.tags.map((noteTag) => (
                      <Badge
                        key={noteTag.tag.id}
                        variant="outline"
                        className="text-sm"
                        style={{ color: noteTag.tag.color }}
                      >
                        {noteTag.tag.name}
                      </Badge>
                    ))}
                  </div>
                </div>
              )}

              {/* Status */}
              <div>
                <h4 className="text-sm font-medium text-foreground mb-2">Status</h4>
                <Badge className={getStatusBadgeColor(note.status)}>
                  {note.status}
                </Badge>
              </div>
            </CardContent>
          </Card>

          {/* Related Notes */}
          {relatedNotes.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Related Notes</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {relatedNotes.map((relatedNote) => (
                    <Link
                      key={relatedNote.id}
                      href={`/notes/${relatedNote.id}`}
                      className="block p-3 rounded-lg hover:bg-accent-cyan/10 transition-colors group"
                    >
                      <h4 className="font-medium text-sm text-foreground group-hover:text-primary-blue">
                        {relatedNote.title}
                      </h4>
                      <div className="flex items-center gap-2 mt-1">
                        <Badge className={getStatusBadgeColor(relatedNote.status)}>
                          {relatedNote.status}
                        </Badge>
                        {relatedNote.category && (
                          <Badge
                            variant="secondary"
                            className="text-xs"
                            style={{ 
                              backgroundColor: relatedNote.category.color + '20', 
                              color: relatedNote.category.color 
                            }}
                          >
                            {relatedNote.category.name}
                          </Badge>
                        )}
                      </div>
                      <p className="text-xs text-muted-foreground mt-1">
                        {formatDistanceToNow(new Date(relatedNote.updatedAt), { addSuffix: true })}
                      </p>
                    </Link>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  )
}
