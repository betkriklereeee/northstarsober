import { notFound } from 'next/navigation'
import Image from 'next/image'
import Link from 'next/link'
import { createClient } from '@/lib/supabase/server'
import { formatPrice, formatGender, formatBeds } from '@/lib/utils'
import ContactForm from './contact-form'

interface Props {
  params: { slug: string }
}

export async function generateMetadata({ params }: Props) {
  const supabase = createClient()
  const { data } = await supabase
    .from('listings')
    .select('name, city, description')
    .eq('slug', params.slug)
    .single()

  if (!data) return { title: 'Not found' }
  return {
    title: `${data.name} — 9090 Homes`,
    description: data.description ?? `Sober living in ${data.city}, California.`,
  }
}

const genderLabel = { men: "Men's", women: "Women's", coed: 'Co-ed' }
const genderClass = {
  men: 'bg-blue-400/10 text-blue-400 border-blue-400/20',
  women: 'bg-pink-400/10 text-pink-400 border-pink-400/20',
  coed: 'bg-purple-400/10 text-purple-400 border-purple-400/20',
}

export default async function ListingPage({ params }: Props) {
  const supabase = createClient()

  const { data: listing } = await supabase
    .from('listings')
    .select(`
      *,
      listing_amenities (
        amenities (id, name, slug)
      )
    `)
    .eq('slug', params.slug)
    .eq('status', 'live')
    .single()

  if (!listing) notFound()

  const amenities = listing.listing_amenities?.map((la: any) => la.amenities) ?? []

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-8">
      {/* Back */}
      <Link
        href="/"
        className="inline-flex items-center gap-1.5 text-sm text-fg-secondary hover:text-fg-primary transition-colors mb-6"
      >
        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
        </svg>
        Back to directory
      </Link>

      <div className="grid lg:grid-cols-3 gap-8">
        {/* Main content */}
        <div className="lg:col-span-2 space-y-6">
          {/* Photos */}
          {listing.photos?.length > 0 ? (
            <div className="grid grid-cols-2 gap-2 rounded-lg overflow-hidden">
              <div className="col-span-2 relative aspect-video">
                <Image
                  src={listing.photos[0]}
                  alt={listing.name}
                  fill
                  className="object-cover"
                  priority
                />
              </div>
              {listing.photos.slice(1, 3).map((photo: string, i: number) => (
                <div key={i} className="relative aspect-video">
                  <Image src={photo} alt={`${listing.name} photo ${i + 2}`} fill className="object-cover" />
                </div>
              ))}
            </div>
          ) : (
            <div className="aspect-video bg-bg-elevated rounded-lg flex items-center justify-center">
              <svg className="w-16 h-16 text-fg-muted" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M3 9l9-7 9 7v11a2 2 0 01-2 2H5a2 2 0 01-2-2z" />
              </svg>
            </div>
          )}

          {/* Header */}
          <div>
            <div className="flex items-start justify-between gap-3 mb-2">
              <h1 className="text-2xl font-bold text-fg-primary">{listing.name}</h1>
              <div className="flex items-center gap-2 shrink-0">
                {listing.verified && (
                  <span className="badge badge-sage">
                    <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M6.267 3.455a3.066 3.066 0 001.745-.723 3.066 3.066 0 013.976 0 3.066 3.066 0 001.745.723 3.066 3.066 0 012.812 2.812c.051.643.304 1.254.723 1.745a3.066 3.066 0 010 3.976 3.066 3.066 0 00-.723 1.745 3.066 3.066 0 01-2.812 2.812 3.066 3.066 0 00-1.745.723 3.066 3.066 0 01-3.976 0 3.066 3.066 0 00-1.745-.723 3.066 3.066 0 01-2.812-2.812 3.066 3.066 0 00-.723-1.745 3.066 3.066 0 010-3.976 3.066 3.066 0 00.723-1.745 3.066 3.066 0 012.812-2.812zm7.44 5.252a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                    </svg>
                    Verified
                  </span>
                )}
                <span className={`badge border ${genderClass[listing.gender as keyof typeof genderClass]}`}>
                  {genderLabel[listing.gender as keyof typeof genderLabel]}
                </span>
              </div>
            </div>

            <p className="text-fg-secondary text-sm mb-4">
              {listing.city}, {listing.county} County · {listing.zip}
            </p>

            <div className="flex flex-wrap gap-4 text-sm">
              <div>
                <p className="section-title mb-0.5">Monthly rent</p>
                <p className="font-semibold text-fg-primary text-base">
                  {formatPrice(listing.price_min, listing.price_max)}
                </p>
              </div>
              {listing.bed_count && (
                <div>
                  <p className="section-title mb-0.5">Beds</p>
                  <p className="font-semibold text-fg-primary text-base">
                    {formatBeds(listing.bed_count)}
                  </p>
                </div>
              )}
              <div>
                <p className="section-title mb-0.5">Pet friendly</p>
                <p className="font-semibold text-fg-primary text-base">
                  {listing.pet_friendly ? 'Yes' : 'No'}
                </p>
              </div>
              <div>
                <p className="section-title mb-0.5">MAT friendly</p>
                <p className="font-semibold text-fg-primary text-base">
                  {listing.mat_friendly ? 'Yes' : 'No'}
                </p>
              </div>
            </div>
          </div>

          {/* Description */}
          {listing.description && (
            <div>
              <h2 className="font-semibold text-fg-primary mb-2">About this home</h2>
              <p className="text-fg-secondary text-sm leading-relaxed whitespace-pre-line">
                {listing.description}
              </p>
            </div>
          )}

          {/* Amenities */}
          {amenities.length > 0 && (
            <div>
              <h2 className="font-semibold text-fg-primary mb-3">Amenities</h2>
              <div className="flex flex-wrap gap-2">
                {amenities.map((a: any) => (
                  <span key={a.id} className="badge-muted">
                    {a.name}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* House rules */}
          {listing.house_rules && (
            <div className="bg-bg-secondary rounded-lg p-4 border border-border">
              <h2 className="font-semibold text-fg-primary mb-2">House rules</h2>
              <p className="text-fg-secondary text-sm leading-relaxed whitespace-pre-line">
                {listing.house_rules}
              </p>
            </div>
          )}
        </div>

        {/* Sidebar */}
        <div className="space-y-4">
          {/* Contact card */}
          <div className="card p-4 sticky top-20">
            <h2 className="font-semibold text-fg-primary mb-4">Get in touch</h2>

            {/* Direct contact info */}
            {(listing.phone || listing.email || listing.website) && (
              <div className="space-y-2 mb-4 pb-4 border-b border-border">
                {listing.phone && (
                  <a
                    href={`tel:${listing.phone}`}
                    className="flex items-center gap-2 text-sm text-fg-secondary hover:text-sage transition-colors"
                  >
                    <svg className="w-4 h-4 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                    </svg>
                    {listing.phone}
                  </a>
                )}
                {listing.website && (
                  <a
                    href={listing.website}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-2 text-sm text-fg-secondary hover:text-sage transition-colors"
                  >
                    <svg className="w-4 h-4 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9a9 9 0 01-9-9m9 9c1.657 0 3-4.03 3-9s-1.343-9-3-9m0 18c-1.657 0-3-4.03-3-9s1.343-9 3-9" />
                    </svg>
                    Visit website
                  </a>
                )}
              </div>
            )}

            {/* Contact form */}
            <ContactForm
              listingId={listing.id}
              listingName={listing.name}
              listingEmail={listing.email}
            />
          </div>

          {/* Address */}
          <div className="card p-4">
            <h3 className="section-title mb-2">Location</h3>
            <p className="text-sm text-fg-secondary">
              {listing.address}
              <br />
              {listing.city}, CA {listing.zip}
            </p>
            <a
              href={`https://maps.google.com/?q=${encodeURIComponent(listing.address + ', ' + listing.city + ', CA')}`}
              target="_blank"
              rel="noopener noreferrer"
              className="text-xs text-sage hover:text-sage-light transition-colors mt-2 inline-block"
            >
              Open in Google Maps →
            </a>
          </div>
        </div>
      </div>
    </div>
  )
}
