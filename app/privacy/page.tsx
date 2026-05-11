import type { Metadata } from 'next'
import { JsonLd } from '@/components/json-ld'

export const metadata: Metadata = {
  title: 'Privacy Policy',
  description: 'How Northstar Sober collects, uses, and protects your information.',
  alternates: { canonical: 'https://cashpaysober.com/privacy' },
}

export default function PrivacyPage() {
  return (
    <>
      <JsonLd
        data={{
          '@context': 'https://schema.org',
          '@type': 'WebPage',
          name: 'Privacy Policy — Northstar Sober',
          url: 'https://cashpaysober.com/privacy',
        }}
      />
      <div className="max-w-3xl mx-auto px-4 sm:px-6 py-12">
        <div className="mb-10">
          <p className="section-title mb-3">Legal</p>
          <h1 className="text-3xl font-bold text-fg-primary">Privacy Policy</h1>
          <p className="text-sm text-fg-muted mt-2">Effective May 2026</p>
        </div>

        <div className="space-y-8 text-sm text-fg-secondary leading-relaxed">
          <section>
            <h2 className="text-base font-semibold text-fg-primary mb-3">What we collect</h2>
            <p>
              We collect only what is necessary to operate the directory:
            </p>
            <ul className="mt-3 space-y-2 list-disc list-inside">
              <li>
                <strong className="text-fg-primary">Email address</strong> — when you create an operator account or submit a contact inquiry.
              </li>
              <li>
                <strong className="text-fg-primary">Listing information</strong> — name, address, phone, photos, and other details submitted by operators for their sober living listings.
              </li>
              <li>
                <strong className="text-fg-primary">Usage data</strong> — anonymized analytics via Vercel Analytics (no cookies, no fingerprinting). We do not collect IP addresses.
              </li>
            </ul>
          </section>

          <section>
            <h2 className="text-base font-semibold text-fg-primary mb-3">How we use it</h2>
            <ul className="space-y-2 list-disc list-inside">
              <li>To operate and display the sober living directory.</li>
              <li>To send transactional emails — inquiry notifications to operators and confirmations to people who reach out.</li>
              <li>To improve the service based on aggregate, anonymized usage patterns.</li>
            </ul>
          </section>

          <section>
            <h2 className="text-base font-semibold text-fg-primary mb-3">What we don&apos;t do</h2>
            <p>
              We never sell your data. We never share your information with advertisers or third-party
              marketing services. We do not track individuals across sessions or devices.
            </p>
          </section>

          <section>
            <h2 className="text-base font-semibold text-fg-primary mb-3">Analytics</h2>
            <p>
              We use Vercel Analytics, a privacy-first analytics tool that does not use cookies and does
              not store personally identifiable information. No opt-out is required because no personal
              data is collected.
            </p>
          </section>

          <section>
            <h2 className="text-base font-semibold text-fg-primary mb-3">Data retention</h2>
            <p>
              Account data is kept for as long as your account is active. If you delete your account,
              your data is removed within 30 days. Listings that have been removed from the public
              directory are deleted from our database.
            </p>
          </section>

          <section>
            <h2 className="text-base font-semibold text-fg-primary mb-3">Contact</h2>
            <p>
              Questions about this policy:{' '}
              <a
                href="mailto:privacy@cashpaysober.com"
                className="text-accent hover:text-accent-dark transition-colors"
              >
                privacy@cashpaysober.com
              </a>
            </p>
          </section>
        </div>
      </div>
    </>
  )
}
