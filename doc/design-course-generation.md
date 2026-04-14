# コース生成アルゴリズム 設計書

## 概要

現在地と指定距離から周回ランニングコースを動的に生成する。
Google Directions API（mode: walking）を使用してルートを取得する。

## 周回コース生成フロー

1. 出発地点の座標を取得
2. 指定距離から半径を算出（`distance_km / (2 * π)` を目安）
3. ランダムな角度で3つの中間ウェイポイントを生成
4. Google Directions API に `origin → waypoint1 → waypoint2 → waypoint3 → origin` のルートをリクエスト
5. レスポンスの総距離と overview_polyline を返却

## 再生成

ユーザーが「別のコースを生成」を押した場合、中間ウェイポイントの角度をランダムに変更して再度APIリクエストを行う。

## 使用API

- Google Directions API
  - mode: `walking`
  - waypoints: 3点（中間経由地点）
  - origin / destination: 同一座標（周回）
