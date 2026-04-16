import { pgTable, uuid, real, jsonb, integer, timestamp } from 'drizzle-orm/pg-core'

export const courses = pgTable('courses', {
  id: uuid('id').defaultRandom().primaryKey(),
  distanceKm: real('distance_km').notNull(),
  startLat: real('start_lat').notNull(),
  startLng: real('start_lng').notNull(),
  routeJson: jsonb('route_json'),
  estimatedTimeMin: integer('estimated_time_min'),
  createdAt: timestamp('created_at').defaultNow().notNull(),
})
