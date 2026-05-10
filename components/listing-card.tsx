import Link from 'next/link'
import Image from 'next/image'
import { formatPrice, formatGender, formatBeds, cn } from '@/lib/utils'
import type { Listing } from '@/lib/supabase/types'

interface ListingCardProps {
  listing: Listing
  selected?: boolean
  onClick?: () => void
}

const genderColor = {
  men: 'text-blue-700 bg-blue-50 border-blue-200',
  women: 'text-pink-700 bg-pink-50 border-pink-200',
  coed: 'text-purple-700 bg-purple-50 border-purple-200',
}

export default function ListingCard({ listing, selected, onClick }: ListingCardProps) {
  const photo = listing.photos?.[0]

  return (
    <div
      onClick={onClick}
      className={cn(
        'card cursor-pointer transition-all duration-150 group',
        selected
          ? 'ring-1 ring-accent border-accent/50 shadow-sm'
          : 'hover:border-accent/30 hover:shadow-sm'
      )}
    >
      {/* Photo */}
      <div className="relative h-36 bg-bg-secondary overflow-hidden">
        {photo ? (
          <Image
            src={photo}
            alt={listing.name}
            fill
            className="object-cover group-hover:scale-105 transition-transform duration-300"
            sizes="(max-width: 768px) 100vw, 400px"
          />
        ) : (
          <div className="h-full flex items-center justify-center">
            <svg className="w-10 h-10 text-fg-muted/40" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M3 9l9-7 9 7v11a2 2 0 01-2 2H5a2 2 0 01-2-2z" />
              <polyline strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} points="9 22 9 12 15 12 15 22" />
            </svg>
          </div>
        )}
        {listing.verified && (
          <div className="absolute top-2 right-2 badge bg-white/90 text-accent border border-accent/30 backdrop-blur-sm shadow-sm">
            <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M6.267 3.455a3.066 3.066 0 001.745-.723 3.066 3.066 0 013.976 0 3.066 3.066 0 001.745.723 3.066 3.066 0 012.812 2.812c.051.643.304 1.254.723 1.745a3.066 3.066 0 010 3.976 3.066 3.066 0 00-.723 1.745 3.066 3.066 0 01-2.812 2.812 3.066 3.066 0 00-1.745.723 3.066 3.066 0 01-3.976 0 3.066 3.066 0 00-1.745-.723 3.066 3.066 0 01-2.812-2.812 3.066 3.066 0 00-.723-1.745 3.066 3.066 0 010-3.976 3.066 3.066 0 00.723-1.745 3.066 3.066 0 012.812-2.812zm7.44 5.252a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
            </svg>
            Verified
          </div>
        )}
      </div>

      {/* Content */}
      <div className="p-3.5">
        <div className="flex items-start justify-between gap-2 mb-2">
          <h3 className="font-medium text-fg-primary text-sm leading-snug group-hover:text-accent transition-colors">
            {listing.name}
          </h3>
          <span className={cn('badge shrink-0 border', genderColor[listing.gender])}>
            {formatGender(listing.gender)}
          </span>
        </div>

        <p className="text-xs text-fg-secondary mb-2.5">
          {listing.city}, {listing.county} County
        </p>

        <div className="flex items-center gap-3 text-xs text-fg-secondary">
          <span className="font-semibold text-fg-primary">
            {formatPrice(listing.price_min, listing.price_max)}
          </span>
          {listing.bed_count && <span className="text-fg-muted">·</span>}
          {listing.bed_count && <span>{formatBeds(listing.bed_count)}</span>}
        </div>

        <div className="flex items-center gap-1.5 mt-2.5">
          {listing.pet_friendly && (
            <span className="badge-muted">Pet friendly</span>
          )}
          {listing.mat_friendly && (
            <span className="badge-muted">MAT ok</span>
          )}
        </div>

        <Link
          href={`/listings/${listing.slug}`}
          className="block mt-3 text-xs text-accent hover:text-accent-dark transition-colors font-medium"
          onClick={(e) => e.stopPropagation()}
        >
          View details →
        </Link>
      </div>
    </div>
  )
}
