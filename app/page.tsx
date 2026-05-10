import { createClient } from '@/lib/supabase/server'
import DirectoryView from '@/components/directory-view'
import type { Listing } from '@/lib/supabase/types'

export const revalidate = 60

export default async function HomePage() {
  const supabase = createClient()

  const { data: listings } = await supabase
    .from('listings')
    .select(`
      *,
      listing_amenities (
        amenities (id, name, slug)
      )
    `)
    .eq('status', 'live')
    .order('created_at', { ascending: false })

  const flat: Listing[] = (listings ?? []).map((l: any) => ({
    ...l,
    amenities: l.listing_amenities?.map((la: any) => la.amenities) ?? [],
  }))

  return (
    <>
      {/* Hero */}
      <div className="bg-bg-secondary border-b border-border px-6 py-10 text-center">
        <p className="text-xs font-medium tracking-widest text-sage uppercase mb-3">
          California Sober Living Directory
        </p>
        <h1 className="text-3xl sm:text-4xl font-bold text-fg-primary mb-3 tracking-tight">
          Find a home.{' '}
          <span className="text-sage">Start your 90.</span>
        </h1>
        <p className="text-fg-secondary text-sm max-w-xl mx-auto leading-relaxed">
          Verified, cash-pay sober living homes across California. Real houses, real communities.
          Search by city, county, or zip — no ads, no upsells.
        </p>
        <div className="flex items-center justify-center gap-4 mt-6 text-xs text-fg-muted">
          <span className="flex items-center gap-1.5">
            <span className="w-1.5 h-1.5 rounded-full bg-sage" />
            {flat.length} homes listed
          </span>
          <span className="flex items-center gap-1.5">
            <span className="w-1.5 h-1.5 rounded-full bg-sage" />
            Cash pay only
          </span>
          <span className="flex items-center gap-1.5">
            <span className="w-1.5 h-1.5 rounded-full bg-sage" />
            Free to search
          </span>
        </div>
      </div>

      <DirectoryView listings={flat} />

      {/* How it works section */}
      <section id="how-it-works" className="bg-bg-secondary border-t border-border py-16 px-6">
        <div className="max-w-4xl mx-auto">
          <p className="section-title text-center mb-8">How it works</p>
          <div className="grid sm:grid-cols-3 gap-8">
            {[
              {
                n: '01',
                title: 'Search your area',
                body: 'Filter by city, county, gender, price, and more. Every home on this site is a standalone sober living — no detox facilities, no clinical programs.',
              },
              {
                n: '02',
                title: 'Request info',
                body: 'Found somewhere that feels right? Send a message directly to the house operator. No gatekeepers, no intake departments.',
              },
              {
                n: '03',
                title: 'Move in ready',
                body: 'These homes run on cash pay, community, and accountability. Show up willing to do the work — that\'s all that\'s required.',
              },
            ].map(({ n, title, body }) => (
              <div key={n} className="space-y-3">
                <div className="text-3xl font-bold text-sage/30 font-mono">{n}</div>
                <h3 className="font-semibold text-fg-primary">{title}</h3>
                <p className="text-sm text-fg-secondary leading-relaxed">{body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA for operators */}
      <section className="border-t border-border py-14 px-6 text-center">
        <div className="max-w-lg mx-auto">
          <p className="section-title mb-3">For operators</p>
          <h2 className="text-xl font-bold text-fg-primary mb-3">
            Run a sober living home in California?
          </h2>
          <p className="text-fg-secondary text-sm mb-6 leading-relaxed">
            List your home for free. Reach families and individuals who are actively searching.
            No contracts, no monthly fees — just a directory that actually works.
          </p>
          <a href="/operator/signup" className="btn-primary inline-block">
            List your home →
          </a>
        </div>
      </section>
    </>
  )
}
