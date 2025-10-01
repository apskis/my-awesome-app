'use client'

import { AppHeader } from './app-header'
import { AppSidebar } from './app-sidebar'
import { AppFooter } from './app-footer'
import { usePathname } from 'next/navigation'

interface AppLayoutProps {
  children: React.ReactNode
}

export function AppLayout({ children }: AppLayoutProps) {
  const pathname = usePathname()
  
  // Pages where we don't want the app shell (auth pages)
  const noShellPages = ['/login', '/register', '/forgot-password', '/reset-password']
  const showShell = !noShellPages.includes(pathname) && pathname !== '/'

  if (!showShell) {
    return <>{children}</>
  }

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <AppHeader />
      
      <div className="flex flex-1 pt-16">
        <AppSidebar />
        
        <main className="flex-1 ml-64 transition-all duration-300">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
            {children}
          </div>
        </main>
      </div>

      <div className="ml-64 transition-all duration-300">
        <AppFooter />
      </div>
    </div>
  )
}

