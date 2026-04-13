---
name: solve-issue
description: Issue番号を引数で受け取り、3エージェント構成（Planner→Generator→Evaluator）でIssueを自動解決する
user-invocable: true
disable-model-invocation: true
---

## 引数

- `$ARGUMENTS` — Issue番号（例: `123`）。数値であること。
- 引数がない場合はAskUserQuestionでIssue番号を質問する。

## 定数

- 仕様書パス: `.claude/tmp/spec-$ARGUMENTS.md`
- 修正ループ上限: 3回

## 手順

### Phase 0: 準備

1. `gh issue view $ARGUMENTS --json title,body,labels,assignees,number` でIssue内容を取得する
2. Issueの内容を確認し、不明点があればAskUserQuestionで質問する
3. mainブランチから新規ブランチを作成する（CLAUDE.mdの命名規則に従う）

### Phase 1: 計画（Planner エージェント）

4. サブエージェント `planner` を起動する。以下の情報を渡す:
   - Issue番号、タイトル、本文
   - Issueのラベル（Feature / Bug）
   - 仕様書の出力先パス
5. Plannerの結果を確認する:
   - **不要と判断された場合**: 理由と代替案をユーザーに報告し、処理を終了する
   - **仕様書が生成された場合**: 仕様書の内容をユーザーに提示し、AskUserQuestionで承認を得る

### Phase 2: 実装（Generator エージェント）

6. サブエージェント `generator` を起動する。仕様書ファイルのパスを渡す
7. Generatorが仕様書に基づいてTDDで実装する

### Phase 3: 評価（Evaluator エージェント）

8. サブエージェント `evaluator` を起動する。仕様書ファイルのパスを渡す
9. 評価結果が **FAIL** の場合:
   - 問題内容をまとめてGeneratorを再起動し修正
   - 再度Evaluatorで評価（**最大3回まで**）
   - 3回で解決しない場合はユーザーに報告
10. 評価結果が **ALL PASS** の場合、完了処理へ進む

### 完了

11. 「作業完了しました」と報告する
12. 仕様書ファイルを削除する
