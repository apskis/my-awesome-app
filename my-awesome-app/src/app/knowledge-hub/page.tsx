import { Metadata } from 'next'
import { PrismaClient } from '@/generated/prisma'
import { BookOpen, Plus, Search } from 'lucide-react'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import Link from 'next/link'

export const metadata: Metadata = {
  title: 'Knowledge Hub - My Awesome Notes',
  description: 'Your personal knowledge base and reference library',
}

const prisma = new PrismaClient()

async function getKnowledgeArticles() {
  // TODO: In production, filter by actual user ID from session
  const demoUser = await prisma.user.findUnique({
    where: { email: 'demo@example.com' },
  })

  if (!demoUser) {
    return []
  }

  const articles = await prisma.knowledgeArticle.findMany({
    where: { userId: demoUser.id },
    orderBy: { updatedAt: 'desc' },
  })

  return articles
}

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

export default async function KnowledgeHubPage() {
  const articles = await getKnowledgeArticles()
  const categories = Array.from(new Set(articles.map((a) => a.category)))

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Knowledge Hub</h1>
          <p className="text-muted-foreground mt-1">
            Your personal library of reference materials and guides
          </p>
        </div>
        <Button className="w-full sm:w-auto">
          <Plus className="w-4 h-4 mr-2" />
          New Article
        </Button>
      </div>

      {/* Search Bar */}
      <Card>
        <CardContent className="pt-6">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <input
              type="search"
              placeholder="Search knowledge base..."
              className="w-full pl-10 pr-4 py-2 bg-background border border-input rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-ring"
            />
          </div>
        </CardContent>
      </Card>

      {/* Category Tabs */}
      <Tabs defaultValue="all" className="w-full">
        <TabsList className="w-full sm:w-auto overflow-x-auto">
          <TabsTrigger value="all">
            All ({articles.length})
          </TabsTrigger>
          {categories.map((category) => (
            <TabsTrigger key={category} value={category || 'uncategorized'}>
              {category || 'Uncategorized'} ({articles.filter((a) => a.category === category).length})
            </TabsTrigger>
          ))}
        </TabsList>

        <TabsContent value="all" className="mt-6">
          {articles.length === 0 ? (
            <Card className="p-12">
              <div className="text-center">
                <div className="w-16 h-16 bg-muted rounded-full flex items-center justify-center mx-auto mb-4">
                  <BookOpen className="w-8 h-8 text-muted-foreground" />
                </div>
                <h3 className="text-lg font-semibold text-foreground mb-2">
                  No articles yet
                </h3>
                <p className="text-muted-foreground mb-6">
                  Start building your knowledge base
                </p>
                <Button>
                  <Plus className="w-4 h-4 mr-2" />
                  Create Article
                </Button>
              </div>
            </Card>
          ) : (
            <div className="space-y-4">
              {articles.map((article) => (
                <Link key={article.id} href={`/knowledge-hub/${article.id}`}>
                  <Card className="hover:shadow-lg hover:border-primary transition-all cursor-pointer group">
                    <CardContent className="p-6">
                      <div className="flex items-start gap-4">
                        {/* Icon */}
                        <div
                          className="w-12 h-12 rounded-lg flex items-center justify-center flex-shrink-0 group-hover:scale-110 transition-transform"
                          style={{ backgroundColor: getCategoryColor(article.category) + '20' }}
                        >
                          <BookOpen
                            className="w-6 h-6"
                            style={{ color: getCategoryColor(article.category) }}
                          />
                        </div>

                        {/* Content */}
                        <div className="flex-1 min-w-0">
                          <div className="flex items-start justify-between gap-2 mb-2">
                            <h3 className="font-semibold text-lg text-foreground group-hover:text-primary transition-colors">
                              {article.title}
                            </h3>
                            <Badge
                              style={{
                                backgroundColor: getCategoryColor(article.category) + '20',
                                color: getCategoryColor(article.category),
                                borderColor: getCategoryColor(article.category) + '40',
                              }}
                            >
                              {article.category}
                            </Badge>
                          </div>

                          <p className="text-sm text-muted-foreground line-clamp-2 mb-3">
                            {article.content.substring(0, 200)}...
                          </p>

                          {/* Tags */}
                          {article.tags && article.tags.length > 0 && (
                            <div className="flex flex-wrap gap-2">
                              {article.tags.slice(0, 5).map((tag, index) => (
                                <Badge key={index} variant="outline" className="text-xs">
                                  {tag}
                                </Badge>
                              ))}
                              {article.tags.length > 5 && (
                                <Badge variant="outline" className="text-xs">
                                  +{article.tags.length - 5} more
                                </Badge>
                              )}
                            </div>
                          )}

                          {/* Footer */}
                          <div className="text-xs text-muted-foreground mt-3 pt-3 border-t border-border">
                            Updated {new Date(article.updatedAt).toLocaleDateString()}
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </Link>
              ))}
            </div>
          )}
        </TabsContent>

        {categories.map((category) => (
          <TabsContent key={category} value={category || 'uncategorized'} className="mt-6">
            <div className="space-y-4">
              {articles
                .filter((a) => a.category === category)
                .map((article) => (
                  <Link key={article.id} href={`/knowledge-hub/${article.id}`}>
                    <Card className="hover:shadow-lg hover:border-primary transition-all cursor-pointer group">
                      <CardContent className="p-6">
                        <div className="flex items-start gap-4">
                          <div
                            className="w-12 h-12 rounded-lg flex items-center justify-center flex-shrink-0 group-hover:scale-110 transition-transform"
                            style={{ backgroundColor: getCategoryColor(article.category) + '20' }}
                          >
                            <BookOpen
                              className="w-6 h-6"
                              style={{ color: getCategoryColor(article.category) }}
                            />
                          </div>

                          <div className="flex-1 min-w-0">
                            <h3 className="font-semibold text-lg text-foreground group-hover:text-primary transition-colors mb-2">
                              {article.title}
                            </h3>

                            <p className="text-sm text-muted-foreground line-clamp-2 mb-3">
                              {article.content.substring(0, 200)}...
                            </p>

                            {article.tags && article.tags.length > 0 && (
                              <div className="flex flex-wrap gap-2">
                                {article.tags.map((tag, index) => (
                                  <Badge key={index} variant="outline" className="text-xs">
                                    {tag}
                                  </Badge>
                                ))}
                              </div>
                            )}

                            <div className="text-xs text-muted-foreground mt-3 pt-3 border-t border-border">
                              Updated {new Date(article.updatedAt).toLocaleDateString()}
                            </div>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </Link>
                ))}
            </div>
          </TabsContent>
        ))}
      </Tabs>
    </div>
  )
}

