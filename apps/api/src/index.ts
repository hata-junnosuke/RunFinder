import { Hono } from 'hono'
import { cors } from 'hono/cors'
import { courseRoutes } from './routes/courses'

const app = new Hono()

app.use('/api/*', cors())

app.get('/api/health', (c) => {
  return c.json({ status: 'ok' })
})

app.route('/api/courses', courseRoutes)

export default {
  port: 3002,
  fetch: app.fetch,
}
