'use client'

import { AppHeader } from './app-header'
import { AppSidebar } from './sidebar'
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
    <div className="min-h-screen flex flex-col bg-slate-50">
      <AppHeader />
      
      <div className="flex flex-1">
        <AppSidebar />
        
        <main 
          role="main" 
          className="flex-1 ml-0 lg:ml-64 xl:ml-72 p-6 md:p-8 min-h-[calc(100vh-4rem-5rem)] bg-slate-50"
        >
          <div className="max-w-7xl mx-auto">
            {children}
          </div>
        </main>
      </div>

      <AppFooter />
    </div>
  )
}

