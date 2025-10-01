import { Metadata } from 'next'
import { PrismaClient } from '@/generated/prisma'
import { Archive as ArchiveIcon, RotateCcw } from 'lucide-react'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'

export const metadata: Metadata = {
  title: 'Archive - My Awesome Notes',
  description: 'View archived notes and projects',
}

const prisma = new PrismaClient()

async function getArchivedContent() {
  // TODO: In production, filter by actual user ID from session
  const demoUser = await prisma.user.findUnique({
    where: { email: 'demo@example.com' },
  })

  if (!demoUser) {
    return { notes: [] }
  }

  const archivedNotes = await prisma.note.findMany({
    where: {
      userId: demoUser.id,
      status: 'ARCHIVED',
    },
    include: {
      category: true,
    },
    orderBy: { updatedAt: 'desc' },
  })

  return { notes: archivedNotes }
}

export default async function ArchivePage() {
  const { notes } = await getArchivedContent()

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-foreground">Archive</h1>
        <p className="text-muted-foreground mt-1">
          View and restore archived items
        </p>
      </div>

      {/* Archived Notes */}
      <div>
        <h2 className="text-xl font-semibold text-foreground mb-4">Archived Notes</h2>
        {notes.length === 0 ? (
          <Card className="p-12">
            <div className="text-center">
              <div className="w-16 h-16 bg-muted rounded-full flex items-center justify-center mx-auto mb-4">
                <ArchiveIcon className="w-8 h-8 text-muted-foreground" />
              </div>
              <h3 className="text-lg font-semibold text-foreground mb-2">
                No archived items
              </h3>
              <p className="text-muted-foreground">
                Your archive is empty
              </p>
            </div>
          </Card>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {notes.map((note) => (
              <Card key={note.id} className="hover:shadow-md transition-shadow opacity-75 hover:opacity-100">
                <CardContent className="p-6">
                  {/* Header */}
                  <div className="flex items-start justify-between gap-2 mb-3">
                    <h3 className="font-semibold text-foreground line-clamp-2">
                      {note.title}
                    </h3>
                    <Badge variant="secondary">ARCHIVED</Badge>
                  </div>

                  {/* Content Preview */}
                  <p className="text-sm text-muted-foreground line-clamp-3 mb-4">
                    {note.content.substring(0, 150)}...
                  </p>

                  {/* Category */}
                  {note.category && (
                    <Badge
                      variant="outline"
                      className="mb-4"
                      style={{
                        backgroundColor: note.category.color + '10',
                        borderColor: note.category.color + '40',
                        color: note.category.color,
                      }}
                    >
                      {note.category.name}
                    </Badge>
                  )}

                  {/* Actions */}
                  <div className="flex gap-2 pt-4 border-t border-border">
                    <Button variant="outline" size="sm" className="flex-1">
                      <RotateCcw className="w-3 h-3 mr-1" />
                      Restore
                    </Button>
                    <Button variant="outline" size="sm">
                      View
                    </Button>
                  </div>

                  {/* Date */}
                  <div className="text-xs text-muted-foreground mt-3">
                    Archived {new Date(note.updatedAt).toLocaleDateString()}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

