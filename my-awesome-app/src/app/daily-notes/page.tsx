import { Metadata } from 'next'
import { PrismaClient } from '@/generated/prisma'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Calendar } from '@/components/ui/calendar'
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form'
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert'
import { Calendar as CalendarIcon, Plus, Edit, Smile } from 'lucide-react'
import { format, isToday, isSameDay, parseISO } from 'date-fns'

export const metadata: Metadata = {
  title: 'Daily Notes - My Notes App',
  description: 'Your daily journal entries',
}

const prisma = new PrismaClient()

interface DailyNotesPageProps {
  searchParams: {
    date?: string
    range?: string
  }
}

async function getDailyNotesData(range?: string) {
  const demoUser = await prisma.user.findUnique({
    where: { email: 'demo@myawesomeapp.com' },
  })

  if (!demoUser) {
    return []
  }

  let whereClause: any = {
    userId: demoUser.id,
  }

  // Apply date range filter
  if (range && range !== 'all') {
    const now = new Date()
    let startDate: Date

    switch (range) {
      case '7days':
        startDate = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000)
        break
      case '30days':
        startDate = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000)
        break
      case 'month':
        startDate = new Date(now.getFullYear(), now.getMonth(), 1)
        break
      default:
        startDate = new Date(0)
    }

    whereClause.date = {
      gte: startDate,
    }
  }

  const dailyNotes = await prisma.dailyNote.findMany({
    where: whereClause,
    orderBy: { date: 'desc' },
  })

  return dailyNotes
}

function getMoodEmoji(mood: string | null) {
  const moodMap: Record<string, string> = {
    Happy: '😊',
    Productive: '💪',
    Neutral: '😐',
    Tired: '😴',
    Energized: '⚡',
    Focused: '🎯',
    Stressed: '😰',
    Excited: '🤩',
    Calm: '😌',
    Motivated: '🚀',
  }
  return moodMap[mood || ''] || '😐'
}

function getMoodColor(mood: string | null) {
  const colorMap: Record<string, string> = {
    Happy: 'bg-green-500',
    Productive: 'bg-primary-blue',
    Neutral: 'bg-gray-500',
    Tired: 'bg-orange-500',
    Energized: 'bg-yellow-500',
    Focused: 'bg-purple-500',
    Stressed: 'bg-red-500',
    Excited: 'bg-pink-500',
    Calm: 'bg-blue-500',
    Motivated: 'bg-indigo-500',
  }
  return colorMap[mood || ''] || 'bg-gray-500'
}

export default async function DailyNotesPage({ searchParams }: DailyNotesPageProps) {
  const selectedDate = searchParams.date ? parseISO(searchParams.date) : new Date()
  const range = searchParams.range

  const dailyNotes = await getDailyNotesData(range)
  
  // Find entry for selected date
  const selectedEntry = dailyNotes.find(note => 
    isSameDay(new Date(note.date), selectedDate)
  )

  // Get dates with entries for calendar highlighting
  const datesWithEntries = dailyNotes.map(note => new Date(note.date))

  const hasEntries = dailyNotes.length > 0
  const hasSelectedEntry = !!selectedEntry

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Daily Notes</h1>
          <p className="text-muted-foreground mt-1">
            {hasEntries 
              ? `${dailyNotes.length} journal entr${dailyNotes.length === 1 ? 'y' : 'ies'} found`
              : 'No journal entries yet'
            }
          </p>
        </div>
        <Button className="bg-primary-blue hover:bg-primary-blue/90">
          <Plus className="w-4 h-4 mr-2" />
          Create Entry
        </Button>
      </div>

      {/* Date Range Filter */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Filter by Date Range</CardTitle>
        </CardHeader>
        <CardContent>
          <Select name="range" defaultValue={range || 'all'}>
            <SelectTrigger className="w-full sm:w-48">
              <SelectValue placeholder="Date Range" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Time</SelectItem>
              <SelectItem value="7days">Last 7 Days</SelectItem>
              <SelectItem value="30days">Last 30 Days</SelectItem>
              <SelectItem value="month">This Month</SelectItem>
            </SelectContent>
          </Select>
        </CardContent>
      </Card>

      {!hasEntries ? (
        <Alert className="text-center py-8">
          <AlertTitle>No journal entries yet</AlertTitle>
          <AlertDescription className="mt-2">
            Start writing today! Your daily notes help you reflect and track your progress.
          </AlertDescription>
          <Button className="mt-4 bg-primary-blue hover:bg-primary-blue/90">
            <Plus className="w-4 h-4 mr-2" />
            Create Entry
          </Button>
        </Alert>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Calendar */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg flex items-center gap-2">
                <CalendarIcon className="w-5 h-5" />
                Calendar
              </CardTitle>
            </CardHeader>
            <CardContent>
              <Calendar
                mode="single"
                selected={selectedDate}
                className="rounded-md border"
                modifiers={{
                  hasEntry: datesWithEntries,
                  today: new Date(),
                }}
                modifiersStyles={{
                  hasEntry: {
                    backgroundColor: 'hsl(var(--primary-blue))',
                    color: 'white',
                    borderRadius: '4px',
                  },
                  today: {
                    border: '2px solid hsl(var(--primary-blue))',
                    borderRadius: '4px',
                  },
                }}
              />
              <div className="mt-4 flex items-center gap-4 text-sm text-muted-foreground">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 bg-primary-blue rounded"></div>
                  <span>Has entry</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 border-2 border-primary-blue rounded"></div>
                  <span>Today</span>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Entry Display or Quick Capture */}
          <div className="space-y-6">
            {hasSelectedEntry ? (
              /* Display Selected Entry */
              <Card>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-xl">
                      {format(new Date(selectedEntry.date), 'EEEE, MMMM d, yyyy')}
                    </CardTitle>
                    <div className="flex items-center gap-2">
                      {selectedEntry.mood && (
                        <Badge className={`${getMoodColor(selectedEntry.mood)} text-white`}>
                          <span className="mr-1">{getMoodEmoji(selectedEntry.mood)}</span>
                          {selectedEntry.mood}
                        </Badge>
                      )}
                      <Button variant="outline" size="sm">
                        <Edit className="w-4 h-4 mr-2" />
                        Edit
                      </Button>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="prose prose-gray max-w-none">
                    <div className="whitespace-pre-wrap text-foreground leading-relaxed">
                      {selectedEntry.content}
                    </div>
                  </div>
                </CardContent>
              </Card>
            ) : (
              /* Quick Capture Form */
              <Card>
                <CardHeader>
                  <CardTitle className="text-xl">
                    {isToday(selectedDate) 
                      ? "Today's Entry" 
                      : `Entry for ${format(selectedDate, 'MMMM d, yyyy')}`
                    }
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div>
                      <label className="text-sm font-medium text-foreground mb-2 block">
                        Date
                      </label>
                      <Input
                        type="date"
                        defaultValue={format(selectedDate, 'yyyy-MM-dd')}
                        className="w-full"
                      />
                    </div>

                    <div>
                      <label className="text-sm font-medium text-foreground mb-2 block">
                        Mood
                      </label>
                      <Select defaultValue="">
                        <SelectTrigger>
                          <SelectValue placeholder="How are you feeling?" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="Happy">😊 Happy</SelectItem>
                          <SelectItem value="Productive">💪 Productive</SelectItem>
                          <SelectItem value="Neutral">😐 Neutral</SelectItem>
                          <SelectItem value="Tired">😴 Tired</SelectItem>
                          <SelectItem value="Energized">⚡ Energized</SelectItem>
                          <SelectItem value="Focused">🎯 Focused</SelectItem>
                          <SelectItem value="Stressed">😰 Stressed</SelectItem>
                          <SelectItem value="Excited">🤩 Excited</SelectItem>
                          <SelectItem value="Calm">😌 Calm</SelectItem>
                          <SelectItem value="Motivated">🚀 Motivated</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div>
                      <label className="text-sm font-medium text-foreground mb-2 block">
                        What's on your mind?
                      </label>
                      <Textarea
                        placeholder="Write about your day, thoughts, goals, or anything else..."
                        className="min-h-32"
                      />
                    </div>

                    <Button className="w-full bg-primary-blue hover:bg-primary-blue/90">
                      <Plus className="w-4 h-4 mr-2" />
                      Save Entry
                    </Button>
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Recent Entries */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Recent Entries</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {dailyNotes.slice(0, 5).map((note) => (
                    <div
                      key={note.id}
                      className={`p-3 rounded-lg border cursor-pointer transition-colors ${
                        isSameDay(new Date(note.date), selectedDate)
                          ? 'bg-primary-blue/10 border-primary-blue'
                          : 'hover:bg-accent-cyan/10'
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <div>
                          <div className="font-medium text-sm">
                            {format(new Date(note.date), 'MMM d, yyyy')}
                          </div>
                          <div className="text-xs text-muted-foreground mt-1">
                            {note.content.substring(0, 60)}
                            {note.content.length > 60 && '...'}
                          </div>
                        </div>
                        {note.mood && (
                          <Badge 
                            variant="secondary" 
                            className={`${getMoodColor(note.mood)} text-white text-xs`}
                          >
                            <span className="mr-1">{getMoodEmoji(note.mood)}</span>
                            {note.mood}
                          </Badge>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      )}
    </div>
  )
}