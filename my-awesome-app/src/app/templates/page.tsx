import { Metadata } from 'next'
import { PrismaClient } from '@/generated/prisma'
import { FileCode, Plus } from 'lucide-react'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'

export const metadata: Metadata = {
  title: 'Templates - My Awesome Notes',
  description: 'Browse and use pre-made note templates',
}

const prisma = new PrismaClient()

async function getTemplates() {
  const templates = await prisma.template.findMany({
    orderBy: { createdAt: 'desc' },
  })

  return templates
}

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

export default async function TemplatesPage() {
  const templates = await getTemplates()
  
  const categories = Array.from(new Set(templates.map((t) => t.category)))

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Templates</h1>
          <p className="text-muted-foreground mt-1">
            Pre-made templates to jumpstart your note-taking
          </p>
        </div>
        <Button variant="outline" className="w-full sm:w-auto">
          <Plus className="w-4 h-4 mr-2" />
          Create Template
        </Button>
      </div>

      {/* Category Tabs */}
      <Tabs defaultValue="all" className="w-full">
        <TabsList className="w-full sm:w-auto overflow-x-auto">
          <TabsTrigger value="all">
            All ({templates.length})
          </TabsTrigger>
          {categories.map((category) => (
            <TabsTrigger key={category} value={category || 'uncategorized'}>
              {category || 'Uncategorized'} ({templates.filter((t) => t.category === category).length})
            </TabsTrigger>
          ))}
        </TabsList>

        <TabsContent value="all" className="mt-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {templates.map((template) => (
              <Card
                key={template.id}
                className="hover:shadow-lg hover:border-primary transition-all cursor-pointer group"
              >
                <CardContent className="p-6">
                  {/* Icon & Category */}
                  <div className="flex items-start justify-between mb-4">
                    <div
                      className="w-12 h-12 rounded-lg flex items-center justify-center group-hover:scale-110 transition-transform"
                      style={{ backgroundColor: getCategoryColor(template.category) + '20' }}
                    >
                      <FileCode
                        className="w-6 h-6"
                        style={{ color: getCategoryColor(template.category) }}
                      />
                    </div>
                    <Badge
                      style={{
                        backgroundColor: getCategoryColor(template.category) + '20',
                        color: getCategoryColor(template.category),
                        borderColor: getCategoryColor(template.category) + '40',
                      }}
                    >
                      {template.category}
                    </Badge>
                  </div>

                  {/* Title & Description */}
                  <h3 className="font-semibold text-foreground mb-2 group-hover:text-primary transition-colors">
                    {template.name}
                  </h3>
                  {template.description && (
                    <p className="text-sm text-muted-foreground line-clamp-2 mb-4">
                      {template.description}
                    </p>
                  )}

                  {/* Use Button */}
                  <Button variant="outline" className="w-full mt-4 group-hover:bg-primary group-hover:text-primary-foreground group-hover:border-primary">
                    Use Template
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        {categories.map((category) => (
          <TabsContent key={category} value={category || 'uncategorized'} className="mt-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {templates
                .filter((t) => t.category === category)
                .map((template) => (
                  <Card
                    key={template.id}
                    className="hover:shadow-lg hover:border-primary transition-all cursor-pointer group"
                  >
                    <CardContent className="p-6">
                      <div className="flex items-start justify-between mb-4">
                        <div
                          className="w-12 h-12 rounded-lg flex items-center justify-center group-hover:scale-110 transition-transform"
                          style={{ backgroundColor: getCategoryColor(template.category) + '20' }}
                        >
                          <FileCode
                            className="w-6 h-6"
                            style={{ color: getCategoryColor(template.category) }}
                          />
                        </div>
                        <Badge
                          style={{
                            backgroundColor: getCategoryColor(template.category) + '20',
                            color: getCategoryColor(template.category),
                            borderColor: getCategoryColor(template.category) + '40',
                          }}
                        >
                          {template.category}
                        </Badge>
                      </div>

                      <h3 className="font-semibold text-foreground mb-2 group-hover:text-primary transition-colors">
                        {template.name}
                      </h3>
                      {template.description && (
                        <p className="text-sm text-muted-foreground line-clamp-2 mb-4">
                          {template.description}
                        </p>
                      )}

                      <Button variant="outline" className="w-full mt-4 group-hover:bg-primary group-hover:text-primary-foreground group-hover:border-primary">
                        Use Template
                      </Button>
                    </CardContent>
                  </Card>
                ))}
            </div>
          </TabsContent>
        ))}
      </Tabs>
    </div>
  )
}

