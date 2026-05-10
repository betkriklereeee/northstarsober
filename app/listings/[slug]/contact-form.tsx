'use client'

import { useState } from 'react'

interface ContactFormProps {
  listingId: string
  listingName: string
  listingEmail: string | null
}

export default function ContactForm({ listingId, listingName, listingEmail }: ContactFormProps) {
  const [form, setForm] = useState({ name: '', email: '', phone: '', message: '' })
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle')

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setStatus('loading')

    try {
      const res = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ listingId, listingName, listingEmail, ...form }),
      })
      if (!res.ok) throw new Error('Failed to send')
      setStatus('success')
    } catch {
      setStatus('error')
    }
  }

  if (status === 'success') {
    return (
      <div className="text-center py-4">
        <div className="w-10 h-10 rounded-full bg-accent-faint flex items-center justify-center mx-auto mb-3">
          <svg className="w-5 h-5 text-accent" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
          </svg>
        </div>
        <p className="font-medium text-fg-primary text-sm mb-1">Message sent</p>
        <p className="text-xs text-fg-secondary">The operator will follow up with you directly.</p>
      </div>
    )
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-3">
      <div>
        <label className="label">Your name</label>
        <input
          type="text"
          required
          value={form.name}
          onChange={(e) => setForm({ ...form, name: e.target.value })}
          className="input-field"
          placeholder="First name is fine"
        />
      </div>
      <div>
        <label className="label">Email</label>
        <input
          type="email"
          required
          value={form.email}
          onChange={(e) => setForm({ ...form, email: e.target.value })}
          className="input-field"
          placeholder="you@example.com"
        />
      </div>
      <div>
        <label className="label">Phone (optional)</label>
        <input
          type="tel"
          value={form.phone}
          onChange={(e) => setForm({ ...form, phone: e.target.value })}
          className="input-field"
          placeholder="(555) 000-0000"
        />
      </div>
      <div>
        <label className="label">Message</label>
        <textarea
          required
          rows={3}
          value={form.message}
          onChange={(e) => setForm({ ...form, message: e.target.value })}
          className="input-field resize-none"
          placeholder="When are you looking to move in? Any questions about the house?"
        />
      </div>

      {status === 'error' && (
        <p className="text-xs text-red-600 bg-red-50 rounded px-3 py-2">
          Something went wrong — please try again.
        </p>
      )}

      <button type="submit" disabled={status === 'loading'} className="btn-primary w-full">
        {status === 'loading' ? 'Sending…' : 'Request info'}
      </button>

      <p className="text-xs text-fg-muted text-center">
        Your info goes directly to the operator. We don't sell your data.
      </p>
    </form>
  )
}
