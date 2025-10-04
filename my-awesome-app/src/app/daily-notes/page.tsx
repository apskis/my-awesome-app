'use client'

import { useState, useEffect } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Calendar } from '@/components/ui/calendar'
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form'
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert'
import { Calendar as CalendarIcon, Plus, Edit, Smile, Loader2 } from 'lucide-react'
import { format, isToday, isSameDay, parseISO, startOfDay } from 'date-fns'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { CreateDailyNoteSchema } from '@/lib/validations/daily-note'
import { toast } from 'sonner'

interface DailyNote {
  id: string
  date: string
  content: string
  mood?: string
  userId: string
  createdAt: string
  updatedAt: string
}

const MOODS = [
  { value: 'Happy', emoji: '😊', color: 'bg-green-500' },
  { value: 'Productive', emoji: '💪', color: 'bg-primary-blue' },
  { value: 'Neutral', emoji: '😐', color: 'bg-gray-500' },
  { value: 'Tired', emoji: '😴', color: 'bg-orange-500' },
  { value: 'Energized', emoji: '⚡', color: 'bg-yellow-500' },
  { value: 'Focused', emoji: '🎯', color: 'bg-purple-500' },
  { value: 'Stressed', emoji: '😰', color: 'bg-red-500' },
  { value: 'Excited', emoji: '🤩', color: 'bg-pink-500' },
  { value: 'Calm', emoji: '😌', color: 'bg-blue-500' },
  { value: 'Motivated', emoji: '🚀', color: 'bg-indigo-500' },
]

export default function DailyNotesPage() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const [dailyNotes, setDailyNotes] = useState<DailyNote[]>([])
  const [selectedDate, setSelectedDate] = useState<Date>(new Date())
  const [selectedEntry, setSelectedEntry] = useState<DailyNote | null>(null)
  const [loading, setLoading] = useState(true)
  const [submitting, setSubmitting] = useState(false)
  const [range, setRange] = useState('all')

  const form = useForm({
    resolver: zodResolver(CreateDailyNoteSchema),
    defaultValues: {
      date: format(new Date(), 'yyyy-MM-dd'),
      content: '',
      mood: '',
    },
  })

  // Fetch daily notes
  useEffect(() => {
    fetchDailyNotes()
  }, [range])

  // Check for selected date from URL params
  useEffect(() => {
    const dateParam = searchParams.get('date')
    if (dateParam) {
      const date = parseISO(dateParam)
      setSelectedDate(date)
      form.setValue('date', format(date, 'yyyy-MM-dd'))
    }
  }, [searchParams, form])

  // Check for entry on selected date
  useEffect(() => {
    if (dailyNotes.length > 0) {
      const entry = dailyNotes.find(note => 
        isSameDay(new Date(note.date), selectedDate)
      )
      setSelectedEntry(entry || null)
    }
  }, [dailyNotes, selectedDate])

  const fetchDailyNotes = async () => {
    try {
      setLoading(true)
      const params = new URLSearchParams()
      if (range !== 'all') {
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

        params.set('startDate', format(startDate, 'yyyy-MM-dd'))
      }

      const response = await fetch(`/api/daily-notes?${params}`)
      if (response.ok) {
        const data = await response.json()
        setDailyNotes(data.data.dailyNotes)
      }
    } catch (error) {
      console.error('Error fetching daily notes:', error)
      toast.error('Failed to load daily notes')
    } finally {
      setLoading(false)
    }
  }

  const onSubmit = async (data: any) => {
    try {
      setSubmitting(true)
      const response = await fetch('/api/daily-notes', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      })

      if (response.ok) {
        const newNote = await response.json()
        setDailyNotes(prev => [newNote.data, ...prev])
        setSelectedEntry(newNote.data)
        form.reset()
        toast.success('Daily entry saved!')
      } else {
        const error = await response.json()
        toast.error(error.message || 'Failed to save entry')
      }
    } catch (error) {
      console.error('Error saving daily note:', error)
      toast.error('Failed to save entry')
    } finally {
      setSubmitting(false)
    }
  }

  const getMoodEmoji = (mood: string | null) => {
    const moodObj = MOODS.find(m => m.value === mood)
    return moodObj?.emoji || '😐'
  }

  const getMoodColor = (mood: string | null) => {
    const moodObj = MOODS.find(m => m.value === mood)
    return moodObj?.color || 'bg-gray-500'
  }

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
        <Button 
          className="bg-primary-blue hover:bg-primary-blue/90"
          onClick={() => {
            setSelectedDate(new Date())
            form.setValue('date', format(new Date(), 'yyyy-MM-dd'))
            setSelectedEntry(null)
          }}
        >
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
          <Select value={range} onValueChange={setRange}>
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
          <Button 
            className="mt-4 bg-primary-blue hover:bg-primary-blue/90"
            onClick={() => {
              setSelectedDate(new Date())
              form.setValue('date', format(new Date(), 'yyyy-MM-dd'))
              setSelectedEntry(null)
            }}
          >
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
                onSelect={(date) => {
                  if (date) {
                    setSelectedDate(date)
                    form.setValue('date', format(date, 'yyyy-MM-dd'))
                  }
                }}
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
                      <Button 
                        variant="outline" 
                        size="sm"
                        onClick={() => router.push(`/daily-notes/${selectedEntry.id}/edit`)}
                      >
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
                  <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                      <FormField
                        control={form.control}
                        name="date"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Date</FormLabel>
                            <FormControl>
                              <Input
                                type="date"
                                {...field}
                                className="w-full"
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={form.control}
                        name="mood"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Mood</FormLabel>
                            <Select onValueChange={field.onChange} defaultValue={field.value}>
                              <FormControl>
                                <SelectTrigger>
                                  <SelectValue placeholder="How are you feeling?" />
                                </SelectTrigger>
                              </FormControl>
                              <SelectContent>
                                {MOODS.map((mood) => (
                                  <SelectItem key={mood.value} value={mood.value}>
                                    {mood.emoji} {mood.value}
                                  </SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={form.control}
                        name="content"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>What's on your mind?</FormLabel>
                            <FormControl>
                              <Textarea
                                placeholder="Write about your day, thoughts, goals, or anything else..."
                                className="min-h-32"
                                {...field}
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <Button 
                        type="submit" 
                        className="w-full bg-primary-blue hover:bg-primary-blue/90"
                        disabled={submitting}
                      >
                        {submitting ? (
                          <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                        ) : (
                          <Plus className="w-4 h-4 mr-2" />
                        )}
                        Save Entry
                      </Button>
                    </form>
                  </Form>
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
                      onClick={() => {
                        setSelectedDate(new Date(note.date))
                        form.setValue('date', format(new Date(note.date), 'yyyy-MM-dd'))
                      }}
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