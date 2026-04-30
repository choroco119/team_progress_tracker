# 時刻同期に依存しない競合検知の改善計画 (Robust Sync Implementation Plan)

PC間の時刻ズレ（クロックドリフト）による更新検知漏れを防ぐため、比較ロジックを改善します。

## 現状の課題
- `file.lastModified`（ファイルサーバー時刻）と `new Date()`（ローカルPC時刻）を直接比較している箇所があり、PCの時計がズレていると更新を検知できない、または不要な警告が出る可能性がある。

## 解決策
1.  **ファイルシステム時刻の追跡**: 
    - グローバル変数 `lastFsModified` を導入。
    - ファイルを読み込んだ際、または書き込みに成功した際に、その時点の `file.lastModified` を保存する。
2.  **変更検知のトリガー変更**:
    - `lastFsModified !== file.lastModified` を変更検知の第一条件とする。
    - ファイルシステムの時刻が1秒でも異なれば「変更の可能性あり」と判断し、中身の `lastUpdated` 文字列（ID）をチェックする。

## 変更箇所 (`app.js`)
- グローバル変数 `lastFsModified` の追加。
- `loadFromFolder`: 読み込み成功時に `lastFsModified` を更新。
- `saveWithSync`: 書き込み成功時に `lastFsModified` を更新。
- `refreshIfRemoteUpdated` & `startAutoSync`: 比較条件を `!==` に変更。

## 検証計画
- 意図的にPCの時計をずらした状態でも、他端末での保存が正しく検知され、画面が更新されることを確認。
- 保存時の競合警告が正しく（必要な時だけ）表示されることを確認。
