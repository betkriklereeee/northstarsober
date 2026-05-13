import { redirect } from 'next/navigation'
import Link from 'next/link'
import { createClient } from '@/lib/supabase/server'
import { formatPrice, formatGender } from '@/lib/utils'

const statusStyle = {
  pending: 'bg-amber-50 text-amber-700 border-amber-200',
  live: 'bg-accent-faint text-accent border-accent/30',
  rejected: 'bg-red-50 text-red-700 border-red-200',
}

const statusLabel = {
  pending: 'Under review',
  live: 'Live',
  rejected: 'Rejected',
}

export default async function DashboardPage() {
  const supabase = createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) redirect('/operator/login')

  const { data: listings } = await supabase
    .from('listings')
    .select('*')
    .eq('operator_id', user.id)
    .order('created_at', { ascending: false })

  const { data: operator } = await supabase
    .from('operators')
    .select('name, is_admin, avatar_url, bio')
    .eq('id', user.id)
    .single()

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-8">
      {!operator?.avatar_url && !operator?.bio && (
        <div className="card p-4 mb-6 border-accent/30 bg-accent-faint flex items-center justify-between gap-4">
          <div>
            <p className="text-sm font-medium text-fg-primary">Complete your profile</p>
            <p className="text-xs text-fg-secondary mt-0.5">
              Add a photo and bio — it shows on your listings and builds trust with families.
            </p>
          </div>
          <Link href="/operator/profile" className="btn-primary text-sm shrink-0">
            Set up profile
          </Link>
        </div>
      )}

      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-xl font-bold text-fg-primary">Dashboard</h1>
          <p className="text-sm text-fg-secondary mt-0.5">
            {operator?.name ?? user.email}
          </p>
        </div>
        <div className="flex items-center gap-2">
          {operator?.is_admin && (
            <Link href="/admin" className="btn-secondary text-sm">
              Admin panel
            </Link>
          )}
          <Link href="/operator/listings/new" className="btn-primary text-sm">
            + Add listing
          </Link>
        </div>
      </div>

      {listings?.length === 0 ? (
        <div className="card p-12 text-center shadow-sm">
          <div className="w-12 h-12 rounded-full bg-accent-faint flex items-center justify-center mx-auto mb-4">
            <svg className="w-6 h-6 text-accent" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 9l9-7 9 7v11a2 2 0 01-2 2H5a2 2 0 01-2-2z" />
            </svg>
          </div>
          <p className="font-medium text-fg-primary mb-1">No listings yet</p>
          <p className="text-sm text-fg-secondary mb-4">
            Add your first sober living home to get started.
          </p>
          <Link href="/operator/listings/new" className="btn-primary inline-block text-sm">
            Add your home
          </Link>
        </div>
      ) : (
        <div className="space-y-3">
          <p className="section-title">{listings!.length} listing{listings!.length !== 1 ? 's' : ''}</p>
          {listings!.map((listing) => (
            <div key={listing.id} className="card p-4 shadow-sm flex items-center gap-4">
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-1">
                  <span className={`badge border text-xs ${statusStyle[listing.status as keyof typeof statusStyle]}`}>
                    {statusLabel[listing.status as keyof typeof statusLabel]}
                  </span>
                  {listing.verified && (
                    <span className="badge-accent text-xs">Verified</span>
                  )}
                </div>
                <h3 className="font-medium text-fg-primary truncate">{listing.name}</h3>
                <p className="text-xs text-fg-secondary mt-0.5">
                  {listing.city} · {formatGender(listing.gender)} · {formatPrice(listing.price_min, listing.price_max)}
                </p>
              </div>

              <div className="flex items-center gap-2 shrink-0">
                {listing.status === 'live' && (
                  <Link
                    href={`/listings/${listing.slug}`}
                    className="btn-ghost text-xs"
                    target="_blank"
                  >
                    View →
                  </Link>
                )}
                <Link
                  href={`/operator/listings/${listing.id}/edit`}
                  className="btn-secondary text-xs"
                >
                  Edit
                </Link>
              </div>
            </div>
          ))}

          {listings!.some((l) => l.status === 'pending') && (
            <p className="text-xs text-fg-muted text-center pt-2">
              Listings under review are typically approved within 24 hours.
            </p>
          )}
        </div>
      )}
    </div>
  )
}
