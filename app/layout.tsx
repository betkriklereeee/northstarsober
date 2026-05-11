import type { Metadata } from 'next'
import './globals.css'
import Nav from '@/components/nav'
import Link from 'next/link'
import { JsonLd } from '@/components/json-ld'
import ConstructionBanner from '@/components/construction-banner'
import { Analytics } from '@vercel/analytics/next'

export const metadata: Metadata = {
  metadataBase: new URL('https://cashpaysober.com'),
  title: {
    default: 'Northstar Sober — California Sober Living Directory',
    template: '%s | Northstar Sober',
  },
  description:
    'Find verified, cash-pay sober living homes across California. Search by city, county, gender, and more. No ads, no referral fees.',
  keywords: [
    'sober living',
    'California',
    'cash pay sober living',
    'recovery housing',
    'sober living near me',
  ],
  openGraph: {
    title: 'Northstar Sober — California Sober Living Directory',
    description:
      'Find verified, cash-pay sober living homes across California. No ads, no referral fees.',
    siteName: 'Northstar Sober',
    url: 'https://cashpaysober.com',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Northstar Sober — California Sober Living Directory',
    description:
      'Find verified, cash-pay sober living homes across California. No ads, no referral fees.',
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
        <JsonLd
          data={{
            '@context': 'https://schema.org',
            '@type': 'Organization',
            name: 'Northstar Sober',
            url: 'https://cashpaysober.com',
            description: 'Verified cash-pay sober living directory for California',
            areaServed: 'California',
          }}
        />
        <Nav />
        <main className="flex-1">{children}</main>
        <footer className="bg-bg-secondary border-t border-border py-8 px-6 print:hidden">
          <div className="max-w-4xl mx-auto flex flex-col sm:flex-row items-center sm:items-start justify-between gap-4 text-center sm:text-left">
            <div>
              <p className="font-semibold text-fg-primary text-sm mb-1">
                <span className="text-accent">Northstar</span> Sober
              </p>
              <p className="text-xs text-fg-secondary italic">Find your footing. Start now.</p>
            </div>
            <nav className="flex flex-wrap justify-center sm:justify-end gap-x-4 gap-y-1 text-xs text-fg-secondary">
              <Link href="/about" className="hover:text-accent transition-colors">About</Link>
              <Link href="/faq" className="hover:text-accent transition-colors">FAQ</Link>
              <Link href="/for-operators" className="hover:text-accent transition-colors">For Operators</Link>
              <Link href="/resources" className="hover:text-accent transition-colors">Resources</Link>
              <Link href="/privacy" className="hover:text-accent transition-colors">Privacy</Link>
              <Link href="/terms" className="hover:text-accent transition-colors">Terms</Link>
            </nav>
          </div>
          <div className="max-w-4xl mx-auto mt-5 pt-4 border-t border-border text-center">
            <p className="text-xs text-fg-muted">
              © 2026 Northstar Sober · No ads · No referral fees · Just homes.
            </p>
          </div>
        </footer>
        <ConstructionBanner />
        <Analytics />
      </body>
    </html>
  )
}
