'use client'

import { useCallback, useState } from 'react'
import { CA_COUNTIES, cn } from '@/lib/utils'
import type { FilterState } from '@/lib/supabase/types'

interface SearchFiltersProps {
  filters: FilterState
  onChange: (filters: FilterState) => void
  totalCount: number
  filteredCount: number
}

export default function SearchFilters({
  filters,
  onChange,
  totalCount,
  filteredCount,
}: SearchFiltersProps) {
  const [expanded, setExpanded] = useState(false)

  const update = useCallback(
    (patch: Partial<FilterState>) => onChange({ ...filters, ...patch }),
    [filters, onChange]
  )

  const hasActiveFilters =
    filters.query ||
    filters.gender ||
    filters.county ||
    filters.minPrice ||
    filters.maxPrice ||
    filters.minBeds ||
    filters.petFriendly ||
    filters.matFriendly

  function clearAll() {
    onChange({
      query: '',
      gender: '',
      county: '',
      minPrice: '',
      maxPrice: '',
      minBeds: '',
      petFriendly: false,
      matFriendly: false,
    })
  }

  return (
    <div className="bg-bg-card border-b border-border px-4 py-3 space-y-3">
      {/* Search bar */}
      <div className="relative">
        <svg
          className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-fg-muted"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
        </svg>
        <input
          type="text"
          placeholder="Search by city, zip, or name…"
          value={filters.query}
          onChange={(e) => update({ query: e.target.value })}
          className="input-field pl-9"
        />
        {filters.query && (
          <button
            onClick={() => update({ query: '' })}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-fg-muted hover:text-fg-primary"
          >
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        )}
      </div>

      {/* Quick filters row */}
      <div className="flex items-center gap-2 flex-wrap">
        {/* Gender toggle */}
        <div className="flex rounded border border-border overflow-hidden text-xs">
          {(['', 'men', 'women', 'coed'] as const).map((g) => (
            <button
              key={g}
              onClick={() => update({ gender: g })}
              className={cn(
                'px-2.5 py-1.5 transition-colors',
                filters.gender === g
                  ? 'bg-accent text-white font-medium'
                  : 'text-fg-secondary hover:text-fg-primary hover:bg-bg-secondary bg-bg-card'
              )}
            >
              {g === '' ? 'All' : g === 'men' ? "Men's" : g === 'women' ? "Women's" : 'Co-ed'}
            </button>
          ))}
        </div>

        <button
          onClick={() => setExpanded(!expanded)}
          className={cn(
            'btn-secondary text-xs py-1.5 flex items-center gap-1.5',
            hasActiveFilters && !expanded ? 'border-accent/50 text-accent' : ''
          )}
        >
          <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2a1 1 0 01-.293.707L13 13.414V19a1 1 0 01-.553.894l-4 2A1 1 0 017 21v-7.586L3.293 6.707A1 1 0 013 6V4z" />
          </svg>
          Filters
          {hasActiveFilters && (
            <span className="w-1.5 h-1.5 rounded-full bg-accent" />
          )}
        </button>

        {hasActiveFilters && (
          <button onClick={clearAll} className="text-xs text-fg-muted hover:text-fg-primary transition-colors">
            Clear all
          </button>
        )}

        <span className="ml-auto text-xs text-fg-muted">
          {filteredCount === totalCount
            ? `${totalCount} homes`
            : `${filteredCount} of ${totalCount}`}
        </span>
      </div>

      {/* Expanded filters */}
      {expanded && (
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 pt-1">
          <div>
            <label className="label">County</label>
            <select
              value={filters.county}
              onChange={(e) => update({ county: e.target.value })}
              className="input-field"
            >
              <option value="">All counties</option>
              {CA_COUNTIES.map((c) => (
                <option key={c} value={c}>{c}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="label">Min price / mo</label>
            <select
              value={filters.minPrice}
              onChange={(e) => update({ minPrice: e.target.value })}
              className="input-field"
            >
              <option value="">No min</option>
              <option value="500">$500</option>
              <option value="750">$750</option>
              <option value="1000">$1,000</option>
              <option value="1500">$1,500</option>
              <option value="2000">$2,000</option>
            </select>
          </div>

          <div>
            <label className="label">Max price / mo</label>
            <select
              value={filters.maxPrice}
              onChange={(e) => update({ maxPrice: e.target.value })}
              className="input-field"
            >
              <option value="">No max</option>
              <option value="1000">$1,000</option>
              <option value="1500">$1,500</option>
              <option value="2000">$2,000</option>
              <option value="2500">$2,500</option>
              <option value="3000">$3,000</option>
            </select>
          </div>

          <div>
            <label className="label">Min beds</label>
            <select
              value={filters.minBeds}
              onChange={(e) => update({ minBeds: e.target.value })}
              className="input-field"
            >
              <option value="">Any</option>
              <option value="4">4+</option>
              <option value="6">6+</option>
              <option value="8">8+</option>
              <option value="10">10+</option>
            </select>
          </div>

          <div className="flex flex-col gap-2 pt-5">
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={filters.petFriendly}
                onChange={(e) => update({ petFriendly: e.target.checked })}
                className="w-4 h-4 rounded border-border accent-[#4a7fa5]"
              />
              <span className="text-xs text-fg-secondary">Pet friendly</span>
            </label>
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={filters.matFriendly}
                onChange={(e) => update({ matFriendly: e.target.checked })}
                className="w-4 h-4 rounded border-border accent-[#4a7fa5]"
              />
              <span className="text-xs text-fg-secondary">MAT friendly</span>
            </label>
          </div>
        </div>
      )}
    </div>
  )
}
