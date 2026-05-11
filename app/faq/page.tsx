'use client'

import { useState } from 'react'
import Link from 'next/link'
import { JsonLd } from '@/components/json-ld'

interface FAQItem {
  q: string
  a: string
}

const FOR_SEARCHERS: FAQItem[] = [
  {
    q: 'What is sober living?',
    a: "Sober living homes are residential houses where people in recovery live together and support each other's sobriety. They're not treatment centers — there's no clinical programming. Think of them as a structured, accountable place to live while you rebuild your life. Most have house rules around curfews, meetings, and drug testing.",
  },
  {
    q: 'How is sober living different from rehab or detox?',
    a: "Detox is medical — it's about safely getting substances out of your system. Rehab (residential treatment) provides clinical care and therapy, usually 30–90 days. Sober living comes after: it's where you practice living sober in the real world, with support around you, before going back to fully independent living.",
  },
  {
    q: 'What does cash-pay mean?',
    a: "Cash-pay means the home doesn't bill insurance or require enrollment in a clinical program. You pay rent directly, like any other housing. This gives you more flexibility — you're not locked into a program, and you can leave when you're ready.",
  },
  {
    q: 'What is MAT and why does it matter?',
    a: 'MAT stands for Medication-Assisted Treatment — medications like Suboxone, Vivitrol, or methadone used to treat opioid or alcohol use disorder. Not all sober living homes accept residents on MAT. We tag homes that are MAT-friendly so you can filter for them.',
  },
  {
    q: 'How do I know a listing is legitimate?',
    a: "Every listing on Northstar Sober is reviewed by our team before it goes live. We verify that homes exist and are operating. We also show a Verified badge on listings we've confirmed directly with the operator. That said, always call before you commit — and trust your gut.",
  },
  {
    q: 'What should I look for in a sober living home?',
    a: "Ask about house rules, curfews, meeting requirements, and drug testing. Find out who manages the house and whether there's a house manager on-site. Ask to see the space before moving in. A good sober living home will welcome those questions. A bad one won't.",
  },
  {
    q: "What if I can't afford the listed rent?",
    a: "Some operators have sliding scale options that aren't listed publicly — it's always worth asking. You can also look into county behavioral health resources and Oxford House (oxford-house.org), which operates democratically-run, self-supporting homes at lower cost.",
  },
  {
    q: 'How do I get a call back from an operator?',
    a: "Use the contact form on the listing and also call directly if a phone number is listed. Call during business hours. If you don't hear back within 24–48 hours, try another home — responsiveness is a good signal of how well-run the house is.",
  },
]

const FOR_OPERATORS: FAQItem[] = [
  {
    q: 'Is it really free to list?',
    a: "Yes. Free to create an account, free to list, free forever. We don't charge operators and we don't take referral fees. If that ever changes we'll give plenty of notice.",
  },
  {
    q: 'How does the approval process work?',
    a: "After you submit a listing it goes into a review queue. We typically review within 24 hours. We may reach out if we have questions. Once approved your listing goes live and is searchable immediately.",
  },
  {
    q: "Can I edit my listing after it's approved?",
    a: 'Yes. Log into your dashboard anytime to update photos, pricing, contact info, or house details. Changes go live immediately without re-review for minor edits.',
  },
  {
    q: 'What happens when someone submits an inquiry?',
    a: "You receive an email at the contact address on your listing with the person's name, email, phone (if provided), and message. Reply directly to that email to respond to them.",
  },
  {
    q: 'Can I list multiple homes?',
    a: 'Yes. Your operator account can manage as many listings as you have homes. Submit each one separately through your dashboard.',
  },
]

const faqSchema = {
  '@context': 'https://schema.org',
  '@type': 'FAQPage',
  mainEntity: [
    ...FOR_SEARCHERS.map((item) => ({
      '@type': 'Question',
      name: item.q,
      acceptedAnswer: { '@type': 'Answer', text: item.a },
    })),
    ...FOR_OPERATORS.map((item) => ({
      '@type': 'Question',
      name: item.q,
      acceptedAnswer: { '@type': 'Answer', text: item.a },
    })),
  ],
}

function AccordionGroup({ items, openState, toggle }: {
  items: FAQItem[]
  openState: Set<number>
  toggle: (i: number) => void
}) {
  return (
    <div className="divide-y divide-border border border-border rounded-lg overflow-hidden bg-bg-card shadow-sm">
      {items.map((item, i) => {
        const isOpen = openState.has(i)
        return (
          <div key={i}>
            <button
              onClick={() => toggle(i)}
              className={`w-full flex items-center justify-between px-5 py-4 text-left transition-colors ${
                isOpen ? 'bg-accent-faint' : 'hover:bg-bg-secondary'
              }`}
            >
              <span className={`font-medium text-sm pr-4 ${isOpen ? 'text-accent' : 'text-fg-primary'}`}>
                {item.q}
              </span>
              <svg
                className={`w-4 h-4 shrink-0 text-fg-muted transition-transform duration-200 ${isOpen ? 'rotate-180 text-accent' : ''}`}
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
            </button>
            <div
              className={`overflow-hidden transition-all duration-200 ${
                isOpen ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0'
              }`}
            >
              <p className="px-5 py-4 text-sm text-fg-secondary leading-relaxed border-t border-border">
                {item.a}
              </p>
            </div>
          </div>
        )
      })}
    </div>
  )
}

export default function FAQPage() {
  const [searchersOpen, setSearchersOpen] = useState<Set<number>>(new Set())
  const [operatorsOpen, setOperatorsOpen] = useState<Set<number>>(new Set())

  function toggleSearcher(i: number) {
    setSearchersOpen((prev) => {
      const next = new Set(prev)
      next.has(i) ? next.delete(i) : next.add(i)
      return next
    })
  }

  function toggleOperator(i: number) {
    setOperatorsOpen((prev) => {
      const next = new Set(prev)
      next.has(i) ? next.delete(i) : next.add(i)
      return next
    })
  }

  return (
    <>
      <JsonLd data={faqSchema} />
      <div className="max-w-3xl mx-auto px-4 sm:px-6 py-12">
        <div className="mb-10">
          <p className="section-title mb-3">Frequently asked questions</p>
          <h1 className="text-3xl font-bold text-fg-primary">
            Common questions answered.
          </h1>
        </div>

        <section className="mb-10">
          <h2 className="text-lg font-bold text-fg-primary mb-4 flex items-center gap-2">
            <span className="w-6 h-6 rounded-full bg-accent-faint text-accent text-xs flex items-center justify-center font-bold">S</span>
            For those searching
          </h2>
          <AccordionGroup
            items={FOR_SEARCHERS}
            openState={searchersOpen}
            toggle={toggleSearcher}
          />
        </section>

        <section className="mb-12">
          <h2 className="text-lg font-bold text-fg-primary mb-4 flex items-center gap-2">
            <span className="w-6 h-6 rounded-full bg-accent-faint text-accent text-xs flex items-center justify-center font-bold">O</span>
            For operators
          </h2>
          <AccordionGroup
            items={FOR_OPERATORS}
            openState={operatorsOpen}
            toggle={toggleOperator}
          />
        </section>

        <div className="bg-accent-faint border border-accent/20 rounded-lg p-6 text-center">
          <p className="text-sm text-fg-secondary mb-4">
            Still have questions? The best way to learn about a home is to reach out directly.
          </p>
          <Link href="/" className="btn-primary text-sm">
            Search homes
          </Link>
        </div>
      </div>
    </>
  )
}
