import type { Metadata } from 'next'
import './globals.css'
import Nav from '@/components/nav'

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
      <body className="bg-bg-primary text-fg-primary min-h-screen">
        <Nav />
        <main>{children}</main>
      </body>
    </html>
  )
}
