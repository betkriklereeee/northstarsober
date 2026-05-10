import type { Metadata } from 'next'
import Link from 'next/link'

export const metadata: Metadata = {
  title: 'For Operators — 9090 Homes',
  description: 'List your California sober living home for free on 9090 Homes. No referral fees, no contracts.',
}

export default function ForOperatorsPage() {
  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-12">
      {/* Hero */}
      <section className="text-center py-10 mb-12">
        <p className="section-title mb-3">For sober living operators</p>
        <h1 className="text-3xl sm:text-4xl font-bold text-fg-primary mb-4 leading-tight">
          Reach families who are actively looking.
        </h1>
        <p className="text-fg-secondary text-base max-w-xl mx-auto leading-relaxed mb-8">
          List your sober living home for free. No referral fees. No contracts.
          Just a directory that works.
        </p>
        <Link href="/operator/signup" className="btn-primary text-base px-6 py-3">
          List your home →
        </Link>
      </section>

      {/* Benefits */}
      <section className="mb-14">
        <h2 className="text-xl font-bold text-fg-primary mb-6 text-center">
          Why list on 9090 Homes
        </h2>
        <div className="grid sm:grid-cols-2 gap-4">
          {[
            {
              icon: '🎯',
              title: 'Reach the right people',
              body: 'Families and individuals searching for cash-pay sober living in California. No tire-kickers, no insurance billing inquiries.',
            },
            {
              icon: '💸',
              title: "It's completely free",
              body: 'No setup fee. No monthly fee. No commission on placements. Free now, free always.',
            },
            {
              icon: '📬',
              title: 'Direct inquiries',
              body: "Inquiries go straight to your email. No portal to log into, no leads dashboard to manage.",
            },
            {
              icon: '✓',
              title: 'Verified badge',
              body: "We review every listing. Once approved you get a Verified badge that signals legitimacy to searchers.",
            },
          ].map(({ icon, title, body }) => (
            <div key={title} className="bg-bg-card border border-border rounded-lg p-6 shadow-sm">
              <div className="text-2xl mb-3">{icon}</div>
              <h3 className="font-semibold text-fg-primary mb-2">{title}</h3>
              <p className="text-sm text-fg-secondary leading-relaxed">{body}</p>
            </div>
          ))}
        </div>
      </section>

      {/* How it works */}
      <section className="mb-14">
        <h2 className="text-xl font-bold text-fg-primary mb-6">How it works</h2>
        <div className="space-y-4">
          {[
            { n: '1', title: 'Create a free account', body: 'Sign up with your email at /operator/signup. Takes 60 seconds.' },
            { n: '2', title: 'Submit your listing', body: 'Add your home with photos, pricing, house details, and contact info. We verify the address and put it on the map.' },
            { n: '3', title: "You're live in 24 hours", body: "We review every submission before it goes live. Most approvals happen within a business day. Then you're searchable immediately." },
          ].map(({ n, title, body }) => (
            <div key={n} className="flex gap-4 items-start">
              <div className="w-8 h-8 rounded-full bg-accent text-white flex items-center justify-center text-sm font-bold shrink-0 mt-0.5">
                {n}
              </div>
              <div>
                <h3 className="font-semibold text-fg-primary mb-1">{title}</h3>
                <p className="text-sm text-fg-secondary leading-relaxed">{body}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Strong listing tips */}
      <section className="mb-14">
        <h2 className="text-xl font-bold text-fg-primary mb-2">What makes a strong listing</h2>
        <p className="text-sm text-fg-secondary mb-5">Listings with these elements get more inquiries.</p>
        <div className="bg-bg-secondary border border-border rounded-lg divide-y divide-border">
          {[
            'Photos of the exterior and common areas — even a few go a long way',
            'An honest description of the house culture and what residents can expect',
            'Clear pricing and bed count',
            'Fast responses to inquiries — aim for under 24 hours',
          ].map((tip, i) => (
            <div key={i} className="flex items-start gap-3 px-5 py-3.5">
              <svg className="w-4 h-4 text-accent mt-0.5 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
              <p className="text-sm text-fg-secondary">{tip}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Quick FAQ */}
      <section className="mb-14">
        <h2 className="text-xl font-bold text-fg-primary mb-5">Quick answers</h2>
        <div className="space-y-4">
          {[
            { q: 'Is it really free?', a: 'Yes, always.' },
            { q: 'How long does approval take?', a: 'Usually under 24 hours.' },
            { q: 'Can I list more than one home?', a: 'Yes, your account can manage multiple listings.' },
            { q: 'What if I need to update my listing?', a: 'Edit anytime from your dashboard. No re-approval needed for minor edits.' },
          ].map(({ q, a }) => (
            <div key={q} className="flex gap-4 text-sm">
              <span className="font-medium text-fg-primary min-w-fit">{q}</span>
              <span className="text-fg-secondary">{a}</span>
            </div>
          ))}
        </div>
      </section>

      {/* Final CTA */}
      <section className="bg-accent-faint border border-accent/20 rounded-xl p-8 text-center">
        <h2 className="text-xl font-bold text-fg-primary mb-3">Ready to list?</h2>
        <p className="text-sm text-fg-secondary mb-6">
          Join the directory for free. Your listing could be live by tomorrow.
        </p>
        <Link href="/operator/signup" className="btn-primary text-sm px-6 py-2.5">
          Create your free account →
        </Link>
      </section>
    </div>
  )
}
