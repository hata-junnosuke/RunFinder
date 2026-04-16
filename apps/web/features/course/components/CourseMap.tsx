'use client'

import { APIProvider, Map, useMap } from '@vis.gl/react-google-maps'
import { useEffect, useRef } from 'react'
import { decodePolyline } from '@/lib/decode-polyline'

const API_KEY = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY || ''

interface CourseMapProps {
  center: { lat: number; lng: number }
  polyline: string | null
  onMapClick: (lat: number, lng: number) => void
}

function createStartIcon(): google.maps.Symbol {
  return {
    path: google.maps.SymbolPath.CIRCLE,
    scale: 16,
    fillColor: '#2563eb',
    fillOpacity: 1,
    strokeColor: '#ffffff',
    strokeWeight: 4,
  }
}

function MapContent({ center, polyline, onMapClick }: CourseMapProps) {
  const map = useMap()
  const polylineRef = useRef<google.maps.Polyline | null>(null)
  const markerRef = useRef<google.maps.Marker | null>(null)

  // クリックで出発地点を変更
  useEffect(() => {
    if (!map) return
    const listener = map.addListener('click', (e: google.maps.MapMouseEvent) => {
      if (e.latLng) {
        onMapClick(e.latLng.lat(), e.latLng.lng())
      }
    })
    return () => listener.remove()
  }, [map, onMapClick])

  // スタート地点マーカー
  useEffect(() => {
    if (!map) return

    if (markerRef.current) {
      markerRef.current.setPosition(center)
    } else {
      markerRef.current = new google.maps.Marker({
        map,
        position: center,
        icon: createStartIcon(),
        label: {
          text: 'S',
          color: '#ffffff',
          fontSize: '14px',
          fontWeight: 'bold',
        },
        title: 'スタート / ゴール',
        zIndex: 10,
      })
    }

    map.panTo(center)

    return () => {
      if (markerRef.current) {
        markerRef.current.setMap(null)
        markerRef.current = null
      }
    }
  }, [map, center])

  // ルートのポリライン描画
  useEffect(() => {
    if (!map) return

    if (polylineRef.current) {
      polylineRef.current.setMap(null)
      polylineRef.current = null
    }

    if (!polyline) return

    const path = decodePolyline(polyline)

    const arrowIcon: google.maps.IconSequence = {
      icon: {
        path: google.maps.SymbolPath.FORWARD_CLOSED_ARROW,
        scale: 3,
        fillColor: '#1d4ed8',
        fillOpacity: 1,
        strokeColor: '#1d4ed8',
        strokeWeight: 1,
      },
      offset: '0',
      repeat: '100px',
    }

    polylineRef.current = new google.maps.Polyline({
      path,
      geodesic: true,
      strokeColor: '#2563eb',
      strokeOpacity: 0.8,
      strokeWeight: 4,
      icons: [arrowIcon],
      map,
    })

    const bounds = new google.maps.LatLngBounds()
    path.forEach((p) => bounds.extend(p))
    map.fitBounds(bounds, 50)

    return () => {
      if (polylineRef.current) {
        polylineRef.current.setMap(null)
        polylineRef.current = null
      }
    }
  }, [map, polyline])

  return (
    <Map
      defaultCenter={center}
      defaultZoom={14}
      gestureHandling="greedy"
      disableDefaultUI={false}
      zoomControl={true}
      className="w-full h-full"
    />
  )
}

export default function CourseMap(props: CourseMapProps) {
  return (
    <APIProvider apiKey={API_KEY}>
      <MapContent {...props} />
    </APIProvider>
  )
}
