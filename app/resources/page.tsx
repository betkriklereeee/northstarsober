import type { Metadata } from 'next'
import Link from 'next/link'

export const metadata: Metadata = {
  title: 'Resources',
  description: 'Meetings, crisis support, treatment options, and California behavioral health resources.',
}

function ExternalLink({ href, children }: { href: string; children: React.ReactNode }) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className="text-accent hover:text-accent-dark transition-colors underline-offset-2 hover:underline"
    >
      {children}
    </a>
  )
}

export default function ResourcesPage() {
  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 py-12 space-y-14">
      <div>
        <p className="section-title mb-3">Resources</p>
        <h1 className="text-3xl font-bold text-fg-primary">Helpful links & contacts.</h1>
        <p className="text-fg-secondary mt-3 text-sm leading-relaxed">
          Tools for finding support, understanding your options, and connecting with the recovery community in California.
        </p>
      </div>

      {/* Meetings */}
      <section>
        <h2 className="text-lg font-bold text-fg-primary mb-4">Find meetings</h2>
        <div className="grid sm:grid-cols-2 gap-4">
          {[
            {
              name: 'Alcoholics Anonymous',
              url: 'https://www.aa.org',
              description: 'The original 12-step program. Meeting finder covers every zip code in California.',
              cta: 'Find a meeting →',
            },
            {
              name: 'Narcotics Anonymous',
              url: 'https://www.na.org',
              description: 'Peer support for people with drug addiction. Meetings across California daily.',
              cta: 'Find a meeting →',
            },
          ].map(({ name, url, description, cta }) => (
            <div key={name} className="bg-bg-card border border-border rounded-lg p-5 shadow-sm">
              <h3 className="font-semibold text-fg-primary mb-1">{name}</h3>
              <p className="text-xs text-fg-secondary mb-3 leading-relaxed">{description}</p>
              <ExternalLink href={url}>{cta}</ExternalLink>
            </div>
          ))}
        </div>
      </section>

      {/* Crisis support */}
      <section>
        <h2 className="text-lg font-bold text-fg-primary mb-4">Crisis support</h2>
        <div className="bg-accent-faint border-l-4 border-accent rounded-lg p-6 space-y-4">
          <div>
            <p className="font-semibold text-fg-primary text-sm">SAMHSA National Helpline</p>
            <p className="text-2xl font-bold text-accent mt-0.5">1-800-662-4357</p>
            <p className="text-xs text-fg-secondary mt-1">
              Free, confidential, 24/7. Treatment referral and information for individuals and families
              facing mental health and substance use disorders.
            </p>
          </div>
          <div className="border-t border-accent/20 pt-4">
            <p className="font-semibold text-fg-primary text-sm">Crisis Text Line</p>
            <p className="text-xl font-bold text-accent mt-0.5">Text HOME to 741741</p>
            <p className="text-xs text-fg-secondary mt-1">
              Free 24/7 crisis counseling via text message. Available in English and Spanish.
            </p>
          </div>
        </div>
      </section>

      {/* Continuum of care */}
      <section>
        <h2 className="text-lg font-bold text-fg-primary mb-2">Understanding your options</h2>
        <p className="text-sm text-fg-secondary mb-5">
          Recovery housing fits into a continuum of care. Here's how the pieces fit together.
        </p>
        <div className="grid sm:grid-cols-3 gap-4">
          {[
            {
              title: 'Detox',
              sub: 'Medical stabilization',
              body: 'Safely manages withdrawal from substances under medical supervision. Usually 3–7 days. The starting point when physical dependence is present.',
            },
            {
              title: 'Residential Treatment',
              sub: 'Clinical programming',
              body: 'Provides therapy, counseling, and structured programming in a residential setting. Typically 30–90 days. Addresses the roots of addiction.',
            },
            {
              title: 'Sober Living',
              sub: 'Recovery housing',
              body: 'A structured, accountable home to live in while rebuilding your life. No clinical programming — just community, accountability, and real-world practice.',
            },
          ].map(({ title, sub, body }, i) => (
            <div key={title} className="bg-bg-card border border-border rounded-lg p-5 shadow-sm relative">
              {i < 2 && (
                <div className="hidden sm:block absolute -right-2 top-1/2 -translate-y-1/2 z-10 w-4 h-4 bg-bg-secondary border border-border rounded-full flex items-center justify-center">
                  <svg className="w-2.5 h-2.5 text-fg-muted" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M9 5l7 7-7 7" />
                  </svg>
                </div>
              )}
              <p className="text-xs text-accent font-medium uppercase tracking-wider mb-1">{sub}</p>
              <h3 className="font-bold text-fg-primary mb-2">{title}</h3>
              <p className="text-xs text-fg-secondary leading-relaxed">{body}</p>
            </div>
          ))}
        </div>
      </section>

      {/* For families */}
      <section>
        <h2 className="text-lg font-bold text-fg-primary mb-4">For families</h2>
        <div className="grid sm:grid-cols-2 gap-4">
          {[
            {
              name: 'Al-Anon',
              url: 'https://al-anon.org',
              description: 'Support for families and friends of people with a drinking problem. Meetings worldwide.',
            },
            {
              name: 'Nar-Anon',
              url: 'https://www.nar-anon.org',
              description: 'Support for families and friends affected by a loved one\'s addiction to drugs.',
            },
          ].map(({ name, url, description }) => (
            <div key={name} className="bg-bg-card border border-border rounded-lg p-5 shadow-sm">
              <h3 className="font-semibold text-fg-primary mb-1">{name}</h3>
              <p className="text-xs text-fg-secondary mb-3 leading-relaxed">{description}</p>
              <ExternalLink href={url}>Visit {name} →</ExternalLink>
            </div>
          ))}
        </div>
      </section>

      {/* California resources */}
      <section>
        <h2 className="text-lg font-bold text-fg-primary mb-4">California resources</h2>
        <div className="bg-bg-card border border-border rounded-lg shadow-sm divide-y divide-border">
          {[
            {
              name: 'CA Dept of Health Care Services',
              url: 'https://www.dhcs.ca.gov',
              description: 'State licensing database and treatment facility finder for California.',
            },
            {
              name: 'LA County Behavioral Health',
              url: 'https://dmh.lacounty.gov',
              description: 'Los Angeles County mental health and substance use services.',
            },
            {
              name: 'OC Health Care Agency',
              url: 'https://ochealthinfo.com',
              description: 'Orange County behavioral health resources and crisis services.',
            },
            {
              name: 'San Diego County Behavioral Health',
              url: 'https://www.sandiegocounty.gov/hhsa/programs/bhs',
              description: 'San Diego County substance use and mental health services.',
            },
            {
              name: 'SF Dept of Public Health',
              url: 'https://www.sfdph.org',
              description: 'San Francisco substance use treatment and harm reduction programs.',
            },
            {
              name: 'Sacramento County Behavioral Health',
              url: 'https://www.dhhs.saccounty.gov/BHS',
              description: 'Sacramento County mental health and substance use disorder services.',
            },
          ].map(({ name, url, description }) => (
            <div key={name} className="px-5 py-4 flex items-start justify-between gap-4">
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-fg-primary">{name}</p>
                <p className="text-xs text-fg-secondary mt-0.5">{description}</p>
              </div>
              <ExternalLink href={url}>
                <span className="text-xs shrink-0">Visit →</span>
              </ExternalLink>
            </div>
          ))}
        </div>
      </section>

      {/* Back CTA */}
      <div className="text-center pt-4">
        <Link href="/" className="btn-secondary text-sm">
          ← Back to directory
        </Link>
      </div>
    </div>
  )
}
