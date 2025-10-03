import Link from 'next/link'
import { Github, Twitter, Linkedin } from 'lucide-react'
import { Separator } from '@/components/ui/separator'

export function AppFooter() {
  return (
    <>
      <Separator className="mt-8" />
      <footer role="contentinfo" className="bg-card border-t py-6 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
            {/* Copyright */}
            <p className="text-sm text-gray-600">
              © 2025 My Notes App. All rights reserved.
            </p>
            
            {/* Footer Links */}
            <div className="flex items-center gap-6">
              <Link 
                href="/about" 
                className="text-sm text-gray-600 hover:text-blue-600 transition-colors duration-200"
              >
                About
              </Link>
              <Link 
                href="/privacy" 
                className="text-sm text-gray-600 hover:text-blue-600 transition-colors duration-200"
              >
                Privacy
              </Link>
              <Link 
                href="/terms" 
                className="text-sm text-gray-600 hover:text-blue-600 transition-colors duration-200"
              >
                Terms
              </Link>
              <Link 
                href="/contact" 
                className="text-sm text-gray-600 hover:text-blue-600 transition-colors duration-200"
              >
                Contact
              </Link>
            </div>
            
            {/* Social Media Icons */}
            <div className="flex items-center gap-4">
              <Link 
                href="https://twitter.com" 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-gray-500 hover:text-blue-600 transition-colors duration-200"
                aria-label="Follow us on Twitter"
              >
                <Twitter className="w-5 h-5" />
              </Link>
              <Link 
                href="https://github.com" 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-gray-500 hover:text-blue-600 transition-colors duration-200"
                aria-label="View our GitHub"
              >
                <Github className="w-5 h-5" />
              </Link>
              <Link 
                href="https://linkedin.com" 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-gray-500 hover:text-blue-600 transition-colors duration-200"
                aria-label="Connect on LinkedIn"
              >
                <Linkedin className="w-5 h-5" />
              </Link>
            </div>
          </div>
        </div>
      </footer>
    </>
  )
}

