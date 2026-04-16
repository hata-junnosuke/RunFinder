# RunFinder 初期セットアップガイド

手動でコマンドを実行してプロジェクトをセットアップする手順書。

## 前提条件

以下がインストール済みであること:

- Docker Desktop
- Node.js / npm
- Bun
- Git

---

## Step 1: モノレポのディレクトリ構造を作成

```bash
cd /Users/hatajunnosuke/Desktop/RunFinder

# フロントエンド（Next.js）用
mkdir -p apps/web

# バックエンドAPI（Hono on Bun）用
mkdir -p apps/api/src

# 共有パッケージ（Drizzle ORM / DB）用
mkdir -p packages/db/src
```

## Step 2: ルートの package.json を作成

```bash
npm init -y
```

作成後、`package.json` を以下のように編集:

```json
{
  "name": "runfinder",
  "private": true,
  "workspaces": ["apps/*", "packages/*"]
}
```

## Step 3: Next.js フロントエンドのセットアップ（apps/web）

```bash
cd apps

# Next.js 公式CLIで作成
npx create-next-app@latest web
```

対話プロンプトでの選択:

| 質問 | 選択 |
|---|---|
| TypeScript | Yes |
| ESLint | Yes |
| Tailwind CSS | Yes |
| `src/` directory | Yes |
| App Router | Yes |
| Turbopack for development | Yes |
| Import alias | No（デフォルトの `@/*`） |

## Step 4: Hono API サーバーのセットアップ（apps/api）

```bash
cd /Users/hatajunnosuke/Desktop/RunFinder/apps

# Hono 公式テンプレートから作成
bun create hono@latest api
```

対話プロンプトでの選択:

| 質問 | 選択 |
|---|---|
| Which template do you want to use? | `bun` |

```bash
cd api

# 追加パッケージ
bun add zod
```

テンプレートで `src/index.ts` が自動生成される。ポートやルートを編集:

```typescript
import { Hono } from 'hono'

const app = new Hono()

app.get('/api/health', (c) => {
  return c.json({ status: 'ok' })
})

export default {
  port: 3002,
  fetch: app.fetch,
}
```

## Step 5: Drizzle ORM のセットアップ（packages/db）

[Drizzle公式 Get Started（Bun SQL）](https://orm.drizzle.team/docs/get-started/bun-sql-new) に準拠。
Bun内蔵のSQLクライアント（`drizzle-orm/bun-sql`）を使用する。

```bash
cd /Users/hatajunnosuke/Desktop/RunFinder/packages/db

bun init

# Drizzle ORM をインストール（Bun内蔵SQLを使うため外部ドライバ不要）
bun add drizzle-orm
bun add -d drizzle-kit @types/bun
```

### ディレクトリ構成

```
packages/db/
├── src/
│   ├── index.ts          # DB接続クライアント（エクスポート）
│   └── db/
│       └── schema.ts     # テーブル定義
├── drizzle/              # マイグレーションファイル（自動生成）
├── drizzle.config.ts     # Drizzle Kit 設定
└── package.json
```

### packages/db/src/db/schema.ts

```typescript
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
```

### packages/db/src/index.ts

```typescript
import { drizzle } from 'drizzle-orm/bun-sql'
import * as schema from './db/schema'

export const db = drizzle(process.env.DATABASE_URL!, { schema })
export * from './db/schema'
```

### packages/db/drizzle.config.ts

```typescript
import { defineConfig } from 'drizzle-kit'

export default defineConfig({
  dialect: 'postgresql',
  schema: './src/db/schema.ts',
  out: './drizzle',
  dbCredentials: {
    url: process.env.DATABASE_URL!,
  },
})
```

### package.json にスクリプトを追加

```json
{
  "scripts": {
    "db:push": "drizzle-kit push",
    "db:generate": "drizzle-kit generate",
    "db:migrate": "drizzle-kit migrate",
    "db:studio": "drizzle-kit studio"
  }
}
```

## Step 6: 環境変数の設定

```bash
cd /Users/hatajunnosuke/Desktop/RunFinder

cat << 'EOF' > .env.example
GOOGLE_MAPS_API_KEY=
DATABASE_URL=postgresql://postgres:postgres@db:5432/runfinder
WEB_PORT=3001
API_PORT=3002
NEXT_PUBLIC_API_URL=http://localhost:3002
NEXT_PUBLIC_GOOGLE_MAPS_API_KEY=
EOF

# .env を作成して実際の値を入れる
cp .env.example .env
```

## Step 7: docker-compose.yml を作成

```yaml
services:
  db:
    image: postgres:17
    environment:
      POSTGRES_USER: postgres
      POSTGRES_PASSWORD: postgres
      POSTGRES_DB: runfinder
    ports:
      - "5433:5432"
    volumes:
      - postgres_data:/var/lib/postgresql/data

  api:
    build:
      context: .
      dockerfile: apps/api/Dockerfile
    ports:
      - "${API_PORT:-3002}:3002"
    environment:
      - DATABASE_URL=postgresql://postgres:postgres@db:5432/runfinder
      - GOOGLE_MAPS_API_KEY=${GOOGLE_MAPS_API_KEY}
    depends_on:
      - db
    volumes:
      - ./apps/api:/app/apps/api
      - ./packages:/app/packages

  web:
    build:
      context: .
      dockerfile: apps/web/Dockerfile
    ports:
      - "${WEB_PORT:-3001}:3000"
    environment:
      - NEXT_PUBLIC_API_URL=http://localhost:${API_PORT:-3002}
      - NEXT_PUBLIC_GOOGLE_MAPS_API_KEY=${NEXT_PUBLIC_GOOGLE_MAPS_API_KEY}
    depends_on:
      - api
    volumes:
      - ./apps/web:/app/apps/web

volumes:
  postgres_data:
```

## Step 8: Dockerfile を作成

### apps/api/Dockerfile

```dockerfile
FROM oven/bun:1.2

WORKDIR /app

COPY apps/api/package.json apps/api/bun.lockb* ./apps/api/
COPY packages/db/package.json ./packages/db/

RUN cd apps/api && bun install

COPY apps/api ./apps/api
COPY packages/db ./packages/db

WORKDIR /app/apps/api

CMD ["bun", "run", "src/index.ts"]
```

### apps/web/Dockerfile

```dockerfile
FROM node:22

WORKDIR /app

COPY apps/web/package.json apps/web/package-lock.json* ./apps/web/

RUN cd apps/web && npm install

COPY apps/web ./apps/web

WORKDIR /app/apps/web

CMD ["npm", "run", "dev"]
```

## Step 9: Docker Compose で起動

```bash
cd /Users/hatajunnosuke/Desktop/RunFinder

# ビルド＆起動
docker compose up --build

# バックグラウンドで起動したい場合
docker compose up --build -d
```

## Step 10: 動作確認

```bash
# API ヘルスチェック
curl http://localhost:3002/api/health
# → {"status":"ok"} が返ればOK

# フロントエンド
# ブラウザで http://localhost:3001 にアクセス
# → Next.js のデフォルトページが表示されればOK

# DB接続確認
docker compose exec db psql -U postgres -d runfinder -c "SELECT 1;"
```

## Step 11: Drizzle マイグレーション実行

開発時は `push` で素早くスキーマを反映できる。本番向けには `generate` → `migrate` を使う。

```bash
# 方法1: 開発環境向け（スキーマを直接DBに反映）
docker compose exec api bunx drizzle-kit push

# 方法2: 本番環境向け（マイグレーションファイル経由）
docker compose exec api bunx drizzle-kit generate   # SQLファイル生成
docker compose exec api bunx drizzle-kit migrate     # 適用
```

## 補足: .gitignore に追加すべき項目

```
node_modules/
.env
.next/
dist/
postgres_data/
```
