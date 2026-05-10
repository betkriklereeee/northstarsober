import { redirect, notFound } from 'next/navigation'
import Link from 'next/link'
import { createClient, createAdminClient } from '@/lib/supabase/server'
import { formatGender, formatPrice } from '@/lib/utils'
import AdminActions from './admin-actions'

export default async function AdminPage() {
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

  const { data: pending } = await adminClient
    .from('listings')
    .select('*, operators(email, name)')
    .eq('status', 'pending')
    .order('created_at', { ascending: true })

  const { data: recent } = await adminClient
    .from('listings')
    .select('*, operators(email, name)')
    .in('status', ['live', 'rejected'])
    .order('updated_at', { ascending: false })
    .limit(20)

  const { data: stats } = await adminClient
    .from('listings')
    .select('status')

  const counts = (stats ?? []).reduce((acc: Record<string, number>, l: any) => {
    acc[l.status] = (acc[l.status] ?? 0) + 1
    return acc
  }, {})

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 py-8">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-xl font-bold text-fg-primary">Admin panel</h1>
          <p className="text-sm text-fg-secondary mt-0.5">Review and approve listings</p>
        </div>
        <Link href="/operator/dashboard" className="btn-secondary text-sm">
          Dashboard
        </Link>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-3 mb-8">
        {[
          { label: 'Live', value: counts.live ?? 0, color: 'text-sage' },
          { label: 'Pending', value: counts.pending ?? 0, color: 'text-yellow-400' },
          { label: 'Rejected', value: counts.rejected ?? 0, color: 'text-red-400' },
        ].map(({ label, value, color }) => (
          <div key={label} className="card p-4 text-center">
            <p className={`text-2xl font-bold ${color}`}>{value}</p>
            <p className="text-xs text-fg-muted mt-1">{label}</p>
          </div>
        ))}
      </div>

      {/* Pending */}
      <section className="mb-8">
        <h2 className="font-semibold text-fg-primary mb-3">
          Pending review
          {pending && pending.length > 0 && (
            <span className="ml-2 badge bg-yellow-400/10 text-yellow-400 border-yellow-400/20">
              {pending.length}
            </span>
          )}
        </h2>

        {!pending?.length ? (
          <div className="card p-6 text-center text-sm text-fg-muted">
            No pending listings — you're all caught up.
          </div>
        ) : (
          <div className="space-y-3">
            {pending.map((listing: any) => (
              <div key={listing.id} className="card p-4">
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <h3 className="font-medium text-fg-primary">{listing.name}</h3>
                      <span className="text-xs text-fg-muted">·</span>
                      <span className="text-xs text-fg-secondary">{formatGender(listing.gender)}</span>
                    </div>
                    <p className="text-xs text-fg-secondary">
                      {listing.city}, {listing.county} County · {formatPrice(listing.price_min, listing.price_max)}
                    </p>
                    <p className="text-xs text-fg-muted mt-0.5">
                      Submitted by {listing.operators?.name ?? listing.operators?.email}
                    </p>
                    {listing.description && (
                      <p className="text-xs text-fg-secondary mt-2 line-clamp-2">
                        {listing.description}
                      </p>
                    )}
                  </div>
                  <div className="flex items-center gap-2 shrink-0">
                    <Link
                      href={`/admin/listings/${listing.id}`}
                      className="btn-secondary text-xs"
                    >
                      Full review
                    </Link>
                    <AdminActions listingId={listing.id} />
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>

      {/* Recent decisions */}
      <section>
        <h2 className="font-semibold text-fg-primary mb-3">Recent decisions</h2>
        <div className="space-y-2">
          {(recent ?? []).map((listing: any) => (
            <div key={listing.id} className="flex items-center gap-3 py-2 border-b border-border text-sm">
              <span className={`badge border text-xs ${
                listing.status === 'live'
                  ? 'bg-sage-faint text-sage border-sage/20'
                  : 'bg-red-400/10 text-red-400 border-red-400/20'
              }`}>
                {listing.status}
              </span>
              <span className="text-fg-primary flex-1 truncate">{listing.name}</span>
              <span className="text-fg-muted text-xs shrink-0">{listing.city}</span>
            </div>
          ))}
        </div>
      </section>
    </div>
  )
}
