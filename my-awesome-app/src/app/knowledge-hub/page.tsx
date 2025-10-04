'use client'

import { useState, useEffect } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Separator } from '@/components/ui/separator'
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert'
import { Search, BookOpen, Tag, Calendar, Plus, Loader2 } from 'lucide-react'
import Link from 'next/link'
import { formatDistanceToNow } from 'date-fns'
import { toast } from 'sonner'

interface KnowledgeArticle {
  id: string
  title: string
  content: string
  category?: string
  tags: string[]
  userId: string
  createdAt: string
  updatedAt: string
}

export default function KnowledgeHubPage() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const [articles, setArticles] = useState<KnowledgeArticle[]>([])
  const [categories, setCategories] = useState<string[]>([])
  const [allTags, setAllTags] = useState<string[]>([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState(searchParams.get('search') || '')
  const [category, setCategory] = useState(searchParams.get('category') || 'all')
  const [tag, setTag] = useState(searchParams.get('tag') || 'all')

  // Fetch articles
  useEffect(() => {
    fetchArticles()
  }, [category, tag])

  const fetchArticles = async () => {
    try {
      setLoading(true)
      const params = new URLSearchParams()
      if (search) {
        params.set('search', search)
      }
      if (category !== 'all') {
        params.set('category', category)
      }
      if (tag !== 'all') {
        params.set('tag', tag)
      }

      const response = await fetch(`/api/knowledge-articles?${params}`)
      if (response.ok) {
        const data = await response.json()
        setArticles(data.data.articles)
        
        // Extract unique categories and tags
        const uniqueCategories = [...new Set(
          data.data.articles
            .map((a: KnowledgeArticle) => a.category)
            .filter(Boolean)
        )].sort()
        setCategories(uniqueCategories)

        const uniqueTags = [...new Set(
          data.data.articles.flatMap((a: KnowledgeArticle) => a.tags)
        )].sort()
        setAllTags(uniqueTags)
      }
    } catch (error) {
      console.error('Error fetching knowledge articles:', error)
      toast.error('Failed to load articles')
    } finally {
      setLoading(false)
    }
  }

  const filteredArticles = articles.filter(article => {
    if (search && !article.title.toLowerCase().includes(search.toLowerCase()) && 
        !article.content.toLowerCase().includes(search.toLowerCase())) {
      return false
    }
    return true
  })

function getCategoryColor(category: string | null) {
  const colors: Record<string, string> = {
    Development: '#0046FF',
    Design: '#73C8D2',
    Security: '#FF9013',
    Database: '#6366f1',
    DevOps: '#8b5cf6',
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

  const hasArticles = filteredArticles.length > 0
  const hasFilters = search || (category && category !== 'all') || (tag && tag !== 'all')

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
          <h1 className="text-3xl font-bold text-foreground">Knowledge Hub</h1>
          <p className="text-muted-foreground mt-1">
            {filteredArticles.length === 0 
              ? 'No articles found' 
              : `${filteredArticles.length} article${filteredArticles.length === 1 ? '' : 's'} found`
            }
          </p>
        </div>
        <Link href="/knowledge-hub/new">
          <Button className="bg-primary-blue hover:bg-primary-blue/90">
            <Plus className="w-4 h-4 mr-2" />
            Create Article
          </Button>
        </Link>
      </div>

      {/* Search and Filters */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Search & Filter</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {/* Search Input */}
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <Input
                placeholder="Search articles..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="pl-10"
              />
            </div>

            {/* Category and Tag Filters */}
            <div className="flex flex-col sm:flex-row gap-4">
              <div className="flex-1">
                <div className="text-sm font-medium mb-2">Categories:</div>
                <div className="flex flex-wrap gap-2">
                  <Button
                    variant={category === 'all' || !category ? "default" : "outline"}
                    size="sm"
                    className={category === 'all' || !category ? "bg-primary-blue" : ""}
                    onClick={() => setCategory('all')}
                  >
                    All
                  </Button>
                  {categories.map((cat) => (
                    <Button
                      key={cat}
                      variant={category === cat ? "default" : "outline"}
                      size="sm"
                      className={category === cat ? "bg-primary-blue" : ""}
                      style={category === cat ? {} : getCategoryBadgeColor(cat)}
                      onClick={() => setCategory(cat)}
                    >
                      {cat}
                    </Button>
                  ))}
                </div>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row gap-4">
              <div className="flex-1">
                <div className="text-sm font-medium mb-2">Tags:</div>
                <div className="flex flex-wrap gap-2">
                  <Button
                    variant={tag === 'all' || !tag ? "default" : "outline"}
                    size="sm"
                    className={tag === 'all' || !tag ? "bg-primary-blue" : ""}
                    onClick={() => setTag('all')}
                  >
                    All Tags
                  </Button>
                  {allTags.slice(0, 10).map((tagName) => (
                    <Button
                      key={tagName}
                      variant={tag === tagName ? "default" : "outline"}
                      size="sm"
                      className={tag === tagName ? "bg-primary-blue" : ""}
                      onClick={() => setTag(tagName)}
                    >
                      <Tag className="w-3 h-3 mr-1" />
                      {tagName}
                    </Button>
                  ))}
                  {allTags.length > 10 && (
                    <span className="text-sm text-muted-foreground self-center">
                      +{allTags.length - 10} more
                    </span>
                  )}
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Articles Display */}
      {!hasArticles ? (
        <Alert className="text-center py-8">
          <AlertTitle>
            {hasFilters ? 'No articles match your search' : 'No articles found'}
          </AlertTitle>
          <AlertDescription className="mt-2">
            {hasFilters 
              ? 'Try adjusting your search criteria or filters.'
              : 'Content coming soon!'
            }
          </AlertDescription>
        </Alert>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Articles List - Sidebar on desktop, top on mobile */}
          <div className="lg:col-span-1">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg flex items-center gap-2">
                  <BookOpen className="w-5 h-5" />
                  Articles
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  {filteredArticles.map((article, index) => (
                    <Link
                      key={article.id}
                      href={`#article-${index}`}
                      className="block p-3 rounded-lg hover:bg-accent-cyan/10 transition-colors group"
                    >
                      <div className="font-medium text-sm text-foreground group-hover:text-primary-blue">
                        {article.title}
                      </div>
                      <div className="flex items-center gap-2 mt-1">
                        {article.category && (
                          <Badge
                            variant="secondary"
                            className="text-xs"
                            style={getCategoryBadgeColor(article.category)}
                          >
                            {article.category}
                          </Badge>
                        )}
                        <span className="text-xs text-muted-foreground">
                          {formatDistanceToNow(new Date(article.createdAt), { addSuffix: true })}
                        </span>
                      </div>
                    </Link>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Articles Content - Main area */}
          <div className="lg:col-span-2">
            <div className="space-y-6">
              {filteredArticles.map((article, index) => (
                <Card key={article.id} id={`article-${index}`}>
                  <CardHeader>
                    <div className="flex items-start justify-between gap-2">
                      <CardTitle className="text-xl">{article.title}</CardTitle>
                      {article.category && (
                        <Badge
                          variant="secondary"
                          style={getCategoryBadgeColor(article.category)}
                        >
                          {article.category}
                        </Badge>
                      )}
                    </div>
                    
                    <div className="flex items-center gap-4 text-sm text-muted-foreground">
                      <div className="flex items-center gap-1">
                        <Calendar className="w-4 h-4" />
                        <span>Created {formatDistanceToNow(new Date(article.createdAt), { addSuffix: true })}</span>
                      </div>
                    </div>
                  </CardHeader>
                  
                  <CardContent>
                    {/* Tags */}
                    {article.tags.length > 0 && (
                      <div className="mb-4">
                        <div className="flex items-center gap-2 mb-2">
                          <Tag className="w-4 h-4 text-muted-foreground" />
                          <span className="text-sm font-medium text-muted-foreground">Tags:</span>
                        </div>
                        <div className="flex flex-wrap gap-2">
                          {article.tags.map((tagName) => (
                            <Badge
                              key={tagName}
                              variant="outline"
                              className="text-xs"
                            >
                              {tagName}
                            </Badge>
                          ))}
                        </div>
                      </div>
                    )}

                    <Separator className="mb-4" />

                    {/* Article Content */}
                    <div className="prose prose-gray max-w-none">
                      <div className="whitespace-pre-wrap text-foreground leading-relaxed">
                        {article.content}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Related Articles Section */}
      {hasArticles && (
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Quick Navigation</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {filteredArticles.slice(0, 6).map((article) => (
                <Link
                  key={article.id}
                  href={`#article-${filteredArticles.indexOf(article)}`}
                  className="block p-3 rounded-lg hover:bg-accent-cyan/10 transition-colors group"
                >
                  <div className="font-medium text-sm text-foreground group-hover:text-primary-blue mb-1">
                    {article.title}
                  </div>
                  <div className="flex items-center gap-2">
                    {article.category && (
                      <Badge
                        variant="secondary"
                        className="text-xs"
                        style={getCategoryBadgeColor(article.category)}
                      >
                        {article.category}
                      </Badge>
                    )}
                    <span className="text-xs text-muted-foreground">
                      {formatDistanceToNow(new Date(article.createdAt), { addSuffix: true })}
                    </span>
                  </div>
                </Link>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}