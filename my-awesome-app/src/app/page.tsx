'use client'

import { useSession } from 'next-auth/react'
import Link from 'next/link'

export default function Home() {
  const { data: session, status } = useSession()

  if (status === 'loading') {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800 flex items-center justify-center p-4">
        <div className="max-w-md w-full bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-8 text-center">
          <div className="animate-pulse">
            <div className="w-16 h-16 bg-gray-200 dark:bg-gray-700 rounded-full mx-auto mb-4"></div>
            <div className="h-8 bg-gray-200 dark:bg-gray-700 rounded mb-2"></div>
            <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded"></div>
          </div>
        </div>
      </div>
    )
  }

  if (session) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800 flex items-center justify-center p-4">
        <div className="max-w-2xl w-full bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-8 text-center">
          <div className="mb-6">
            <div className="w-16 h-16 bg-green-500 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg 
                className="w-8 h-8 text-white" 
                fill="none" 
                stroke="currentColor" 
                viewBox="0 0 24 24"
              >
                <path 
                  strokeLinecap="round" 
                  strokeLinejoin="round" 
                  strokeWidth={2} 
                  d="M5 13l4 4L19 7" 
                />
              </svg>
            </div>
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
              Welcome back, {session.user?.name || session.user?.email}!
            </h1>
            <p className="text-gray-600 dark:text-gray-300">
              Your notes app is ready to use.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
            <Link
              href="/notes"
              className="p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg hover:bg-blue-100 dark:hover:bg-blue-900/30 transition-colors"
            >
              <div className="w-8 h-8 bg-blue-500 rounded-lg flex items-center justify-center mx-auto mb-2">
                <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
              </div>
              <h3 className="font-medium text-gray-900 dark:text-white">Notes</h3>
              <p className="text-sm text-gray-600 dark:text-gray-400">Create and manage your notes</p>
            </Link>

            <Link
              href="/categories"
              className="p-4 bg-green-50 dark:bg-green-900/20 rounded-lg hover:bg-green-100 dark:hover:bg-green-900/30 transition-colors"
            >
              <div className="w-8 h-8 bg-green-500 rounded-lg flex items-center justify-center mx-auto mb-2">
                <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" />
                </svg>
              </div>
              <h3 className="font-medium text-gray-900 dark:text-white">Categories</h3>
              <p className="text-sm text-gray-600 dark:text-gray-400">Organize your notes</p>
            </Link>

            <Link
              href="/tags"
              className="p-4 bg-purple-50 dark:bg-purple-900/20 rounded-lg hover:bg-purple-100 dark:hover:bg-purple-900/30 transition-colors"
            >
              <div className="w-8 h-8 bg-purple-500 rounded-lg flex items-center justify-center mx-auto mb-2">
                <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" />
                </svg>
              </div>
              <h3 className="font-medium text-gray-900 dark:text-white">Tags</h3>
              <p className="text-sm text-gray-600 dark:text-gray-400">Label and find notes</p>
            </Link>
          </div>
          
          <div className="space-y-3">
            <div className="flex items-center justify-center space-x-2 text-sm text-gray-500 dark:text-gray-400">
              <div className="w-2 h-2 bg-green-500 rounded-full"></div>
              <span>NextAuth.js</span>
            </div>
            <div className="flex items-center justify-center space-x-2 text-sm text-gray-500 dark:text-gray-400">
              <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
              <span>Prisma Database</span>
            </div>
            <div className="flex items-center justify-center space-x-2 text-sm text-gray-500 dark:text-gray-400">
              <div className="w-2 h-2 bg-purple-500 rounded-full"></div>
              <span>Tailwind CSS</span>
            </div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800 flex items-center justify-center p-4">
      <div className="max-w-md w-full bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-8 text-center">
        <div className="mb-6">
          <div className="w-16 h-16 bg-blue-500 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg 
              className="w-8 h-8 text-white" 
              fill="none" 
              stroke="currentColor" 
              viewBox="0 0 24 24"
            >
              <path 
                strokeLinecap="round" 
                strokeLinejoin="round" 
                strokeWidth={2} 
                d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" 
              />
            </svg>
          </div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
            Welcome to My Awesome App
          </h1>
          <p className="text-gray-600 dark:text-gray-300">
            A secure notes application with authentication.
          </p>
        </div>
        
        <div className="space-y-4">
          <Link
            href="/login"
            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-3 px-4 rounded-lg transition-colors block"
          >
            Sign In
          </Link>
          <Link
            href="/register"
            className="w-full border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 font-medium py-3 px-4 rounded-lg transition-colors block"
          >
            Create Account
          </Link>
        </div>
        
        <div className="mt-8 pt-6 border-t border-gray-200 dark:border-gray-700">
          <p className="text-xs text-gray-400 dark:text-gray-500">
            Secure • Fast • Reliable 🚀
          </p>
        </div>
      </div>
    </div>
  )
}
