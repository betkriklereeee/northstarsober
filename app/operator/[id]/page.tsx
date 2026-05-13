import { notFound } from 'next/navigation'
import Image from 'next/image'
import Link from 'next/link'
import { createClient } from '@/lib/supabase/server'
import { JsonLd } from '@/components/json-ld'
import ListingCard from '@/components/listing-card'

interface Props {
  params: { id: string }
}

function AvatarPlaceholder({ name, size = 96 }: { name: string | null; size?: number }) {
  const initials = name
    ? name.split(' ').map((w) => w[0]).slice(0, 2).join('').toUpperCase()
    : '?'
  return (
    <div
      style={{ width: size, height: size }}
      className="rounded-full bg-accent-faint border border-accent/20 flex items-center justify-center shrink-0"
    >
      <span className="text-accent font-semibold text-xl">{initials}</span>
    </div>
  )
}

export async function generateMetadata({ params }: Props) {
  try {
    const supabase = createClient()
    const { data } = await supabase
      .from('operators')
      .select('name, bio')
      .eq('id', params.id)
      .single()
    if (!data) return { title: 'Not found' }
    return {
      title: data.name ?? 'Operator profile',
      description: data.bio ?? undefined,
    }
  } catch {
    return { title: 'Northstar Sober' }
  }
}

export default async function PublicOperatorPage({ params }: Props) {
  const supabase = createClient()

  const { data: operator } = await supabase
    .from('operators')
    .select('id, name, avatar_url, bio, location, website, public_email, public_phone')
    .eq('id', params.id)
    .single()

  if (!operator) notFound()

  const { data: listings } = await supabase
    .from('listings')
    .select('*')
    .eq('operator_id', params.id)
    .eq('status', 'live')
    .order('created_at', { ascending: false })

  if (!listings?.length) notFound()

  const personSchema = {
    '@context': 'https://schema.org',
    '@type': 'Person',
    name: operator.name,
    ...(operator.bio && { description: operator.bio }),
    ...(operator.avatar_url && { image: operator.avatar_url }),
    ...(operator.public_email && { email: operator.public_email }),
    ...(operator.public_phone && { telephone: operator.public_phone }),
    ...(operator.website && { url: operator.website }),
    ...(operator.location && { address: operator.location }),
  }

  return (
    <>
      <JsonLd data={personSchema} />
      <div className="max-w-4xl mx-auto px-4 sm:px-6 py-8">
        <Link
          href="/"
          className="inline-flex items-center gap-1.5 text-sm text-fg-secondary hover:text-fg-primary transition-colors mb-6"
        >
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
          Back to directory
        </Link>

        {/* Profile card */}
        <div className="card p-6 shadow-sm mb-8">
          <div className="flex items-start gap-5">
            {operator.avatar_url ? (
              <div className="w-24 h-24 rounded-full overflow-hidden shrink-0 border border-border">
                <Image
                  src={operator.avatar_url}
                  alt={operator.name ?? 'Operator'}
                  width={96}
                  height={96}
                  className="object-cover w-full h-full"
                />
              </div>
            ) : (
              <AvatarPlaceholder name={operator.name} size={96} />
            )}

            <div className="min-w-0">
              {operator.name && (
                <h1 className="text-xl font-bold text-fg-primary">{operator.name}</h1>
              )}
              {operator.location && (
                <p className="text-sm text-fg-secondary mt-0.5">{operator.location}</p>
              )}

              <div className="flex flex-wrap gap-3 mt-3">
                {operator.public_email && (
                  <a
                    href={`mailto:${operator.public_email}`}
                    className="text-xs text-accent hover:text-accent-dark transition-colors"
                  >
                    {operator.public_email}
                  </a>
                )}
                {operator.public_phone && (
                  <a
                    href={`tel:${operator.public_phone}`}
                    className="text-xs text-accent hover:text-accent-dark transition-colors"
                  >
                    {operator.public_phone}
                  </a>
                )}
                {operator.website && (
                  <a
                    href={operator.website}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-xs text-accent hover:text-accent-dark transition-colors"
                  >
                    Website →
                  </a>
                )}
              </div>
            </div>
          </div>

          {operator.bio && (
            <p className="text-sm text-fg-secondary leading-relaxed mt-5 border-t border-border pt-5">
              {operator.bio}
            </p>
          )}
        </div>

        {/* Listings */}
        <p className="section-title mb-4">
          {listings.length} listing{listings.length !== 1 ? 's' : ''}
        </p>
        <div className="grid sm:grid-cols-2 gap-4">
          {listings.map((listing) => (
            <ListingCard key={listing.id} listing={listing} />
          ))}
        </div>
      </div>
    </>
  )
}
