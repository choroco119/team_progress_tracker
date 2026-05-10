# タスク：同期処理ロジックの抽出（SyncManager）

- [x] `js/utils.js` に共通状態変数を追加
- [x] `js/sync-manager.js` を作成し、同期・ファイル操作ロジックを抽出
- [x] `app.js` の呼び出し箇所を `SyncManager` 経由に置換
- [x] `app.js` の不要な関数定義を削除
- [x] `index.html` に `js/sync-manager.js` の読み込みを追加
- [x] 差分比較テーブルのデザイン修正（メインテーブルと統一）
- [x] 動作確認（接続、読み込み、保存、ロック、バックアップ、UI表示）
