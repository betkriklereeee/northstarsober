'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'

interface AdminActionsProps {
  listingId: string
}

export default function AdminActions({ listingId }: AdminActionsProps) {
  const router = useRouter()
  const [loading, setLoading] = useState<'approve' | 'reject' | null>(null)

  async function updateStatus(status: 'live' | 'rejected') {
    setLoading(status === 'live' ? 'approve' : 'reject')
    await fetch('/api/admin/listings', {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ listingId, status }),
    })
    setLoading(null)
    router.refresh()
  }

  return (
    <div className="flex items-center gap-1.5">
      <button
        onClick={() => updateStatus('live')}
        disabled={!!loading}
        className="text-xs px-2.5 py-1.5 rounded bg-sage-faint text-sage border border-sage/20 hover:bg-sage hover:text-bg-primary transition-colors disabled:opacity-50"
      >
        {loading === 'approve' ? '…' : 'Approve'}
      </button>
      <button
        onClick={() => updateStatus('rejected')}
        disabled={!!loading}
        className="text-xs px-2.5 py-1.5 rounded bg-red-400/10 text-red-400 border border-red-400/20 hover:bg-red-400 hover:text-white transition-colors disabled:opacity-50"
      >
        {loading === 'reject' ? '…' : 'Reject'}
      </button>
    </div>
  )
}
