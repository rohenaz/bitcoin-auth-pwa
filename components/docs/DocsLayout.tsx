import type { ReactNode } from 'react';
import Link from 'next/link';
import { Badge } from 'lucide-react';

interface DocsLayoutProps {
  children: ReactNode;
}

export function DocsLayout({ children }: DocsLayoutProps) {
  return (
    <div className="min-h-screen bg-white dark:bg-black text-black dark:text-white">
      {/* Header */}
      <header className="border-b border-gray-200 dark:border-gray-800 sticky top-0 bg-white/95 dark:bg-black/95 backdrop-blur-sm z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-8">
              <Link href="/docs" className="text-xl font-bold text-orange-600">
                Bitcoin Auth PWA Docs
              </Link>
              <nav className="hidden sm:flex space-x-6">
                <Link href="/" className="text-gray-600 dark:text-gray-400 hover:text-black dark:hover:text-white transition-colors">
                  Home
                </Link>
                <Link href="/quickstart" className="text-gray-600 dark:text-gray-400 hover:text-black dark:hover:text-white transition-colors">
                  Quick Start
                </Link>
                <Link href="/themes" className="text-gray-600 dark:text-gray-400 hover:text-black dark:hover:text-white transition-colors">
                  Themes
                </Link>
                <Link href="/components" className="text-gray-600 dark:text-gray-400 hover:text-black dark:hover:text-white transition-colors">
                  Components
                </Link>
              </nav>
            </div>
          </div>
        </div>
      </header>

      <div className="flex">
        {/* Sidebar */}
        <aside className="w-64 border-r border-gray-200 dark:border-gray-800 h-[calc(100vh-4rem)] sticky top-16 overflow-y-auto">
          <div className="p-6">
            <div className="bg-gradient-to-r from-orange-500 to-orange-600 rounded-lg p-4 text-white mb-6">
              <p className="text-sm font-medium">📚 Documentation</p>
              <p className="text-xs opacity-90">Bitcoin authentication made simple</p>
            </div>

            <nav className="space-y-2">
              <Link href="/docs" className="block px-3 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-md">
                Introduction
              </Link>
              <Link href="/docs/authentication" className="block px-3 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-md">
                Authentication
              </Link>
              <Link href="/docs/profiles" className="block px-3 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-md">
                Profile Management
              </Link>
              <div className="mt-4">
                <p className="px-3 py-1 text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  Integration
                </p>
                <Link href="/docs/llms-integration" className="block px-3 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-md flex items-center gap-2">
                  LLMs.txt
                  <span className="bg-green-100 text-green-800 text-xs px-2 py-1 rounded-full">New</span>
                </Link>
              </div>
            </nav>
          </div>
        </aside>

        {/* Main Content */}
        <main className="flex-1 max-w-4xl mx-auto px-6 py-8">
          <article className="prose prose-gray dark:prose-invert max-w-none">
            {children}
          </article>
        </main>
      </div>
    </div>
  );
}