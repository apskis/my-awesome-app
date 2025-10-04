'use client'

import { useState, useEffect } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert'
import { Search, Eye, FileText, Plus, Loader2 } from 'lucide-react'
import Link from 'next/link'
import { toast } from 'sonner'

interface Template {
  id: string
  name: string
  description?: string
  content: string
  category?: string
  createdAt: string
  updatedAt: string
}

export default function TemplatesPage() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const [templates, setTemplates] = useState<Template[]>([])
  const [categories, setCategories] = useState<string[]>([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState(searchParams.get('search') || '')
  const [category, setCategory] = useState(searchParams.get('category') || 'all')
  const [usingTemplate, setUsingTemplate] = useState<string | null>(null)

  // Fetch templates
  useEffect(() => {
    fetchTemplates()
  }, [category])

  const fetchTemplates = async () => {
    try {
      setLoading(true)
      const params = new URLSearchParams()
      if (category !== 'all') {
        params.set('category', category)
      }

      const response = await fetch(`/api/templates?${params}`)
      if (response.ok) {
        const data = await response.json()
        setTemplates(data.data.templates)
        
        // Extract unique categories
        const uniqueCategories = [...new Set(
          data.data.templates
            .map((t: Template) => t.category)
            .filter(Boolean)
        )].sort()
        setCategories(uniqueCategories)
      }
    } catch (error) {
      console.error('Error fetching templates:', error)
      toast.error('Failed to load templates')
    } finally {
      setLoading(false)
    }
  }

  const handleUseTemplate = async (templateId: string) => {
    try {
      setUsingTemplate(templateId)
      const response = await fetch(`/api/templates/${templateId}/use`, {
        method: 'POST',
      })

      if (response.ok) {
        const data = await response.json()
        toast.success('Note created from template!')
        router.push(`/notes/${data.data.id}/edit`)
      } else {
        const error = await response.json()
        toast.error(error.message || 'Failed to create note from template')
      }
    } catch (error) {
      console.error('Error using template:', error)
      toast.error('Failed to create note from template')
    } finally {
      setUsingTemplate(null)
    }
  }

  const filteredTemplates = templates.filter(template => {
    if (search && !template.name.toLowerCase().includes(search.toLowerCase()) && 
        !template.description?.toLowerCase().includes(search.toLowerCase())) {
      return false
    }
    return true
  })

function getCategoryColor(category: string | null) {
  const colors: Record<string, string> = {
    Work: '#0046FF',
    Personal: '#73C8D2',
    Learning: '#FF9013',
    Projects: '#0046FF',
    Ideas: '#73C8D2',
  }
  return colors[category || ''] || '#6b7280'
}

function getCategoryBadgeColor(category: string | null) {
  const color = getCategoryColor(category)
  return {
    backgroundColor: color + '20',
    color: color,
    borderColor: color + '40',
  }
}

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
          <h1 className="text-3xl font-bold text-foreground">Templates</h1>
          <p className="text-muted-foreground mt-1">
            {filteredTemplates.length === 0 
              ? 'No templates available' 
              : `${filteredTemplates.length} template${filteredTemplates.length === 1 ? '' : 's'} found`
            }
          </p>
        </div>
        <Link href="/templates/new">
          <Button className="bg-primary-blue hover:bg-primary-blue/90">
            <Plus className="w-4 h-4 mr-2" />
            Create Template
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
                  placeholder="Search templates..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>

            {/* Category Filter */}
            <Select value={category} onValueChange={setCategory}>
              <SelectTrigger className="w-full sm:w-48">
                <SelectValue placeholder="Category" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Categories</SelectItem>
                {categories.map((cat) => (
                  <SelectItem key={cat} value={cat || ''}>
                    {cat}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Templates Grid */}
      {filteredTemplates.length === 0 ? (
        <Alert className="text-center py-8">
          <AlertTitle>
            {search || category ? 'No templates match your search' : 'No templates available'}
          </AlertTitle>
          <AlertDescription className="mt-2">
            {search || category 
              ? 'Try adjusting your search criteria or filters.'
              : 'Check back later for new templates!'
            }
          </AlertDescription>
        </Alert>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filteredTemplates.map((template) => (
            <Card 
              key={template.id} 
              className="hover:shadow-lg transition-all duration-200 hover:-translate-y-1"
            >
              <CardHeader className="pb-3">
                <div className="flex items-start justify-between gap-2">
                  <CardTitle className="text-lg truncate">{template.name}</CardTitle>
                  {template.category && (
                    <Badge
                      variant="secondary"
                      className="flex-shrink-0"
                      style={getCategoryBadgeColor(template.category)}
                    >
                      {template.category}
                    </Badge>
                  )}
                </div>
                {template.description && (
                  <p className="text-sm text-muted-foreground line-clamp-2">
                    {template.description}
                  </p>
                )}
              </CardHeader>
              
              <CardContent className="pt-0">
                {/* Content Preview */}
                <div className="mb-4">
                  <div className="text-xs text-muted-foreground mb-2">Preview:</div>
                  <div className="text-sm text-gray-600 bg-gray-50 p-3 rounded border max-h-20 overflow-hidden">
                    {template.content.substring(0, 100)}
                    {template.content.length > 100 && '...'}
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="flex items-center gap-2">
                  <Dialog>
                    <DialogTrigger asChild>
                      <Button
                        variant="outline"
                        size="sm"
                        className="flex-1"
                        aria-label={`Preview template ${template.name}`}
                      >
                        <Eye className="w-4 h-4 mr-2" />
                        Preview
                      </Button>
                    </DialogTrigger>
                    <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
                      <DialogHeader>
                        <DialogTitle>{template.name}</DialogTitle>
                        {template.description && (
                          <DialogDescription>{template.description}</DialogDescription>
                        )}
                        {template.category && (
                          <div className="mt-2">
                            <Badge
                              variant="secondary"
                              style={getCategoryBadgeColor(template.category)}
                            >
                              {template.category}
                            </Badge>
                          </div>
                        )}
                      </DialogHeader>
                      
                      <div className="mt-4">
                        <div className="text-sm font-medium mb-2">Template Content:</div>
                        <div className="bg-gray-50 p-4 rounded border">
                          <pre className="whitespace-pre-wrap text-sm text-gray-700 font-mono">
                            {template.content}
                          </pre>
                        </div>
                      </div>
                      
                      <DialogFooter>
                        <Button variant="outline">Close</Button>
                        <Button 
                          className="bg-primary-blue hover:bg-primary-blue/90"
                          onClick={() => handleUseTemplate(template.id)}
                          disabled={usingTemplate === template.id}
                        >
                          {usingTemplate === template.id ? (
                            <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                          ) : (
                            <FileText className="w-4 h-4 mr-2" />
                          )}
                          Use Template
                        </Button>
                      </DialogFooter>
                    </DialogContent>
                  </Dialog>

                  <Button 
                    size="sm" 
                    className="flex-1 bg-primary-blue hover:bg-primary-blue/90"
                    onClick={() => handleUseTemplate(template.id)}
                    disabled={usingTemplate === template.id}
                  >
                    {usingTemplate === template.id ? (
                      <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    ) : (
                      <FileText className="w-4 h-4 mr-2" />
                    )}
                    Use Template
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {/* Summary Stats */}
      {filteredTemplates.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Summary</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="text-center">
                <div className="text-2xl font-bold text-foreground">
                  {filteredTemplates.length}
                </div>
                <div className="text-sm text-muted-foreground">Total Templates</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-foreground">
                  {categories.length}
                </div>
                <div className="text-sm text-muted-foreground">Categories</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-foreground">
                  {filteredTemplates.filter(t => t.description).length}
                </div>
                <div className="text-sm text-muted-foreground">With Descriptions</div>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}