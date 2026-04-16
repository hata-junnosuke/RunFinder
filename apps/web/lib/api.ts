const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3002'

export interface CourseData {
  route: {
    overview_polyline: string
    start: { lat: number; lng: number }
  }
  distance_km: number
}

interface ApiSuccess {
  success: true
  data: CourseData
}

interface ApiError {
  success: false
  error: string
}

type ApiResponse = ApiSuccess | ApiError

export async function generateCourse(
  lat: number,
  lng: number,
  distanceKm: number,
): Promise<CourseData> {
  const res = await fetch(`${API_URL}/api/courses/generate`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ lat, lng, distance_km: distanceKm }),
  })

  const json: ApiResponse = await res.json()

  if (!json.success) {
    throw new Error(json.error)
  }

  return json.data
}
