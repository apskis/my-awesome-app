'use client'

import { MobileNavigation } from '@/components/navigation/navigation'

export function AppHeader() {
  return (
    <header role="banner" className="sticky top-0 z-50 h-16 bg-white border-b shadow-sm">
      <div className="h-full px-4 md:px-6 flex items-center justify-between">
        {/* Mobile Hamburger Menu */}
        <div className="flex items-center gap-4">
          <MobileNavigation />
          {/* Logo & Brand */}
          <h1 className="text-lg md:text-xl font-bold text-primary-blue">My Notes App</h1>
        </div>

        {/* Right Side - Placeholder for future user menu */}
        <div className="flex items-center">
          {/* Placeholder for future user menu */}
        </div>
      </div>
    </header>
  )
}

