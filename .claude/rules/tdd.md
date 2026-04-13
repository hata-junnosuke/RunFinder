---
description: テスト駆動開発のルール
globs:
  - "**/*.test.ts"
  - "**/*.test.tsx"
  - "apps/api/src/**"
  - "apps/web/src/**"
---

# TDD（テスト駆動開発）

すべての機能開発はTDDで行う。

1. **Red** — 先にテストを書き、失敗を確認する
2. **Green** — テストを通す最小限の実装を書く
3. **Refactor** — テストが通った状態でリファクタリングする

## テスト配置

- テストファイルは対象ファイルと同階層に `*.test.ts` (or `*.test.tsx`) で配置
- テストランナーは `bun test` を使用
- テスト実行: `docker compose exec api bun test`
