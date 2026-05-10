'use client'

import { useEffect, useRef, useCallback } from 'react'
import mapboxgl from 'mapbox-gl'
import 'mapbox-gl/dist/mapbox-gl.css'
import { listingsToGeoJSON, formatPrice, formatGender } from '@/lib/utils'
import type { Listing } from '@/lib/supabase/types'

interface MapViewProps {
  listings: Listing[]
  selectedId: string | null
  onSelectListing: (id: string) => void
}

export default function MapView({ listings, selectedId, onSelectListing }: MapViewProps) {
  const containerRef = useRef<HTMLDivElement>(null)
  const mapRef = useRef<mapboxgl.Map | null>(null)
  const popupRef = useRef<mapboxgl.Popup | null>(null)
  const markersRef = useRef<Map<string, mapboxgl.Marker>>(new Map())

  const flyTo = useCallback((listing: Listing) => {
    mapRef.current?.flyTo({
      center: [listing.lng, listing.lat],
      zoom: 14,
      duration: 800,
    })
  }, [])

  // Fly to selected listing from outside
  useEffect(() => {
    if (!selectedId || !mapRef.current) return
    const listing = listings.find((l) => l.id === selectedId)
    if (listing) flyTo(listing)
  }, [selectedId, listings, flyTo])

  useEffect(() => {
    if (!containerRef.current || mapRef.current) return

    mapboxgl.accessToken = process.env.NEXT_PUBLIC_MAPBOX_TOKEN!

    const map = new mapboxgl.Map({
      container: containerRef.current,
      style: 'mapbox://styles/mapbox/dark-v11',
      center: [-119.4, 36.8],
      zoom: 5.5,
      minZoom: 4,
    })

    mapRef.current = map

    map.addControl(new mapboxgl.NavigationControl({ showCompass: false }), 'top-right')

    map.on('load', () => {
      const geojson = listingsToGeoJSON(listings)

      map.addSource('listings', {
        type: 'geojson',
        data: geojson,
        cluster: true,
        clusterMaxZoom: 11,
        clusterRadius: 40,
      })

      // Cluster circles
      map.addLayer({
        id: 'clusters',
        type: 'circle',
        source: 'listings',
        filter: ['has', 'point_count'],
        paint: {
          'circle-color': '#7a9e7e',
          'circle-radius': ['step', ['get', 'point_count'], 16, 5, 22, 20, 28],
          'circle-opacity': 0.9,
          'circle-stroke-width': 2,
          'circle-stroke-color': '#0f0f0f',
        },
      })

      // Cluster count labels
      map.addLayer({
        id: 'cluster-count',
        type: 'symbol',
        source: 'listings',
        filter: ['has', 'point_count'],
        layout: {
          'text-field': '{point_count_abbreviated}',
          'text-font': ['DIN Offc Pro Medium', 'Arial Unicode MS Bold'],
          'text-size': 11,
        },
        paint: { 'text-color': '#0f0f0f' },
      })

      // Individual points
      map.addLayer({
        id: 'unclustered-point',
        type: 'circle',
        source: 'listings',
        filter: ['!', ['has', 'point_count']],
        paint: {
          'circle-color': [
            'case',
            ['==', ['get', 'id'], selectedId ?? ''],
            '#9ab89e',
            '#7a9e7e',
          ],
          'circle-radius': 9,
          'circle-stroke-width': 2,
          'circle-stroke-color': '#0f0f0f',
          'circle-opacity': 0.95,
        },
      })

      // Click cluster → zoom in
      map.on('click', 'clusters', (e) => {
        const features = map.queryRenderedFeatures(e.point, { layers: ['clusters'] })
        if (!features[0]) return
        const clusterId = features[0].properties?.cluster_id
        const source = map.getSource('listings') as mapboxgl.GeoJSONSource
        source.getClusterExpansionZoom(clusterId, (err, zoom) => {
          if (err || zoom === null) return
          const coords = (features[0].geometry as GeoJSON.Point).coordinates
          map.easeTo({ center: [coords[0], coords[1]], zoom })
        })
      })

      // Click individual pin → show popup + highlight card
      map.on('click', 'unclustered-point', (e) => {
        const feature = e.features?.[0]
        if (!feature) return
        const { id, name, city, gender, price_min, price_max, slug } = feature.properties as {
          id: string; name: string; city: string; gender: string
          price_min: number | null; price_max: number | null; slug: string
        }
        const coords = (feature.geometry as GeoJSON.Point).coordinates as [number, number]

        popupRef.current?.remove()
        popupRef.current = new mapboxgl.Popup({ closeButton: true, maxWidth: '240px' })
          .setLngLat(coords)
          .setHTML(`
            <div class="p-3">
              <p class="text-xs text-[#a09b96] mb-0.5">${city} · ${formatGender(gender as any)}</p>
              <p class="font-medium text-sm text-[#f0ede8] mb-1">${name}</p>
              <p class="text-xs text-[#7a9e7e] mb-2">${formatPrice(price_min, price_max)}</p>
              <a href="/listings/${slug}" class="text-xs text-[#7a9e7e] hover:text-[#9ab89e] underline">View details →</a>
            </div>
          `)
          .addTo(map)

        onSelectListing(id)
      })

      map.on('mouseenter', 'clusters', () => { map.getCanvas().style.cursor = 'pointer' })
      map.on('mouseleave', 'clusters', () => { map.getCanvas().style.cursor = '' })
      map.on('mouseenter', 'unclustered-point', () => { map.getCanvas().style.cursor = 'pointer' })
      map.on('mouseleave', 'unclustered-point', () => { map.getCanvas().style.cursor = '' })
    })

    return () => {
      map.remove()
      mapRef.current = null
    }
  }, []) // eslint-disable-line react-hooks/exhaustive-deps

  // Update GeoJSON when listings change
  useEffect(() => {
    const map = mapRef.current
    if (!map || !map.isStyleLoaded()) return
    const source = map.getSource('listings') as mapboxgl.GeoJSONSource | undefined
    if (source) {
      source.setData(listingsToGeoJSON(listings))
    }
  }, [listings])

  // Update selected pin color
  useEffect(() => {
    const map = mapRef.current
    if (!map || !map.isStyleLoaded()) return
    if (map.getLayer('unclustered-point')) {
      map.setPaintProperty('unclustered-point', 'circle-color', [
        'case',
        ['==', ['get', 'id'], selectedId ?? ''],
        '#9ab89e',
        '#7a9e7e',
      ])
    }
  }, [selectedId])

  return (
    <div ref={containerRef} className="w-full h-full" />
  )
}
