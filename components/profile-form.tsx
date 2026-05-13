'use client'

import { useState, useRef } from 'react'
import Image from 'next/image'
import { createClient } from '@/lib/supabase/client'
import type { Operator } from '@/lib/supabase/types'

type ProfileOperator = Pick<Operator, 'id' | 'name' | 'avatar_url' | 'bio' | 'location' | 'website' | 'public_email' | 'public_phone'>

interface ProfileFormProps {
  operator: ProfileOperator | null
  userId: string
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
      <span className="text-accent font-semibold text-lg">{initials}</span>
    </div>
  )
}

export default function ProfileForm({ operator, userId }: ProfileFormProps) {
  const supabase = createClient()
  const fileInputRef = useRef<HTMLInputElement>(null)

  const [avatarUrl, setAvatarUrl] = useState(operator?.avatar_url ?? null)
  const [form, setForm] = useState({
    name: operator?.name ?? '',
    location: operator?.location ?? '',
    bio: operator?.bio ?? '',
    public_email: operator?.public_email ?? '',
    public_phone: operator?.public_phone ?? '',
    website: operator?.website ?? '',
  })
  const [uploading, setUploading] = useState(false)
  const [uploadError, setUploadError] = useState('')
  const [saving, setSaving] = useState(false)
  const [saveStatus, setSaveStatus] = useState<'idle' | 'success' | 'error'>('idle')
  const [saveError, setSaveError] = useState('')

  async function handleAvatarChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0]
    if (!file) return

    if (file.size > 5 * 1024 * 1024) {
      setUploadError('File must be under 5MB')
      return
    }

    setUploadError('')
    setUploading(true)

    const ext = file.name.split('.').pop()
    const path = `${userId}/avatar-${Date.now()}.${ext}`

    const { error: uploadErr } = await supabase.storage
      .from('avatars')
      .upload(path, file, { upsert: true })

    if (uploadErr) {
      setUploadError(uploadErr.message)
      setUploading(false)
      return
    }

    const { data: { publicUrl } } = supabase.storage.from('avatars').getPublicUrl(path)

    const { error: updateErr } = await supabase
      .from('operators')
      .update({ avatar_url: publicUrl })
      .eq('id', userId)

    if (updateErr) {
      setUploadError(updateErr.message)
    } else {
      setAvatarUrl(publicUrl)
    }

    setUploading(false)
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setSaving(true)
    setSaveStatus('idle')
    setSaveError('')

    const { error } = await supabase
      .from('operators')
      .update({
        name: form.name || null,
        location: form.location || null,
        bio: form.bio || null,
        public_email: form.public_email || null,
        public_phone: form.public_phone || null,
        website: form.website || null,
      })
      .eq('id', userId)

    if (error) {
      setSaveError(error.message)
      setSaveStatus('error')
    } else {
      setSaveStatus('success')
    }

    setSaving(false)
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Avatar */}
      <div className="card p-6 shadow-sm">
        <p className="font-medium text-fg-primary mb-4">Profile photo</p>
        <div className="flex items-center gap-5">
          {avatarUrl ? (
            <div className="w-24 h-24 rounded-full overflow-hidden shrink-0 border border-border">
              <Image src={avatarUrl} alt="Avatar" width={96} height={96} className="object-cover w-full h-full" />
            </div>
          ) : (
            <AvatarPlaceholder name={form.name} size={96} />
          )}
          <div>
            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              disabled={uploading}
              className="btn-secondary text-sm"
            >
              {uploading ? 'Uploading…' : 'Upload photo'}
            </button>
            <p className="text-xs text-fg-muted mt-1.5">JPG, PNG, or WebP · max 5MB</p>
            {uploadError && (
              <p className="text-xs text-red-600 mt-1">{uploadError}</p>
            )}
          </div>
        </div>
        <input
          ref={fileInputRef}
          type="file"
          accept="image/jpeg,image/png,image/webp"
          className="hidden"
          onChange={handleAvatarChange}
        />
      </div>

      {/* Profile fields */}
      <div className="card p-6 shadow-sm space-y-4">
        <p className="font-medium text-fg-primary">Profile info</p>

        <div>
          <label className="label">Your name</label>
          <input
            type="text"
            value={form.name}
            onChange={(e) => setForm({ ...form, name: e.target.value })}
            className="input-field"
            placeholder="Full name"
          />
        </div>

        <div>
          <label className="label">Location</label>
          <input
            type="text"
            value={form.location}
            onChange={(e) => setForm({ ...form, location: e.target.value })}
            className="input-field"
            placeholder="City, CA"
          />
        </div>

        <div>
          <label className="label">
            Bio
            <span className="text-fg-muted font-normal ml-1">({form.bio.length}/300)</span>
          </label>
          <textarea
            rows={4}
            maxLength={300}
            value={form.bio}
            onChange={(e) => setForm({ ...form, bio: e.target.value })}
            className="input-field resize-none"
            placeholder="Tell families a bit about yourself and your approach to sober living…"
          />
        </div>

        <div>
          <label className="label">Contact email <span className="text-fg-muted font-normal">(optional — shown on your profile)</span></label>
          <input
            type="email"
            value={form.public_email}
            onChange={(e) => setForm({ ...form, public_email: e.target.value })}
            className="input-field"
            placeholder="contact@example.com"
          />
        </div>

        <div>
          <label className="label">Contact phone <span className="text-fg-muted font-normal">(optional — shown on your profile)</span></label>
          <input
            type="tel"
            value={form.public_phone}
            onChange={(e) => setForm({ ...form, public_phone: e.target.value })}
            className="input-field"
            placeholder="(555) 000-0000"
          />
        </div>

        <div>
          <label className="label">Website <span className="text-fg-muted font-normal">(optional)</span></label>
          <input
            type="url"
            value={form.website}
            onChange={(e) => setForm({ ...form, website: e.target.value })}
            className="input-field"
            placeholder="https://yoursite.com"
          />
        </div>
      </div>

      {saveStatus === 'success' && (
        <p className="text-sm text-accent bg-accent-faint border border-accent/20 rounded px-3 py-2">
          Profile saved.
        </p>
      )}
      {saveStatus === 'error' && (
        <p className="text-xs text-red-600 bg-red-50 border border-red-100 rounded px-3 py-2">
          {saveError}
        </p>
      )}

      <button type="submit" disabled={saving} className="btn-primary">
        {saving ? 'Saving…' : 'Save profile'}
      </button>
    </form>
  )
}
