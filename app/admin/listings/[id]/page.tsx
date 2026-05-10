import { redirect, notFound } from 'next/navigation'
import Link from 'next/link'
import Image from 'next/image'
import { createClient, createAdminClient } from '@/lib/supabase/server'
import { formatPrice, formatGender, formatBeds } from '@/lib/utils'
import AdminActions from '@/app/admin/admin-actions'

interface Props {
  params: { id: string }
}

export default async function AdminListingReviewPage({ params }: Props) {
  const supabase = createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) redirect('/operator/login')

  const { data: operator } = await supabase
    .from('operators')
    .select('is_admin')
    .eq('id', user.id)
    .single()

  if (!operator?.is_admin) notFound()

  const adminClient = createAdminClient()
  const { data: listing } = await adminClient
    .from('listings')
    .select('*, operators(email, name, phone), listing_amenities(amenities(name))')
    .eq('id', params.id)
    .single()

  if (!listing) notFound()

  const amenities = listing.listing_amenities?.map((la: any) => la.amenities.name) ?? []

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 py-8">
      <div className="flex items-center justify-between mb-6">
        <Link
          href="/admin"
          className="inline-flex items-center gap-1.5 text-sm text-fg-secondary hover:text-fg-primary transition-colors"
        >
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
          Admin panel
        </Link>
        {listing.status === 'pending' && (
          <AdminActions listingId={listing.id} />
        )}
      </div>

      <div className="space-y-6">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className={`badge border text-xs ${
              listing.status === 'live' ? 'bg-sage-faint text-sage border-sage/20' :
              listing.status === 'pending' ? 'bg-yellow-400/10 text-yellow-400 border-yellow-400/20' :
              'bg-red-400/10 text-red-400 border-red-400/20'
            }`}>
              {listing.status}
            </span>
          </div>
          <h1 className="text-2xl font-bold text-fg-primary">{listing.name}</h1>
          <p className="text-fg-secondary text-sm mt-1">
            {listing.city}, {listing.county} County · {listing.zip}
          </p>
          <p className="text-xs text-fg-muted mt-0.5">
            Submitted by {listing.operators?.name ?? listing.operators?.email}
          </p>
        </div>

        {listing.photos?.length > 0 && (
          <div className="grid grid-cols-3 gap-2">
            {listing.photos.map((url: string, i: number) => (
              <div key={i} className="aspect-video relative rounded overflow-hidden bg-bg-elevated">
                <Image src={url} alt="" fill className="object-cover" />
              </div>
            ))}
          </div>
        )}

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-sm">
          <div className="card p-3">
            <p className="section-title mb-1">Gender</p>
            <p className="font-medium">{formatGender(listing.gender)}</p>
          </div>
          <div className="card p-3">
            <p className="section-title mb-1">Rent</p>
            <p className="font-medium">{formatPrice(listing.price_min, listing.price_max)}</p>
          </div>
          <div className="card p-3">
            <p className="section-title mb-1">Beds</p>
            <p className="font-medium">{formatBeds(listing.bed_count) || '—'}</p>
          </div>
          <div className="card p-3">
            <p className="section-title mb-1">Flags</p>
            <p className="font-medium text-xs">
              {[listing.pet_friendly && 'Pet ✓', listing.mat_friendly && 'MAT ✓'].filter(Boolean).join(' · ') || 'None'}
            </p>
          </div>
        </div>

        <div className="card p-4">
          <p className="section-title mb-2">Address</p>
          <p className="text-sm text-fg-secondary">{listing.address}, {listing.city}, CA {listing.zip}</p>
          <p className="text-xs text-fg-muted mt-1">
            Coordinates: {listing.lat}, {listing.lng}
          </p>
        </div>

        {listing.description && (
          <div>
            <p className="section-title mb-2">Description</p>
            <p className="text-sm text-fg-secondary leading-relaxed whitespace-pre-line">{listing.description}</p>
          </div>
        )}

        {listing.house_rules && (
          <div>
            <p className="section-title mb-2">House rules</p>
            <p className="text-sm text-fg-secondary leading-relaxed whitespace-pre-line">{listing.house_rules}</p>
          </div>
        )}

        {amenities.length > 0 && (
          <div>
            <p className="section-title mb-2">Amenities</p>
            <div className="flex flex-wrap gap-2">
              {amenities.map((a: string) => (
                <span key={a} className="badge-muted">{a}</span>
              ))}
            </div>
          </div>
        )}

        <div className="card p-4">
          <p className="section-title mb-2">Contact info</p>
          <div className="space-y-1 text-sm text-fg-secondary">
            {listing.phone && <p>Phone: {listing.phone}</p>}
            {listing.email && <p>Email: {listing.email}</p>}
            {listing.website && <p>Website: {listing.website}</p>}
          </div>
        </div>

        {listing.status === 'pending' && (
          <div className="flex gap-2 pt-2 pb-8">
            <AdminActions listingId={listing.id} />
          </div>
        )}
      </div>
    </div>
  )
}
