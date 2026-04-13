---
description: Drizzle ORM・データベースのルール
globs:
  - "packages/db/**"
---

# データベースルール

## ORM
- Drizzle ORM を使用
- スキーマは `packages/db/src/schema.ts` に定義
- マイグレーションは `drizzle-kit` で管理

## DB
- PostgreSQL を使用（Docker Compose で起動）
- 接続文字列は `DATABASE_URL` 環境変数で管理

## テーブル設計 (Phase 1)

```
courses:
  - id (uuid, PK)
  - distance_km (real)
  - start_lat (real)
  - start_lng (real)
  - route_json (jsonb)  # Google Directions APIのレスポンス
  - estimated_time_min (integer)
  - created_at (timestamp)
```
