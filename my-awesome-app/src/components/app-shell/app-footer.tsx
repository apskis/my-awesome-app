import Link from 'next/link'
import { Github, Twitter, Linkedin } from 'lucide-react'

export function AppFooter() {
  return (
    <footer role="contentinfo" className="h-20 bg-white border-t px-6 py-4 flex items-center justify-center">
      <p className="text-sm text-gray-600">© 2025 My Notes App. All rights reserved.</p>
    </footer>
  )
}

