import { redirect, notFound } from 'next/navigation'
import Link from 'next/link'
import { createClient } from '@/lib/supabase/server'
import ListingForm from '@/components/listing-form'

interface Props {
  params: { id: string }
}

export default async function EditListingPage({ params }: Props) {
  const supabase = createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) redirect('/operator/login')

  const [{ data: listing }, { data: amenities }] = await Promise.all([
    supabase
      .from('listings')
      .select('*, listing_amenities(amenities(id, name, slug))')
      .eq('id', params.id)
      .eq('operator_id', user.id)
      .single(),
    supabase.from('amenities').select('*').order('name'),
  ])

  if (!listing) notFound()

  const listingWithAmenities = {
    ...listing,
    amenities: listing.listing_amenities?.map((la: any) => la.amenities) ?? [],
  }

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 py-8">
      <div className="mb-8">
        <Link
          href="/operator/dashboard"
          className="inline-flex items-center gap-1.5 text-sm text-fg-secondary hover:text-fg-primary transition-colors mb-4"
        >
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
          Dashboard
        </Link>
        <h1 className="text-xl font-bold text-fg-primary">Edit listing</h1>
        <p className="text-sm text-fg-secondary mt-1">{listing.name}</p>
      </div>

      <ListingForm
        listing={listingWithAmenities}
        amenities={amenities ?? []}
        userId={user.id}
        mode="edit"
      />
    </div>
  )
}
