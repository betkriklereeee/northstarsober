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

  const flyTo = useCallback((listing: Listing) => {
    mapRef.current?.flyTo({
      center: [listing.lng ?? 0, listing.lat ?? 0],
      zoom: 14,
      duration: 800,
    })
  }, [])

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
      style: 'mapbox://styles/mapbox/light-v11',
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
          'circle-color': '#4a7fa5',
          'circle-radius': ['step', ['get', 'point_count'], 16, 5, 22, 20, 28],
          'circle-opacity': 0.9,
          'circle-stroke-width': 2,
          'circle-stroke-color': '#ffffff',
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
        paint: { 'text-color': '#ffffff' },
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
            '#6b9fc4',
            '#4a7fa5',
          ],
          'circle-radius': 9,
          'circle-stroke-width': 2,
          'circle-stroke-color': '#ffffff',
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

      // Click individual pin
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
            <div style="padding: 12px;">
              <p style="font-size: 11px; color: #718096; margin: 0 0 2px 0;">${city} · ${formatGender(gender as any)}</p>
              <p style="font-weight: 600; font-size: 14px; color: #0f1923; margin: 0 0 4px 0;">${name}</p>
              <p style="font-size: 12px; color: #4a7fa5; margin: 0 0 8px 0;">${formatPrice(price_min, price_max)}</p>
              <a href="/listings/${slug}" style="font-size: 12px; color: #4a7fa5; text-decoration: underline;">View details →</a>
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

  useEffect(() => {
    const map = mapRef.current
    if (!map || !map.isStyleLoaded()) return
    const source = map.getSource('listings') as mapboxgl.GeoJSONSource | undefined
    if (source) source.setData(listingsToGeoJSON(listings))
  }, [listings])

  useEffect(() => {
    const map = mapRef.current
    if (!map || !map.isStyleLoaded()) return
    if (map.getLayer('unclustered-point')) {
      map.setPaintProperty('unclustered-point', 'circle-color', [
        'case',
        ['==', ['get', 'id'], selectedId ?? ''],
        '#6b9fc4',
        '#4a7fa5',
      ])
    }
  }, [selectedId])

  return <div ref={containerRef} className="w-full h-full" />
}
