type LatLng = { lat: number; lng: number }

interface DirectionsResult {
  overview_polyline: string
  distance_km: number
}

/**
 * Google Directions API を呼び出し、周回ルートを取得する。
 * origin と destination を同一座標にし、waypoints を経由する。
 */
export async function fetchDirections(
  origin: LatLng,
  waypoints: LatLng[],
): Promise<DirectionsResult> {
  const apiKey = process.env.GOOGLE_MAPS_API_KEY
  if (!apiKey) {
    throw new Error('GOOGLE_MAPS_API_KEY が設定されていません')
  }

  const waypointsParam = waypoints
    .map((wp) => `${wp.lat},${wp.lng}`)
    .join('|')

  const url = new URL('https://maps.googleapis.com/maps/api/directions/json')
  url.searchParams.set('origin', `${origin.lat},${origin.lng}`)
  url.searchParams.set('destination', `${origin.lat},${origin.lng}`)
  url.searchParams.set('waypoints', waypointsParam)
  url.searchParams.set('mode', 'walking')
  url.searchParams.set('key', apiKey)

  const res = await fetch(url.toString())
  const data = await res.json() as {
    status: string
    routes: {
      overview_polyline: { points: string }
      legs: { distance: { value: number } }[]
    }[]
  }

  if (data.status !== 'OK' || !data.routes.length) {
    const apiError = (data as { error_message?: string }).error_message
    console.error('Directions API error:', data.status, apiError)
    throw new Error(apiError || 'ルートを生成できませんでした。別の距離で試してください。')
  }

  const route = data.routes[0]
  const totalMeters = route.legs.reduce((sum, leg) => sum + leg.distance.value, 0)

  return {
    overview_polyline: route.overview_polyline.points,
    distance_km: Math.round((totalMeters / 1000) * 10) / 10,
  }
}
