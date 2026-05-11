# タスク: クイック同期機能の復旧と同期の健全化

クイック同期ボタンの表示問題を解決し、非HTTPS環境での動作制限に関するフィードバックを追加します。

- [x] `app.js` の `quickSyncBtn` 定義を `window.quickSyncBtn` に変更
- [x] `js/sync-manager.js` に API サポートチェックを追加
- [x] `app.js` の `init` 時に API 非サポート時の警告表示を追加
- [x] 動作確認（ボタンの表示と動作）
