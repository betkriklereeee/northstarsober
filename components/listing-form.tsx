'use client'

import { useState, useCallback } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import { geocodeAddress, slugify, CA_COUNTIES } from '@/lib/utils'
import PhotoUpload from '@/components/photo-upload'
import type { Listing, Amenity } from '@/lib/supabase/types'

interface ListingFormProps {
  listing?: Partial<Listing>
  amenities: Amenity[]
  userId: string
  mode: 'create' | 'edit'
}

interface FormState {
  name: string
  address: string
  city: string
  county: string
  zip: string
  gender: string
  description: string
  house_rules: string
  price_min: string
  price_max: string
  bed_count: string
  pet_friendly: boolean
  mat_friendly: boolean
  phone: string
  email: string
  website: string
  lat: string
  lng: string
}

export default function ListingForm({ listing, amenities, userId, mode }: ListingFormProps) {
  const router = useRouter()
  const supabase = createClient()

  const [form, setForm] = useState<FormState>({
    name: listing?.name ?? '',
    address: listing?.address ?? '',
    city: listing?.city ?? '',
    county: listing?.county ?? '',
    zip: listing?.zip ?? '',
    gender: listing?.gender ?? '',
    description: listing?.description ?? '',
    house_rules: listing?.house_rules ?? '',
    price_min: listing?.price_min?.toString() ?? '',
    price_max: listing?.price_max?.toString() ?? '',
    bed_count: listing?.bed_count?.toString() ?? '',
    pet_friendly: listing?.pet_friendly ?? false,
    mat_friendly: listing?.mat_friendly ?? false,
    phone: listing?.phone ?? '',
    email: listing?.email ?? '',
    website: listing?.website ?? '',
    lat: listing?.lat?.toString() ?? '',
    lng: listing?.lng?.toString() ?? '',
  })

  const [selectedAmenities, setSelectedAmenities] = useState<number[]>(
    listing?.amenities?.map((a) => a.id) ?? []
  )
  const [photos, setPhotos] = useState<string[]>(listing?.photos ?? [])
  const [geocoding, setGeocoding] = useState(false)
  const [geocoded, setGeocoded] = useState(!!listing?.lat)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')

  function update(patch: Partial<FormState>) {
    setForm((f) => ({ ...f, ...patch }))
    if (['address', 'city', 'zip'].some((k) => k in patch)) {
      setGeocoded(false)
    }
  }

  async function handleGeocode() {
    setGeocoding(true)
    const result = await geocodeAddress(form.address, form.city, 'CA', form.zip)
    if (result) {
      setForm((f) => ({ ...f, lat: result.lat.toString(), lng: result.lng.toString() }))
      setGeocoded(true)
    } else {
      setError('Could not find that address. Please check and try again.')
    }
    setGeocoding(false)
  }

  function toggleAmenity(id: number) {
    setSelectedAmenities((prev) =>
      prev.includes(id) ? prev.filter((a) => a !== id) : [...prev, id]
    )
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError('')

    if (!geocoded || !form.lat || !form.lng) {
      setError('Please verify the address before saving.')
      return
    }

    setSaving(true)

    const slug = mode === 'create'
      ? `${slugify(form.name)}-${Math.random().toString(36).slice(2, 7)}`
      : listing!.slug!

    const payload = {
      operator_id: userId,
      name: form.name,
      slug,
      address: form.address,
      city: form.city,
      county: form.county,
      state: 'CA',
      zip: form.zip,
      gender: form.gender,
      description: form.description || null,
      house_rules: form.house_rules || null,
      price_min: form.price_min ? parseInt(form.price_min) : null,
      price_max: form.price_max ? parseInt(form.price_max) : null,
      bed_count: form.bed_count ? parseInt(form.bed_count) : null,
      pet_friendly: form.pet_friendly,
      mat_friendly: form.mat_friendly,
      phone: form.phone || null,
      email: form.email || null,
      website: form.website || null,
      lat: parseFloat(form.lat),
      lng: parseFloat(form.lng),
      photos,
      status: mode === 'create' ? 'pending' : (listing?.status ?? 'pending'),
      updated_at: new Date().toISOString(),
    }

    let listingId = listing?.id

    if (mode === 'create') {
      const { data, error: dbError } = await supabase
        .from('listings')
        .insert(payload)
        .select('id')
        .single()
      if (dbError) { setError(dbError.message); setSaving(false); return }
      listingId = data.id
    } else {
      const { error: dbError } = await supabase
        .from('listings')
        .update(payload)
        .eq('id', listing!.id)
      if (dbError) { setError(dbError.message); setSaving(false); return }
    }

    if (listingId) {
      await supabase.from('listing_amenities').delete().eq('listing_id', listingId)
      if (selectedAmenities.length > 0) {
        await supabase.from('listing_amenities').insert(
          selectedAmenities.map((amenity_id) => ({ listing_id: listingId!, amenity_id }))
        )
      }
    }

    router.push('/operator/dashboard')
    router.refresh()
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-8 max-w-2xl">
      {/* Basic info */}
      <section>
        <h2 className="font-semibold text-fg-primary mb-4 pb-2 border-b border-border">
          Basic information
        </h2>
        <div className="space-y-4">
          <div>
            <label className="label">Home name *</label>
            <input
              type="text"
              required
              value={form.name}
              onChange={(e) => update({ name: e.target.value })}
              className="input-field"
              placeholder="e.g. Serenity House Silver Lake"
            />
          </div>
          <div>
            <label className="label">Gender *</label>
            <div className="flex rounded border border-border overflow-hidden text-sm w-fit">
              {(['men', 'women', 'coed'] as const).map((g) => (
                <button
                  key={g}
                  type="button"
                  onClick={() => update({ gender: g })}
                  className={`px-4 py-2 transition-colors ${
                    form.gender === g
                      ? 'bg-accent text-white font-medium'
                      : 'text-fg-secondary hover:text-fg-primary hover:bg-bg-secondary bg-bg-card'
                  }`}
                >
                  {g === 'men' ? "Men's" : g === 'women' ? "Women's" : 'Co-ed'}
                </button>
              ))}
            </div>
            {!form.gender && <p className="text-xs text-fg-muted mt-1">Required</p>}
          </div>
        </div>
      </section>

      {/* Address */}
      <section>
        <h2 className="font-semibold text-fg-primary mb-4 pb-2 border-b border-border">
          Address
        </h2>
        <div className="space-y-4">
          <div>
            <label className="label">Street address *</label>
            <input
              type="text"
              required
              value={form.address}
              onChange={(e) => update({ address: e.target.value })}
              className="input-field"
              placeholder="123 Main St"
            />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="label">City *</label>
              <input
                type="text"
                required
                value={form.city}
                onChange={(e) => update({ city: e.target.value })}
                className="input-field"
                placeholder="Los Angeles"
              />
            </div>
            <div>
              <label className="label">ZIP code *</label>
              <input
                type="text"
                required
                value={form.zip}
                onChange={(e) => update({ zip: e.target.value })}
                className="input-field"
                placeholder="90001"
              />
            </div>
          </div>
          <div>
            <label className="label">County *</label>
            <select
              required
              value={form.county}
              onChange={(e) => update({ county: e.target.value })}
              className="input-field"
            >
              <option value="">Select county</option>
              {CA_COUNTIES.map((c) => (
                <option key={c} value={c}>{c}</option>
              ))}
            </select>
          </div>

          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={handleGeocode}
              disabled={!form.address || !form.city || !form.zip || geocoding}
              className="btn-secondary text-sm"
            >
              {geocoding ? 'Verifying…' : 'Verify address'}
            </button>
            {geocoded && (
              <span className="flex items-center gap-1.5 text-xs text-accent">
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
                Address verified
              </span>
            )}
          </div>
        </div>
      </section>

      {/* Details */}
      <section>
        <h2 className="font-semibold text-fg-primary mb-4 pb-2 border-b border-border">
          Details
        </h2>
        <div className="space-y-4">
          <div className="grid grid-cols-3 gap-3">
            <div>
              <label className="label">Min rent / mo</label>
              <div className="relative">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-fg-muted text-sm">$</span>
                <input
                  type="number"
                  min={0}
                  value={form.price_min}
                  onChange={(e) => update({ price_min: e.target.value })}
                  className="input-field pl-6"
                  placeholder="900"
                />
              </div>
            </div>
            <div>
              <label className="label">Max rent / mo</label>
              <div className="relative">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-fg-muted text-sm">$</span>
                <input
                  type="number"
                  min={0}
                  value={form.price_max}
                  onChange={(e) => update({ price_max: e.target.value })}
                  className="input-field pl-6"
                  placeholder="1400"
                />
              </div>
            </div>
            <div>
              <label className="label">Total beds</label>
              <input
                type="number"
                min={1}
                value={form.bed_count}
                onChange={(e) => update({ bed_count: e.target.value })}
                className="input-field"
                placeholder="8"
              />
            </div>
          </div>

          <div className="flex gap-6">
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={form.pet_friendly}
                onChange={(e) => update({ pet_friendly: e.target.checked })}
                className="w-4 h-4 rounded accent-[#4a7fa5]"
              />
              <span className="text-sm text-fg-secondary">Pet friendly</span>
            </label>
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={form.mat_friendly}
                onChange={(e) => update({ mat_friendly: e.target.checked })}
                className="w-4 h-4 rounded accent-[#4a7fa5]"
              />
              <span className="text-sm text-fg-secondary">MAT friendly</span>
            </label>
          </div>
        </div>
      </section>

      {/* Description */}
      <section>
        <h2 className="font-semibold text-fg-primary mb-4 pb-2 border-b border-border">
          Description & rules
        </h2>
        <div className="space-y-4">
          <div>
            <label className="label">About this home</label>
            <textarea
              rows={4}
              value={form.description}
              onChange={(e) => update({ description: e.target.value })}
              className="input-field resize-none"
              placeholder="Describe the home, the community, and what makes it a good fit for recovery…"
            />
          </div>
          <div>
            <label className="label">House rules</label>
            <textarea
              rows={4}
              value={form.house_rules}
              onChange={(e) => update({ house_rules: e.target.value })}
              className="input-field resize-none"
              placeholder="Curfews, meeting requirements, drug testing policy, visitor policy…"
            />
          </div>
        </div>
      </section>

      {/* Amenities */}
      <section>
        <h2 className="font-semibold text-fg-primary mb-4 pb-2 border-b border-border">
          Amenities
        </h2>
        <div className="flex flex-wrap gap-2">
          {amenities.map((a) => (
            <button
              key={a.id}
              type="button"
              onClick={() => toggleAmenity(a.id)}
              className={`badge border transition-colors ${
                selectedAmenities.includes(a.id)
                  ? 'bg-accent-faint text-accent border-accent/30'
                  : 'bg-bg-secondary text-fg-secondary border-border hover:border-accent/30 hover:text-accent'
              }`}
            >
              {a.name}
            </button>
          ))}
        </div>
      </section>

      {/* Photos */}
      <section>
        <h2 className="font-semibold text-fg-primary mb-4 pb-2 border-b border-border">
          Photos
        </h2>
        <PhotoUpload
          photos={photos}
          onChange={setPhotos}
          listingId={listing?.id}
          userId={userId}
        />
      </section>

      {/* Contact */}
      <section>
        <h2 className="font-semibold text-fg-primary mb-4 pb-2 border-b border-border">
          Contact information
        </h2>
        <div className="space-y-4">
          <div>
            <label className="label">Phone</label>
            <input
              type="tel"
              value={form.phone}
              onChange={(e) => update({ phone: e.target.value })}
              className="input-field"
              placeholder="(555) 000-0000"
            />
          </div>
          <div>
            <label className="label">Contact email</label>
            <input
              type="email"
              value={form.email}
              onChange={(e) => update({ email: e.target.value })}
              className="input-field"
              placeholder="contact@yourhouse.com"
            />
          </div>
          <div>
            <label className="label">Website (optional)</label>
            <input
              type="url"
              value={form.website}
              onChange={(e) => update({ website: e.target.value })}
              className="input-field"
              placeholder="https://yourhouse.com"
            />
          </div>
        </div>
      </section>

      {error && (
        <p className="text-sm text-red-600 bg-red-50 border border-red-100 rounded px-4 py-3">{error}</p>
      )}

      <div className="flex items-center gap-3 pt-2 pb-8">
        <button
          type="submit"
          disabled={saving || !form.gender}
          className="btn-primary"
        >
          {saving
            ? 'Saving…'
            : mode === 'create'
            ? 'Submit for review'
            : 'Save changes'}
        </button>
        <button
          type="button"
          onClick={() => router.push('/operator/dashboard')}
          className="btn-secondary"
        >
          Cancel
        </button>
        {mode === 'create' && (
          <p className="text-xs text-fg-muted ml-2">
            Your listing will be reviewed before going live.
          </p>
        )}
      </div>
    </form>
  )
}
