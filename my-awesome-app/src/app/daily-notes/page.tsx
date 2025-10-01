import { Metadata } from 'next'
import { PrismaClient } from '@/generated/prisma'
import { Calendar, Plus, Smile, Meh, Frown } from 'lucide-react'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'

export const metadata: Metadata = {
  title: 'Daily Notes - My Awesome Notes',
  description: 'Your daily journal and notes',
}

const prisma = new PrismaClient()

async function getDailyNotes() {
  // TODO: In production, filter by actual user ID from session
  const demoUser = await prisma.user.findUnique({
    where: { email: 'demo@example.com' },
  })

  if (!demoUser) {
    return []
  }

  const dailyNotes = await prisma.dailyNote.findMany({
    where: { userId: demoUser.id },
    orderBy: { date: 'desc' },
    take: 30, // Last 30 days
  })

  return dailyNotes
}

function getMoodIcon(mood: string | null) {
  switch (mood) {
    case 'GREAT':
      return { icon: Smile, color: '#10b981', label: '😊 Great' }
    case 'GOOD':
      return { icon: Smile, color: '#73C8D2', label: '🙂 Good' }
    case 'NEUTRAL':
      return { icon: Meh, color: '#6b7280', label: '😐 Neutral' }
    case 'BAD':
      return { icon: Frown, color: '#FF9013', label: '😕 Bad' }
    case 'TERRIBLE':
      return { icon: Frown, color: '#ef4444', label: '😢 Terrible' }
    default:
      return { icon: Meh, color: '#6b7280', label: '- No mood' }
  }
}

export default async function DailyNotesPage() {
  const dailyNotes = await getDailyNotes()

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Daily Notes</h1>
          <p className="text-muted-foreground mt-1">
            Your daily journal and reflections
          </p>
        </div>
        <Button className="w-full sm:w-auto">
          <Plus className="w-4 h-4 mr-2" />
          New Entry
        </Button>
      </div>

      {/* Calendar View Placeholder */}
      <Card>
        <CardContent className="p-6">
          <div className="flex items-center gap-2 text-muted-foreground">
            <Calendar className="w-5 h-5" />
            <span className="text-sm">Calendar view coming soon</span>
          </div>
        </CardContent>
      </Card>

      {/* Daily Notes List */}
      {dailyNotes.length === 0 ? (
        <Card className="p-12">
          <div className="text-center">
            <div className="w-16 h-16 bg-muted rounded-full flex items-center justify-center mx-auto mb-4">
              <Calendar className="w-8 h-8 text-muted-foreground" />
            </div>
            <h3 className="text-lg font-semibold text-foreground mb-2">
              No journal entries yet
            </h3>
            <p className="text-muted-foreground mb-6">
              Start your journaling journey today!
            </p>
            <Button>
              <Plus className="w-4 h-4 mr-2" />
              Create Entry
            </Button>
          </div>
        </Card>
      ) : (
        <div className="space-y-4">
          {dailyNotes.map((entry) => {
            const moodInfo = getMoodIcon(entry.mood)
            const MoodIcon = moodInfo.icon

            return (
              <Card key={entry.id} className="hover:shadow-md transition-shadow">
                <CardContent className="p-6">
                  <div className="flex items-start gap-4">
                    {/* Date Badge */}
                    <div className="flex-shrink-0">
                      <div className="bg-primary text-primary-foreground rounded-lg p-3 text-center min-w-[4rem]">
                        <div className="text-2xl font-bold">
                          {new Date(entry.date).getDate()}
                        </div>
                        <div className="text-xs">
                          {new Date(entry.date).toLocaleDateString('en-US', { month: 'short' })}
                        </div>
                      </div>
                    </div>

                    {/* Content */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between mb-3">
                        <h3 className="font-semibold text-foreground">
                          {new Date(entry.date).toLocaleDateString('en-US', {
                            weekday: 'long',
                            year: 'numeric',
                            month: 'long',
                            day: 'numeric',
                          })}
                        </h3>
                        {entry.mood && (
                          <Badge
                            variant="outline"
                            style={{
                              borderColor: moodInfo.color,
                              color: moodInfo.color,
                            }}
                          >
                            <MoodIcon className="w-3 h-3 mr-1" />
                            {entry.mood}
                          </Badge>
                        )}
                      </div>
                      <p className="text-sm text-muted-foreground whitespace-pre-wrap">
                        {entry.content}
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )
          })}
        </div>
      )}

      {/* Mood Legend */}
      {dailyNotes.length > 0 && (
        <Card>
          <CardContent className="py-4">
            <div className="flex flex-wrap items-center gap-4 justify-center text-sm">
              <span className="text-muted-foreground">Mood Legend:</span>
              {['GREAT', 'GOOD', 'NEUTRAL', 'BAD', 'TERRIBLE'].map((mood) => {
                const moodInfo = getMoodIcon(mood)
                return (
                  <Badge
                    key={mood}
                    variant="outline"
                    style={{
                      borderColor: moodInfo.color,
                      color: moodInfo.color,
                    }}
                  >
                    {moodInfo.label}
                  </Badge>
                )
              })}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}

