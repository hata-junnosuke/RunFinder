---
description: Docker環境でのコマンド実行ルール
globs:
  - "docker-compose.yml"
  - "Dockerfile*"
---

# Docker実行ルール

すべてのコマンドは必ずDockerコンテナ内で実行する。

```bash
# ✅ 正しい
docker compose exec api bun test
docker compose exec api bun run dev
docker compose exec web npm run dev
docker compose exec web npm run lint

# ❌ 間違い（ローカル実行禁止）
bun test
npm run dev
```

**例外（ローカル実行OK）:**
- `gh` コマンド
- `git` コマンド
- `vercel` コマンド
