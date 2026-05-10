import type { Metadata } from 'next'
import './globals.css'
import Nav from '@/components/nav'
import Link from 'next/link'

export const metadata: Metadata = {
  title: '9090 Homes — California Sober Living Directory',
  description:
    'Find verified, cash-pay sober living homes across California. Search by city, county, gender, and more. Find a home. Start your 90.',
  keywords: ['sober living', 'California', 'recovery housing', 'halfway house', 'addiction recovery'],
  openGraph: {
    title: '9090 Homes',
    description: 'Find a home. Start your 90.',
    siteName: '9090 Homes',
    type: 'website',
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className="bg-bg-primary text-fg-primary min-h-screen flex flex-col">
        <Nav />
        <main className="flex-1">{children}</main>
        <footer className="bg-bg-secondary border-t border-border py-8 px-6 print:hidden">
          <div className="max-w-4xl mx-auto flex flex-col sm:flex-row items-center sm:items-start justify-between gap-4 text-center sm:text-left">
            <div>
              <p className="font-semibold text-fg-primary text-sm mb-1">
                <span className="text-accent">9090</span> Homes
              </p>
              <p className="text-xs text-fg-secondary italic">Find a home. Start your 90.</p>
            </div>
            <nav className="flex flex-wrap justify-center sm:justify-end gap-x-4 gap-y-1 text-xs text-fg-secondary">
              <Link href="/about" className="hover:text-accent transition-colors">About</Link>
              <Link href="/faq" className="hover:text-accent transition-colors">FAQ</Link>
              <Link href="/for-operators" className="hover:text-accent transition-colors">For Operators</Link>
              <Link href="/resources" className="hover:text-accent transition-colors">Resources</Link>
            </nav>
          </div>
          <div className="max-w-4xl mx-auto mt-5 pt-4 border-t border-border text-center">
            <p className="text-xs text-fg-muted">
              © 2025 9090 Homes · No ads · No referral fees · Just homes.
            </p>
          </div>
        </footer>
      </body>
    </html>
  )
}
