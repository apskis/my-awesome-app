'use client'

import { useSession } from 'next-auth/react'
import { usePathname } from 'next/navigation'
import Link from 'next/link'
import { AuthButton } from '@/components/auth/auth-button'

export function Navigation() {
  const { data: session } = useSession()
  const pathname = usePathname()

  // Don't show navigation on auth pages
  const authPages = ['/login', '/register', '/forgot-password', '/reset-password']
  if (authPages.includes(pathname)) {
    return null
  }

  return (
    <nav className="bg-white dark:bg-gray-800 shadow-sm border-b border-gray-200 dark:border-gray-700">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center">
            <Link href="/" className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-sm">MA</span>
              </div>
              <span className="text-xl font-bold text-gray-900 dark:text-white">
                My Awesome App
              </span>
            </Link>
          </div>

          {session && (
            <div className="hidden md:flex items-center space-x-8">
              <Link
                href="/notes"
                className={`text-sm font-medium transition-colors ${
                  pathname === '/notes'
                    ? 'text-blue-600 dark:text-blue-400'
                    : 'text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-gray-100'
                }`}
              >
                Notes
              </Link>
              <Link
                href="/categories"
                className={`text-sm font-medium transition-colors ${
                  pathname === '/categories'
                    ? 'text-blue-600 dark:text-blue-400'
                    : 'text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-gray-100'
                }`}
              >
                Categories
              </Link>
              <Link
                href="/tags"
                className={`text-sm font-medium transition-colors ${
                  pathname === '/tags'
                    ? 'text-blue-600 dark:text-blue-400'
                    : 'text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-gray-100'
                }`}
              >
                Tags
              </Link>
            </div>
          )}

          <div className="flex items-center">
            <AuthButton />
          </div>
        </div>
      </div>
    </nav>
  )
}
