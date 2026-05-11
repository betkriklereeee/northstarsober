import { MetadataRoute } from 'next'
import { createAdminClient } from '@/lib/supabase/server'

export const revalidate = 3600

const BASE = 'https://cashpaysober.com'

const STATIC_ROUTES: MetadataRoute.Sitemap = [
  { url: BASE, priority: 1.0, changeFrequency: 'daily' },
  { url: `${BASE}/about`, priority: 0.7, changeFrequency: 'monthly' },
  { url: `${BASE}/faq`, priority: 0.7, changeFrequency: 'monthly' },
  { url: `${BASE}/for-operators`, priority: 0.7, changeFrequency: 'monthly' },
  { url: `${BASE}/resources`, priority: 0.6, changeFrequency: 'monthly' },
  { url: `${BASE}/privacy`, priority: 0.3, changeFrequency: 'yearly' },
  { url: `${BASE}/terms`, priority: 0.3, changeFrequency: 'yearly' },
]

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  let listingRoutes: MetadataRoute.Sitemap = []

  try {
    const supabase = createAdminClient()
    const { data } = await supabase
      .from('listings')
      .select('slug, updated_at')
      .eq('status', 'live')

    if (data) {
      listingRoutes = data.map((l) => ({
        url: `${BASE}/listings/${l.slug}`,
        lastModified: new Date(l.updated_at),
        changeFrequency: 'weekly' as const,
        priority: 0.8,
      }))
    }
  } catch {
    // DB unavailable at build time — return static routes only
  }

  return [...STATIC_ROUTES, ...listingRoutes]
}
