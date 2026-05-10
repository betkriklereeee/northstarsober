import { type Gender, type Listing } from './supabase/types'

export function formatPrice(min: number | null, max: number | null): string {
  if (!min && !max) return 'Contact for pricing'
  if (!max) return `$${min?.toLocaleString()}/mo`
  if (!min) return `Up to $${max?.toLocaleString()}/mo`
  if (min === max) return `$${min.toLocaleString()}/mo`
  return `$${min.toLocaleString()}–$${max.toLocaleString()}/mo`
}

export function formatGender(gender: Gender): string {
  const map: Record<Gender, string> = {
    men: "Men's",
    women: "Women's",
    coed: 'Co-ed',
  }
  return map[gender]
}

export function formatBeds(count: number | null): string {
  if (!count) return ''
  return `${count} bed${count === 1 ? '' : 's'}`
}

export async function geocodeAddress(
  address: string,
  city: string,
  state: string,
  zip: string
): Promise<{ lat: number; lng: number } | null> {
  const query = encodeURIComponent(`${address}, ${city}, ${state} ${zip}`)
  const token = process.env.NEXT_PUBLIC_MAPBOX_TOKEN
  const url = `https://api.mapbox.com/geocoding/v5/mapbox.places/${query}.json?access_token=${token}&country=US&limit=1`
  try {
    const res = await fetch(url)
    const data = await res.json()
    if (data.features?.length > 0) {
      const [lng, lat] = data.features[0].center
      return { lat, lng }
    }
  } catch {}
  return null
}

export function slugify(text: string): string {
  return text
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
    .trim()
}

export function cn(...classes: (string | undefined | null | false)[]): string {
  return classes.filter(Boolean).join(' ')
}

export function listingsToGeoJSON(listings: Listing[]) {
  return {
    type: 'FeatureCollection' as const,
    features: listings.map((l) => ({
      type: 'Feature' as const,
      id: l.id,
      geometry: {
        type: 'Point' as const,
        coordinates: [l.lng, l.lat],
      },
      properties: {
        id: l.id,
        name: l.name,
        city: l.city,
        gender: l.gender,
        price_min: l.price_min,
        price_max: l.price_max,
        bed_count: l.bed_count,
        slug: l.slug,
      },
    })),
  }
}

export const CA_COUNTIES = [
  'Alameda', 'Alpine', 'Amador', 'Butte', 'Calaveras', 'Colusa',
  'Contra Costa', 'Del Norte', 'El Dorado', 'Fresno', 'Glenn', 'Humboldt',
  'Imperial', 'Inyo', 'Kern', 'Kings', 'Lake', 'Lassen', 'Los Angeles',
  'Madera', 'Marin', 'Mariposa', 'Mendocino', 'Merced', 'Modoc', 'Mono',
  'Monterey', 'Napa', 'Nevada', 'Orange', 'Placer', 'Plumas', 'Riverside',
  'Sacramento', 'San Benito', 'San Bernardino', 'San Diego', 'San Francisco',
  'San Joaquin', 'San Luis Obispo', 'San Mateo', 'Santa Barbara', 'Santa Clara',
  'Santa Cruz', 'Shasta', 'Sierra', 'Siskiyou', 'Solano', 'Sonoma', 'Stanislaus',
  'Sutter', 'Tehama', 'Trinity', 'Tulare', 'Tuolumne', 'Ventura', 'Yolo', 'Yuba',
]
