'use client'

import { useSession, signOut } from 'next-auth/react'
import { useRouter } from 'next/navigation'

export function AuthButton() {
  const { data: session, status } = useSession()
  const router = useRouter()

  if (status === 'loading') {
    return (
      <div className="flex items-center space-x-2">
        <div className="w-8 h-8 bg-gray-200 dark:bg-gray-700 rounded-full animate-pulse"></div>
        <div className="w-20 h-4 bg-gray-200 dark:bg-gray-700 rounded animate-pulse"></div>
      </div>
    )
  }

  if (session) {
    return (
      <div className="flex items-center space-x-4">
        <div className="flex items-center space-x-2">
          {session.user?.image ? (
            <img
              src={session.user.image}
              alt={session.user.name || 'User'}
              className="w-8 h-8 rounded-full"
            />
          ) : (
            <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center">
              <span className="text-white text-sm font-medium">
                {session.user?.name?.charAt(0) || session.user?.email?.charAt(0) || 'U'}
              </span>
            </div>
          )}
          <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
            {session.user?.name || session.user?.email}
          </span>
        </div>
        <button
          onClick={() => signOut({ callbackUrl: '/' })}
          className="text-sm text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-100 transition-colors"
        >
          Sign out
        </button>
      </div>
    )
  }

  return (
    <div className="flex items-center space-x-2">
      <button
        onClick={() => router.push('/login')}
        className="text-sm text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-100 transition-colors"
      >
        Sign in
      </button>
      <button
        onClick={() => router.push('/register')}
        className="bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium py-2 px-4 rounded-lg transition-colors"
      >
        Sign up
      </button>
    </div>
  )
}
