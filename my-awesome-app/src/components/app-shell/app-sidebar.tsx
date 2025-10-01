'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { 
  Home, 
  Calendar, 
  CheckSquare, 
  FolderOpen, 
  FileText, 
  Tag, 
  Archive, 
  BookOpen, 
  FileCode, 
  Palette, 
  Cloud, 
  Settings,
  ChevronLeft,
  ChevronRight
} from 'lucide-react'
import { useState } from 'react'

interface NavSection {
  title: string
  emoji: string
  items: {
    href: string
    label: string
    icon: React.ComponentType<{ className?: string }>
  }[]
}

const navSections: NavSection[] = [
  {
    title: 'KNOWLEDGE & REFERENCE',
    emoji: '📚',
    items: [
      { href: '/templates', label: 'Templates', icon: FileCode },
      { href: '/knowledge-hub', label: 'Knowledge Hub', icon: BookOpen },
    ],
  },
  {
    title: 'PRODUCTIVITY & ORGANIZATION',
    emoji: '🔎',
    items: [
      { href: '/dashboard', label: 'Dashboard', icon: Home },
      { href: '/daily-notes', label: 'Daily Notes', icon: Calendar },
      { href: '/tasks', label: 'Tasks', icon: CheckSquare },
      { href: '/projects', label: 'Projects', icon: FolderOpen },
      { href: '/notes', label: 'Notes', icon: FileText },
      { href: '/categories', label: 'Categories', icon: Tag },
      { href: '/archive', label: 'Archive', icon: Archive },
    ],
  },
  {
    title: 'SETTINGS & UTILITIES',
    emoji: '⚙️',
    items: [
      { href: '/customization', label: 'Customization', icon: Palette },
      { href: '/backup-sync', label: 'Backup & Sync', icon: Cloud },
      { href: '/settings', label: 'Settings', icon: Settings },
    ],
  },
]

export function AppSidebar() {
  const pathname = usePathname()
  const [isCollapsed, setIsCollapsed] = useState(false)

  return (
    <aside
      className={`fixed left-0 top-16 h-[calc(100vh-4rem)] bg-sidebar border-r border-sidebar-border transition-all duration-300 z-30 ${
        isCollapsed ? 'w-16' : 'w-64'
      }`}
    >
      {/* Collapse Button */}
      <button
        onClick={() => setIsCollapsed(!isCollapsed)}
        className="absolute -right-3 top-6 bg-card border border-border rounded-full p-1 hover:bg-accent transition-colors"
        aria-label={isCollapsed ? 'Expand sidebar' : 'Collapse sidebar'}
      >
        {isCollapsed ? (
          <ChevronRight className="w-4 h-4" />
        ) : (
          <ChevronLeft className="w-4 h-4" />
        )}
      </button>

      {/* Sidebar Content */}
      <div className="h-full overflow-y-auto py-6 px-3">
        {navSections.map((section, index) => (
          <div key={section.title} className={index > 0 ? 'mt-6' : ''}>
            {/* Section Header */}
            {!isCollapsed && (
              <div className="px-3 mb-2">
                <h3 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                  {section.emoji} {section.title}
                </h3>
              </div>
            )}
            {isCollapsed && (
              <div className="px-3 mb-2 text-center">
                <span className="text-lg">{section.emoji}</span>
              </div>
            )}

            {/* Section Separator */}
            <div className="h-px bg-border mb-3" />

            {/* Navigation Items */}
            <nav className="space-y-1">
              {section.items.map((item) => {
                const Icon = item.icon
                const isActive = pathname === item.href
                
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    className={`flex items-center gap-3 px-3 py-2 rounded-lg transition-colors ${
                      isActive
                        ? 'bg-primary text-primary-foreground'
                        : 'text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground'
                    } ${isCollapsed ? 'justify-center' : ''}`}
                    title={isCollapsed ? item.label : undefined}
                  >
                    <Icon className="w-5 h-5 flex-shrink-0" />
                    {!isCollapsed && (
                      <span className="text-sm font-medium">{item.label}</span>
                    )}
                  </Link>
                )
              })}
            </nav>
          </div>
        ))}
      </div>
    </aside>
  )
}

