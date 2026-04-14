---
description: Hono APIサーバーのコーディングルール
globs:
  - "apps/api/**"
---

# Hono API ルール

## 基本方針
- Hono on Bun でAPIサーバーを構築
- TypeScript strict mode
- 関数は小さく、単一責任

## レスポンス統一フォーマット
```typescript
{ success: boolean, data?: T, error?: string }
```

## ポート

API サーバーは **3002** で起動する（3000は他プロジェクトで使用中のため3001から採番）。

## API設計 (Phase 1)

```
POST /api/courses/generate
  Body: { lat: number, lng: number, distance_km: number, course_type: string }

GET  /api/courses/:id

GET  /api/health
```

## バリデーション
- リクエストのバリデーションはZodで行う
- APIの入口でバリデーション、内部コードは信頼する

## エラーハンドリング
- HTTPステータスコードを適切に返す
- エラーメッセージはユーザーフレンドリーに
