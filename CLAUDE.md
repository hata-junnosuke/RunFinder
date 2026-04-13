# RunFinder

現在地から指定距離のランニングコースを動的生成するアプリ。

必ず日本語で回答してください。
あいまいな点や不明点があれば、AskUserQuestionツールを使って質問してください。

## 技術スタック

Next.js (App Router) / Hono on Bun / Drizzle ORM / PostgreSQL / Google Maps API / Docker Compose / Vercel (デプロイ)

## ⚠️ Dockerコンテナ内実行の原則

すべてのコマンドは必ずDockerコンテナ内で実行する。例外: `gh`, `git`, `vercel`

## ルール構成

詳細は `.claude/rules/` 参照（パス条件で自動ロード）。
