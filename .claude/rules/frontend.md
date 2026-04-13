---
description: Next.jsフロントエンドのコーディングルール
globs:
  - "apps/web/**"
---

# Next.js ルール

## 基本方針
- App Router を使用
- Server Components優先、`"use client"` は必要最小限

## ディレクトリ構成
- `app/` はルーティングと特殊ファイルに専念（`page.tsx`, `layout.tsx`, `loading.tsx`, `error.tsx`等）
- ドメインロジックは `features/` にドメイン単位で集約
- 共通UIコンポーネントは `components/` に配置
- 共通ユーティリティは `lib/` に配置

## Google Maps
- `@vis.gl/react-google-maps` または `@react-google-maps/api` を使用
- APIキーは `NEXT_PUBLIC_GOOGLE_MAPS_API_KEY` 環境変数で管理

## デプロイ
- Vercelにデプロイする
- 環境変数はVercelのダッシュボードで設定
