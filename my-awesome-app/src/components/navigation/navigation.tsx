'use client'

import { usePathname } from 'next/navigation'
import Link from 'next/link'
import { 
  LayoutTemplate, 
  BookOpen, 
  Home, 
  Calendar, 
  CheckSquare, 
  FolderKanban, 
  FileText, 
  Tags, 
  Archive, 
  Palette, 
  CloudUpload, 
  Settings,
  Menu,
  type LucideIcon
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Separator } from '@/components/ui/separator'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet'

// TypeScript interfaces
interface NavigationItem {
  href: string
  label: string
  icon: LucideIcon
}

interface NavigationSection {
  title: string
  emoji: string
  items: NavigationItem[]
}

// Navigation data
const navigationSections: NavigationSection[] = [
  {
    title: 'KNOWLEDGE & REFERENCE',
    emoji: '📚',
    items: [
      { href: '/templates', label: 'Templates Gallery', icon: LayoutTemplate },
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
      { href: '/projects', label: 'Projects', icon: FolderKanban },
      { href: '/notes', label: 'Notes', icon: FileText },
      { href: '/categories', label: 'Categories', icon: Tags },
      { href: '/archive', label: 'Archive', icon: Archive },
    ],
  },
  {
    title: 'SETTINGS & UTILITIES',
    emoji: '⚙️',
    items: [
      { href: '/customization', label: 'Customization', icon: Palette },
      { href: '/backup-sync', label: 'Backup & Sync', icon: CloudUpload },
      { href: '/settings', label: 'Settings', icon: Settings },
    ],
  },
]

// Navigation content component
function NavigationContent() {
  const pathname = usePathname()

  return (
    <ScrollArea className="h-full">
      <div className="p-4 md:p-6">
        {navigationSections.map((section, sectionIndex) => (
          <div key={section.title}>
            {/* Section Header */}
            <h2 
              className={`text-xs font-bold text-primary-blue uppercase tracking-wide mb-3 ${
                sectionIndex === 0 ? 'mt-0' : 'mt-8'
              }`}
            >
              {section.emoji} {section.title}
            </h2>
            
            {/* Separator */}
            <Separator className="mb-3 bg-gray-200" />
            
            {/* Navigation Links */}
            <nav className="space-y-1">
              {section.items.map((item) => {
                const Icon = item.icon
                const isActive = pathname === item.href
                
                return (
                  <Link key={item.href} href={item.href}>
                    <Button
                      variant="ghost"
                      className={`w-full justify-start gap-3 h-auto py-2.5 px-3 text-sm font-medium transition-all duration-200 ${
                        isActive
                          ? 'bg-primary-blue/10 text-primary-blue font-semibold border-l-4 border-primary-blue pl-2'
                          : 'text-gray-700 hover:bg-accent-cyan/15 hover:text-primary-blue hover:translate-x-1'
                      }`}
                      aria-current={isActive ? 'page' : undefined}
                    >
                      <Icon 
                        className="h-[18px] w-[18px]" 
                        strokeWidth={2} 
                        aria-hidden="true" 
                      />
                      {item.label}
                    </Button>
                  </Link>
                )
              })}
            </nav>
          </div>
        ))}
      </div>
    </ScrollArea>
  )
}

// Desktop Sidebar Navigation
export function SidebarNavigation() {
  return (
    <nav 
      role="navigation" 
      id="sidebar-navigation"
      aria-label="Main navigation"
      className="w-64 md:w-72 bg-app-background border-r h-[calc(100vh-4rem)] fixed left-0 top-16 hidden lg:block overflow-y-auto"
    >
      <NavigationContent />
    </nav>
  )
}

// Mobile Hamburger Menu
export function MobileNavigation() {
  return (
    <Sheet>
      <SheetTrigger asChild>
        <Button 
          variant="ghost" 
          size="icon"
          className="lg:hidden"
          aria-label="Toggle navigation menu"
        >
          <Menu className="h-6 w-6 text-primary-blue" />
        </Button>
      </SheetTrigger>
      <SheetContent 
        side="left" 
        className="w-72 p-6 bg-app-background"
      >
        <NavigationContent />
      </SheetContent>
    </Sheet>
  )
}