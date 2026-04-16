import { Hono } from 'hono'
import { handle } from 'hono/vercel'
import { generateWaypoints } from '@/lib/api-server/waypoints'
import { fetchDirections } from '@/lib/api-server/directions'

const app = new Hono().basePath('/api')

// ヘルスチェック
app.get('/health', (c) => {
  return c.json({ status: 'ok' })
})

// コース生成
app.post('/courses/generate', async (c) => {
  const body = await c.req.json()

  const lat = Number(body.lat)
  const lng = Number(body.lng)
  const distance_km = Number(body.distance_km)

  if (
    isNaN(lat) || lat < -90 || lat > 90 ||
    isNaN(lng) || lng < -180 || lng > 180 ||
    isNaN(distance_km) || distance_km < 1 || distance_km > 30
  ) {
    return c.json({ success: false, error: 'リクエストパラメータが不正です。' }, 400)
  }

  try {
    const waypoints = generateWaypoints(lat, lng, distance_km)
    const result = await fetchDirections({ lat, lng }, waypoints)

    return c.json({
      success: true,
      data: {
        route: {
          overview_polyline: result.overview_polyline,
          start: { lat, lng },
        },
        distance_km: result.distance_km,
      },
    })
  } catch (e) {
    const message = e instanceof Error ? e.message : 'ルートを生成できませんでした。'
    return c.json({ success: false, error: message }, 500)
  }
})

export const GET = handle(app)
export const POST = handle(app)
