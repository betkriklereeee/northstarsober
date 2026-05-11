import type { Metadata } from 'next'
import Link from 'next/link'
import { JsonLd } from '@/components/json-ld'

export const metadata: Metadata = {
  title: 'About',
  description: 'Why we built Northstar Sober — a no-ads, no-referral-fee sober living directory for California.',
}

export default function AboutPage() {
  return (
    <>
      <JsonLd
        data={{
          '@context': 'https://schema.org',
          '@type': 'AboutPage',
          name: 'About Northstar Sober',
          url: 'https://cashpaysober.com/about',
        }}
      />

      {/* Hero */}
      <div className="bg-bg-card border-b border-border px-6 py-16 text-center">
        <p className="text-xs font-medium tracking-widest text-accent uppercase mb-3">
          Our story
        </p>
        <h1 className="text-3xl sm:text-4xl font-bold text-fg-primary leading-tight mb-4">
          Built for the search no one wants to be doing.
        </h1>
        <p className="text-fg-secondary text-sm max-w-xl mx-auto leading-relaxed">
          A no-ads, no-referral-fee sober living directory for California.
        </p>
      </div>

      <div className="max-w-3xl mx-auto px-4 sm:px-6 py-12">
        {/* Story */}
        <section className="mb-12">
          <div className="border-l-4 border-accent pl-6 space-y-5">
            <p className="text-fg-secondary leading-relaxed">
              Northstar Sober was built out of frustration. Finding a sober living home shouldn't require calling
              40 numbers, half of which are disconnected, or navigating sites that are really just lead-gen
              operations dressed up as directories. Families in crisis deserve better. People trying to get
              their lives together deserve better.
            </p>
            <p className="text-fg-secondary leading-relaxed">
              We built Northstar Sober to be the directory we wished existed: cash-pay only, no referral fees,
              no ads, no pay-to-rank. Every listing is reviewed before it goes live. Operators list for free.
              Searchers search for free. Nobody is selling your information.
            </p>
            <p className="text-fg-secondary leading-relaxed">
              A north star is what you navigate by when everything else is uncertain. That&rsquo;s what we&rsquo;re
              here for — a fixed point to orient toward when you&rsquo;re trying to find your footing.
            </p>
          </div>
        </section>

        {/* What makes us different */}
        <section className="mb-12">
          <h2 className="text-xl font-bold text-fg-primary mb-6">What makes us different</h2>
          <div className="grid sm:grid-cols-3 gap-4">
            {[
              {
                title: 'No ads or referral fees',
                body: "We don't take money from operators to rank their listings higher. What you see is what's there.",
              },
              {
                title: 'Every listing reviewed',
                body: "We manually review every submission before it goes live. Fake listings and lead-gen traps don't make it through.",
              },
              {
                title: 'Free for everyone',
                body: 'Free to search. Free to list. No contracts, no monthly fees, no upsells.',
              },
            ].map(({ title, body }) => (
              <div
                key={title}
                className="bg-bg-card border border-border rounded-lg p-5 shadow-sm"
              >
                <div className="w-8 h-8 rounded-full bg-accent-faint flex items-center justify-center mb-3">
                  <svg className="w-4 h-4 text-accent" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                </div>
                <h3 className="font-semibold text-fg-primary mb-2 text-sm">{title}</h3>
                <p className="text-xs text-fg-secondary leading-relaxed">{body}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Note from the team */}
        <section className="mb-12">
          <h2 className="text-xl font-bold text-fg-primary mb-4">A note from the team</h2>
          <div className="bg-bg-secondary border border-border rounded-lg p-6">
            <p className="text-fg-secondary leading-relaxed text-sm">
              We&rsquo;re a small team. We don&rsquo;t have investors or a growth deck. We have a directory and a
              belief that people in recovery deserve access to honest information. If you run a sober
              living home and want to list, it&rsquo;s free and always will be.
            </p>
          </div>
        </section>

        {/* CTA */}
        <section>
          <div className="flex flex-wrap gap-3">
            <Link href="/" className="btn-primary">
              Search homes
            </Link>
            <Link href="/operator/signup" className="btn-secondary">
              List your home
            </Link>
          </div>
        </section>
      </div>
    </>
  )
}
