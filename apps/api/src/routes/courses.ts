import { Hono } from 'hono'
import { z } from 'zod/v4'
import { generateWaypoints } from '../lib/waypoints'
import { fetchDirections } from '../lib/directions'

export const courseRoutes = new Hono()

const generateSchema = z.object({
  lat: z.number().min(-90).max(90),
  lng: z.number().min(-180).max(180),
  distance_km: z.number().min(1).max(30),
})

courseRoutes.post('/generate', async (c) => {
  const body = await c.req.json()
  const parsed = generateSchema.safeParse(body)

  if (!parsed.success) {
    return c.json({ success: false, error: 'リクエストパラメータが不正です。' }, 400)
  }

  const { lat, lng, distance_km } = parsed.data

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
