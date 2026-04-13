#!/bin/bash
set -euo pipefail

# Claude Code PreToolUse hook: git commit時にテスト・リントを実行

deny() {
  local reason="$1"
  local output="$2"
  echo "$output" >&2
  jq -n --arg reason "$reason" '{
    hookSpecificOutput: {
      hookEventName: "PreToolUse",
      permissionDecision: "deny",
      permissionDecisionReason: $reason
    }
  }'
  exit 0
}

# API tests
TEST_OUT=$(docker compose exec -T api bun test 2>&1) || deny "API tests failed. Fix test failures before committing." "$TEST_OUT"
TEST_SUMMARY=$(echo "$TEST_OUT" | tail -3 || true)
TEST_SUMMARY="${TEST_SUMMARY:-OK}"

# Next.js lint
LINT_OUT=$(docker compose exec -T web npm run lint 2>&1) || deny "Next.js lint failed. Fix lint errors before committing." "$LINT_OUT"

# All checks passed
SUMMARY="All checks passed. [Tests] $TEST_SUMMARY [Lint] OK"
jq -n --arg ctx "$SUMMARY" '{
  hookSpecificOutput: {
    hookEventName: "PreToolUse",
    permissionDecision: "allow",
    additionalContext: $ctx
  }
}'
