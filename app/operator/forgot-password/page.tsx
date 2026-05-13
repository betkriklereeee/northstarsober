'use client'

import { useState } from 'react'
import Link from 'next/link'
import { createClient } from '@/lib/supabase/client'

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState('')
  const [submitted, setSubmitted] = useState(false)
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const supabase = createClient()

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)
    setError('')

    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: 'https://cashpaysober.com/operator/reset-password',
    })

    if (error) {
      setError(error.message)
      setLoading(false)
      return
    }

    setSubmitted(true)
    setLoading(false)
  }

  return (
    <div className="min-h-[calc(100vh-3.5rem)] flex items-center justify-center px-4 py-12 bg-bg-primary">
      <div className="w-full max-w-sm">
        <div className="text-center mb-8">
          <div className="mb-2">
            <span className="text-accent font-bold text-xl tracking-tight">Northstar</span>
            <span className="text-fg-primary font-medium text-xl"> Sober</span>
          </div>
          <h1 className="text-xl font-semibold text-fg-primary">Reset your password</h1>
          <p className="text-sm text-fg-secondary mt-1">We'll send a link to your email</p>
        </div>

        <div className="card p-6 shadow-sm">
          {submitted ? (
            <div className="text-center py-2">
              <div className="w-10 h-10 rounded-full bg-accent-faint flex items-center justify-center mx-auto mb-4">
                <svg className="w-5 h-5 text-accent" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
              </div>
              <p className="text-sm font-medium text-fg-primary mb-1">Check your email</p>
              <p className="text-xs text-fg-secondary">
                We've sent a password reset link to <span className="font-medium">{email}</span>.
              </p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="label">Email address</label>
                <input
                  type="email"
                  required
                  autoComplete="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="input-field"
                  placeholder="you@example.com"
                />
              </div>

              {error && (
                <p className="text-xs text-red-600 bg-red-50 border border-red-100 rounded px-3 py-2">
                  {error}
                </p>
              )}

              <button type="submit" disabled={loading} className="btn-primary w-full">
                {loading ? 'Sending…' : 'Send reset link'}
              </button>
            </form>
          )}

          <p className="text-center text-xs text-fg-muted mt-4">
            <Link href="/operator/login" className="text-accent hover:text-accent-dark transition-colors">
              Back to sign in
            </Link>
          </p>
        </div>
      </div>
    </div>
  )
}
