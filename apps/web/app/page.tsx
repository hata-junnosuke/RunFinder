'use client'

import { useState, useCallback, useEffect } from 'react'
import dynamic from 'next/dynamic'
import ControlPanel from '@/features/course/components/ControlPanel'
import { generateCourse, type CourseData } from '@/lib/api'

const CourseMap = dynamic(
  () => import('@/features/course/components/CourseMap'),
  { ssr: false },
)
const DEFAULT_CENTER = { lat: 35.6812, lng: 139.7671 } // 東京駅

export default function Home() {
  const [center, setCenter] = useState(DEFAULT_CENTER)
  const [distanceKm, setDistanceKm] = useState(5)
  const [course, setCourse] = useState<CourseData | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  // 現在地取得
  useEffect(() => {
    if (!navigator.geolocation) return
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        setCenter({ lat: pos.coords.latitude, lng: pos.coords.longitude })
      },
      () => {
        // 許可拒否 → デフォルト位置（東京駅）のまま
      },
      { enableHighAccuracy: true, timeout: 10000 },
    )
  }, [])

  const handleGenerate = useCallback(async () => {
    setIsLoading(true)
    setError(null)
    try {
      const data = await generateCourse(center.lat, center.lng, distanceKm)
      setCourse(data)
    } catch (e) {
      setError(e instanceof Error ? e.message : 'エラーが発生しました')
      setCourse(null)
    } finally {
      setIsLoading(false)
    }
  }, [center, distanceKm])

  const handleMapClick = useCallback((lat: number, lng: number) => {
    setCenter({ lat, lng })
  }, [])

  return (
    <div className="flex flex-col h-full md:flex-row">
      {/* 地図エリア */}
      <div className="h-[60vh] md:h-auto md:flex-1 relative">
        <CourseMap
          center={center}
          polyline={course?.route.overview_polyline ?? null}
          onMapClick={handleMapClick}
        />
      </div>

      {/* 操作パネル */}
      <div className="flex-1 md:flex-none md:w-80 md:border-l border-zinc-200 dark:border-zinc-700 overflow-y-auto">
        <ControlPanel
          distanceKm={distanceKm}
          onDistanceChange={setDistanceKm}
          onGenerate={handleGenerate}
          onRegenerate={handleGenerate}
          isLoading={isLoading}
          resultDistanceKm={course?.distance_km ?? null}
          hasRoute={course !== null}
        />
        {error && (
          <p className="px-4 pb-4 text-sm text-red-600 dark:text-red-400">{error}</p>
        )}
      </div>
    </div>
  )
}
