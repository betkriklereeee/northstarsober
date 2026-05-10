'use client'

import { useState, useMemo, useRef, useCallback, useEffect } from 'react'
import dynamic from 'next/dynamic'
import ListingCard from '@/components/listing-card'
import SearchFilters from '@/components/search-filters'
import type { Listing, FilterState } from '@/lib/supabase/types'

const MapView = dynamic(() => import('@/components/map-view'), {
  ssr: false,
  loading: () => (
    <div className="w-full h-full bg-bg-secondary flex items-center justify-center">
      <div className="flex items-center gap-2 text-fg-muted text-sm">
        <svg className="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24">
          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
        </svg>
        Loading map…
      </div>
    </div>
  ),
})

interface DirectoryViewProps {
  listings: Listing[]
}

const DEFAULT_FILTERS: FilterState = {
  query: '',
  gender: '',
  county: '',
  minPrice: '',
  maxPrice: '',
  minBeds: '',
  petFriendly: false,
  matFriendly: false,
}

export default function DirectoryView({ listings }: DirectoryViewProps) {
  const [filters, setFilters] = useState<FilterState>(DEFAULT_FILTERS)
  const [selectedId, setSelectedId] = useState<string | null>(null)
  const [mobileTab, setMobileTab] = useState<'list' | 'map'>('list')
  const listRef = useRef<HTMLDivElement>(null)
  const cardRefs = useRef<Map<string, HTMLDivElement>>(new Map())

  // CMD+Scroll lock on list panel
  useEffect(() => {
    const el = listRef.current
    if (!el) return

    let cmdHeld = false

    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Meta') cmdHeld = true
    }
    const onKeyUp = (e: KeyboardEvent) => {
      if (e.key === 'Meta') cmdHeld = false
    }
    const onWheel = (e: WheelEvent) => {
      if (cmdHeld) {
        e.preventDefault()
        e.stopPropagation()
      }
    }

    window.addEventListener('keydown', onKeyDown)
    window.addEventListener('keyup', onKeyUp)
    el.addEventListener('wheel', onWheel, { passive: false })

    return () => {
      window.removeEventListener('keydown', onKeyDown)
      window.removeEventListener('keyup', onKeyUp)
      el.removeEventListener('wheel', onWheel)
    }
  }, [])

  const filtered = useMemo(() => {
    return listings.filter((l) => {
      const q = filters.query.toLowerCase()
      if (q) {
        const match =
          l.name.toLowerCase().includes(q) ||
          l.city.toLowerCase().includes(q) ||
          l.zip.includes(q) ||
          l.county.toLowerCase().includes(q)
        if (!match) return false
      }
      if (filters.gender && l.gender !== filters.gender) return false
      if (filters.county && l.county !== filters.county) return false
      if (filters.minPrice && (l.price_max ?? Infinity) < parseInt(filters.minPrice)) return false
      if (filters.maxPrice && (l.price_min ?? 0) > parseInt(filters.maxPrice)) return false
      if (filters.minBeds && (l.bed_count ?? 0) < parseInt(filters.minBeds)) return false
      if (filters.petFriendly && !l.pet_friendly) return false
      if (filters.matFriendly && !l.mat_friendly) return false
      return true
    })
  }, [listings, filters])

  const handleSelectFromCard = useCallback((id: string) => {
    setSelectedId(id)
    setMobileTab('map')
  }, [])

  const handleSelectFromMap = useCallback((id: string) => {
    setSelectedId(id)
    const el = cardRefs.current.get(id)
    if (el) el.scrollIntoView({ behavior: 'smooth', block: 'nearest' })
  }, [])

  return (
    <div className="flex flex-col h-[calc(100vh-3.5rem)]">
      {/* Mobile tab switcher */}
      <div className="md:hidden flex border-b border-border bg-bg-card">
        <button
          onClick={() => setMobileTab('list')}
          className={`flex-1 py-2.5 text-sm font-medium transition-colors ${
            mobileTab === 'list'
              ? 'text-accent border-b-2 border-accent'
              : 'text-fg-secondary'
          }`}
        >
          List ({filtered.length})
        </button>
        <button
          onClick={() => setMobileTab('map')}
          className={`flex-1 py-2.5 text-sm font-medium transition-colors ${
            mobileTab === 'map'
              ? 'text-accent border-b-2 border-accent'
              : 'text-fg-secondary'
          }`}
        >
          Map
        </button>
      </div>

      <div className="flex flex-1 min-h-0">
        {/* List panel */}
        <div
          className={`
            flex flex-col w-full md:w-[420px] lg:w-[460px] shrink-0
            border-r border-border bg-bg-secondary
            ${mobileTab === 'map' ? 'hidden md:flex' : 'flex'}
          `}
        >
          <SearchFilters
            filters={filters}
            onChange={setFilters}
            totalCount={listings.length}
            filteredCount={filtered.length}
          />

          <div ref={listRef} className="flex-1 overflow-y-auto p-3 space-y-2.5">
            {filtered.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-16 text-center">
                <svg className="w-12 h-12 text-fg-muted/40 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <p className="text-fg-secondary text-sm font-medium">No homes found</p>
                <p className="text-fg-muted text-xs mt-1">Try adjusting your filters</p>
              </div>
            ) : (
              filtered.map((listing) => (
                <div
                  key={listing.id}
                  ref={(el) => {
                    if (el) cardRefs.current.set(listing.id, el)
                    else cardRefs.current.delete(listing.id)
                  }}
                >
                  <ListingCard
                    listing={listing}
                    selected={selectedId === listing.id}
                    onClick={() => handleSelectFromCard(listing.id)}
                  />
                </div>
              ))
            )}
          </div>
        </div>

        {/* Map panel */}
        <div
          className={`
            flex-1 relative
            ${mobileTab === 'list' ? 'hidden md:block' : 'block'}
          `}
        >
          <MapView
            listings={filtered}
            selectedId={selectedId}
            onSelectListing={handleSelectFromMap}
          />
        </div>
      </div>
    </div>
  )
}
