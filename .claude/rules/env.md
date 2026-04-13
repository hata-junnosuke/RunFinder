---
description: 環境変数の管理ルール
globs:
  - ".env*"
  - "docker-compose.yml"
---

# 環境変数

`.env` で管理し、`.env.example` をコミットする。`.env` 自体はコミットしない。

```
GOOGLE_MAPS_API_KEY=           # Google Maps API キー（サーバー用）
DATABASE_URL=                  # PostgreSQL接続文字列
PORT=3001                      # API サーバーポート
NEXT_PUBLIC_API_URL=           # フロントからAPIへのURL
NEXT_PUBLIC_GOOGLE_MAPS_API_KEY=  # フロント用Google Mapsキー
```
