'use client'

import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Home, ArrowLeft, FileX } from 'lucide-react'

export default function NotFound() {
  return (
    <div className="min-h-screen bg-app-background flex items-center justify-center p-4">
      <div className="max-w-md w-full text-center">
        <Card>
          <CardHeader>
            <div className="w-20 h-20 bg-primary-blue/10 rounded-full flex items-center justify-center mx-auto mb-4">
              <FileX className="w-10 h-10 text-primary-blue" />
            </div>
            <CardTitle className="text-3xl text-foreground">404 - Page Not Found</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <p className="text-muted-foreground">
              The page you're looking for doesn't exist or has been moved.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-3">
              <Link href="/dashboard">
                <Button className="flex-1 bg-primary-blue hover:bg-primary-blue/90">
                  <Home className="w-4 h-4 mr-2" />
                  Go Home
                </Button>
              </Link>
              <Button 
                variant="outline" 
                onClick={() => window.history.back()}
                className="flex-1 sm:flex-none"
              >
                <ArrowLeft className="w-4 h-4 mr-2" />
                Go Back
              </Button>
            </div>

            <div className="pt-4 border-t">
              <p className="text-sm text-muted-foreground mb-3">
                Popular pages:
              </p>
              <div className="flex flex-wrap gap-2 justify-center">
                <Link href="/notes">
                  <Button variant="ghost" size="sm" className="text-primary-blue hover:text-primary-blue/80">
                    Notes
                  </Button>
                </Link>
                <Link href="/tasks">
                  <Button variant="ghost" size="sm" className="text-primary-blue hover:text-primary-blue/80">
                    Tasks
                  </Button>
                </Link>
                <Link href="/projects">
                  <Button variant="ghost" size="sm" className="text-primary-blue hover:text-primary-blue/80">
                    Projects
                  </Button>
                </Link>
                <Link href="/settings">
                  <Button variant="ghost" size="sm" className="text-primary-blue hover:text-primary-blue/80">
                    Settings
                  </Button>
                </Link>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
