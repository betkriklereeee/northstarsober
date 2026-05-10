'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useState, useEffect } from 'react'
import { createClient } from '@/lib/supabase/client'
import type { User } from '@supabase/supabase-js'

const NAV_LINKS = [
  { href: '/', label: 'Directory' },
  { href: '/about', label: 'About' },
  { href: '/faq', label: 'FAQ' },
  { href: '/resources', label: 'Resources' },
  { href: '/for-operators', label: 'For operators' },
]

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

  async function signOut() {
    await supabase.auth.signOut()
    window.location.href = '/'
  }

  return (
    <header className="sticky top-0 z-50 border-b border-border bg-bg-card shadow-sm print:hidden">
      <div className="max-w-8xl mx-auto px-4 sm:px-6 h-14 flex items-center justify-between gap-4">
        <Link
          href="/"
          className="flex items-center gap-2.5 shrink-0"
          aria-label="9090 Homes"
        >
          <span className="text-accent font-bold text-lg tracking-tight">9090</span>
          <span className="text-fg-primary font-medium text-sm hidden sm:inline">Homes</span>
        </Link>

        <nav className="hidden md:flex items-center gap-0.5">
          {NAV_LINKS.map(({ href, label }) => (
            <Link
              key={href}
              href={href}
              className={`btn-ghost text-sm ${
                pathname === href
                  ? 'text-accent font-medium bg-accent-faint'
                  : 'text-fg-secondary'
              }`}
            >
              {label}
            </Link>
          ))}
        </nav>

        <div className="hidden md:flex items-center gap-1.5">
          {user ? (
            <>
              <Link href="/operator/dashboard" className="btn-ghost text-sm">
                Dashboard
              </Link>
              <button onClick={signOut} className="btn-ghost text-sm">
                Sign out
              </button>
            </>
          ) : (
            <>
              <Link href="/operator/login" className="btn-ghost text-sm">
                Sign in
              </Link>
              <Link href="/operator/signup" className="btn-primary text-sm">
                List your home
              </Link>
            </>
          )}
        </div>

        {/* Mobile menu button */}
        <button
          className="md:hidden p-2 text-fg-secondary hover:text-fg-primary rounded hover:bg-bg-secondary"
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
        <div className="md:hidden border-t border-border bg-bg-card px-4 py-3 space-y-0.5">
          {NAV_LINKS.map(({ href, label }) => (
            <Link
              key={href}
              href={href}
              className={`block py-2 px-2 rounded text-sm transition-colors ${
                pathname === href
                  ? 'text-accent font-medium bg-accent-faint'
                  : 'text-fg-primary hover:bg-bg-secondary'
              }`}
              onClick={() => setMenuOpen(false)}
            >
              {label}
            </Link>
          ))}
          <div className="pt-2 border-t border-border mt-2">
            {user ? (
              <>
                <Link
                  href="/operator/dashboard"
                  className="block py-2 px-2 rounded text-sm text-fg-primary hover:bg-bg-secondary"
                  onClick={() => setMenuOpen(false)}
                >
                  Dashboard
                </Link>
                <button
                  onClick={signOut}
                  className="block w-full text-left py-2 px-2 rounded text-sm text-fg-secondary hover:bg-bg-secondary"
                >
                  Sign out
                </button>
              </>
            ) : (
              <>
                <Link
                  href="/operator/login"
                  className="block py-2 px-2 rounded text-sm text-fg-primary hover:bg-bg-secondary"
                  onClick={() => setMenuOpen(false)}
                >
                  Sign in
                </Link>
                <Link
                  href="/operator/signup"
                  className="block py-2 px-2 rounded text-sm text-accent font-medium hover:bg-accent-faint"
                  onClick={() => setMenuOpen(false)}
                >
                  List your home →
                </Link>
              </>
            )}
          </div>
        </div>
      )}
    </header>
  )
}
