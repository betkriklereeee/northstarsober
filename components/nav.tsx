'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useState, useEffect } from 'react'
import { createClient } from '@/lib/supabase/client'
import type { User } from '@supabase/supabase-js'

export default function Nav() {
  const pathname = usePathname()
  const [user, setUser] = useState<User | null>(null)
  const [menuOpen, setMenuOpen] = useState(false)
  const supabase = createClient()

  useEffect(() => {
    supabase.auth.getUser().then(({ data }) => setUser(data.user))
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_, session) => {
      setUser(session?.user ?? null)
    })
    return () => subscription.unsubscribe()
  }, [])

  const isHome = pathname === '/'

  async function signOut() {
    await supabase.auth.signOut()
    window.location.href = '/'
  }

  return (
    <header className="sticky top-0 z-50 border-b border-border bg-bg-primary/90 backdrop-blur-sm">
      <div className="max-w-8xl mx-auto px-4 sm:px-6 h-14 flex items-center justify-between gap-4">
        <Link
          href="/"
          className="flex items-center gap-2.5 shrink-0"
          aria-label="9090 Homes"
        >
          <span className="text-sage font-bold text-lg tracking-tight">9090</span>
          <span className="text-fg-primary font-medium text-sm hidden sm:inline">Homes</span>
        </Link>

        <nav className="hidden md:flex items-center gap-1">
          <Link
            href="/"
            className={`btn-ghost ${pathname === '/' ? 'text-fg-primary' : ''}`}
          >
            Directory
          </Link>
          <Link
            href="/#how-it-works"
            className="btn-ghost"
          >
            How it works
          </Link>
          {user ? (
            <>
              <Link href="/operator/dashboard" className="btn-ghost">
                Dashboard
              </Link>
              <button onClick={signOut} className="btn-ghost">
                Sign out
              </button>
            </>
          ) : (
            <>
              <Link href="/operator/login" className="btn-ghost">
                Sign in
              </Link>
              <Link href="/operator/signup" className="btn-primary text-sm ml-1">
                List your home
              </Link>
            </>
          )}
        </nav>

        {/* Mobile menu button */}
        <button
          className="md:hidden p-2 text-fg-secondary hover:text-fg-primary"
          onClick={() => setMenuOpen(!menuOpen)}
          aria-label="Toggle menu"
        >
          <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            {menuOpen ? (
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            ) : (
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            )}
          </svg>
        </button>
      </div>

      {/* Mobile menu */}
      {menuOpen && (
        <div className="md:hidden border-t border-border bg-bg-secondary px-4 py-3 space-y-1">
          <Link href="/" className="block py-2 text-sm text-fg-primary" onClick={() => setMenuOpen(false)}>
            Directory
          </Link>
          {user ? (
            <>
              <Link href="/operator/dashboard" className="block py-2 text-sm text-fg-primary" onClick={() => setMenuOpen(false)}>
                Dashboard
              </Link>
              <button onClick={signOut} className="block w-full text-left py-2 text-sm text-fg-secondary">
                Sign out
              </button>
            </>
          ) : (
            <>
              <Link href="/operator/login" className="block py-2 text-sm text-fg-primary" onClick={() => setMenuOpen(false)}>
                Sign in
              </Link>
              <Link href="/operator/signup" className="block py-2 text-sm text-sage font-medium" onClick={() => setMenuOpen(false)}>
                List your home
              </Link>
            </>
          )}
        </div>
      )}
    </header>
  )
}
