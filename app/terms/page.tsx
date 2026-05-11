import type { Metadata } from 'next'
import { JsonLd } from '@/components/json-ld'

export const metadata: Metadata = {
  title: 'Terms of Service',
  description: 'Terms of service for Northstar Sober — the California sober living directory.',
  alternates: { canonical: 'https://cashpaysober.com/terms' },
}

export default function TermsPage() {
  return (
    <>
      <JsonLd
        data={{
          '@context': 'https://schema.org',
          '@type': 'WebPage',
          name: 'Terms of Service — Northstar Sober',
          url: 'https://cashpaysober.com/terms',
        }}
      />
      <div className="max-w-3xl mx-auto px-4 sm:px-6 py-12">
        <div className="mb-10">
          <p className="section-title mb-3">Legal</p>
          <h1 className="text-3xl font-bold text-fg-primary">Terms of Service</h1>
          <p className="text-sm text-fg-muted mt-2">Effective May 2026</p>
        </div>

        <div className="space-y-8 text-sm text-fg-secondary leading-relaxed">
          <section>
            <h2 className="text-base font-semibold text-fg-primary mb-3">Service description</h2>
            <p>
              Northstar Sober is a free, publicly searchable directory of sober living homes in California.
              We do not guarantee the accuracy, completeness, or current availability of any listing.
              Listings are provided for informational purposes only.
            </p>
          </section>

          <section>
            <h2 className="text-base font-semibold text-fg-primary mb-3">Operator responsibilities</h2>
            <p>By submitting a listing, you agree to:</p>
            <ul className="mt-3 space-y-2 list-disc list-inside">
              <li>Provide accurate and up-to-date information about your home.</li>
              <li>Respond promptly to inquiries sent through the directory.</li>
              <li>Operate your home in compliance with all applicable local, state, and federal laws.</li>
              <li>Notify us if your home closes or information changes significantly.</li>
            </ul>
          </section>

          <section>
            <h2 className="text-base font-semibold text-fg-primary mb-3">Not a referral service</h2>
            <p>
              Northstar Sober is a directory only. We do not recommend, endorse, or refer users to
              specific homes. We do not provide clinical, medical, or addiction treatment advice. Please
              consult a qualified professional for clinical guidance.
            </p>
          </section>

          <section>
            <h2 className="text-base font-semibold text-fg-primary mb-3">No warranties on listings</h2>
            <p>
              We manually review every listing before it goes live, but we cannot guarantee the accuracy
              of every listing at all times. Conditions at homes change. Always call and visit before
              committing. Northstar Sober is not liable for any harm resulting from reliance on directory
              information.
            </p>
          </section>

          <section>
            <h2 className="text-base font-semibold text-fg-primary mb-3">Limitation of liability</h2>
            <p>
              To the fullest extent permitted by law, Northstar Sober and its operators shall not be
              liable for any indirect, incidental, special, or consequential damages arising from use of
              the directory or reliance on any listing.
            </p>
          </section>

          <section>
            <h2 className="text-base font-semibold text-fg-primary mb-3">Changes to these terms</h2>
            <p>
              We may update these terms from time to time. Continued use of the directory after changes
              are posted constitutes acceptance of the updated terms. Material changes will be noted at
              the top of this page.
            </p>
          </section>

          <section>
            <h2 className="text-base font-semibold text-fg-primary mb-3">Contact</h2>
            <p>
              Questions about these terms:{' '}
              <a
                href="mailto:legal@cashpaysober.com"
                className="text-accent hover:text-accent-dark transition-colors"
              >
                legal@cashpaysober.com
              </a>
            </p>
          </section>
        </div>
      </div>
    </>
  )
}
