# リファクタリング：同期処理ロジックの抽出（SyncManager）完了レポート

## 概要
`app.js` の肥大化を解消するリファクタリングの第2段階として、File System Access API を使用した同期・保存・バックアップ・排他制御に関連するすべてのロジックを `js/sync-manager.js` に分離しました。

## 変更点

### 1. 新規モジュール：[js/sync-manager.js](js/sync-manager.js)
- **役割**: ファイルシステムとの直接的なやり取り（読み込み、保存、ロック、バックアップ、自動同期）をすべて担当します。
- **機能**:
    - `connectToFolder` / `loadFromFolder` / `saveWithSync`
    - デッドロック対策付きの排他制御（`acquireLock`, `releaseLock`）
    - 30日分の自動デイリーバックアップ管理（`saveToDailyBackup`, `cleanupOldBackups`）
    - バックグラウンドでの自動更新チェック（`startAutoSync`）

### 2. 共通基盤の強化：[js/utils.js](js/utils.js)
- 同期状態（`lastLoadedData`, `lastFsModified`, `syncInterval`, `isSaving`）をグローバル変数として抽出し、複数のスクリプト間でのデータ整合性を確保しました。

### 3. メインロジックの整理：[app.js](app.js)
- 約300行の同期関連コードを削除し、`SyncManager` 経由の呼び出しに集約しました。
- UI制御（モーダル開閉、テーブル描画、フィルタリング）とビジネスロジックの分離が進み、コードの可読性が大幅に向上しました。

### 4. UIの改善：[style.css](style.css) / [js/diff-engine.js](js/diff-engine.js)
- 「進捗差分比較」テーブルのヘッダーデザインと列の配置を、メインテーブルと統一しました。
- 差分比較テーブルのヘッダーもスクロール時に固定（sticky）されるように改善しました。

## 検証結果
- [x] フォルダへの接続とデータの自動読み込みが正常であること
- [x] 各工程モーダルでの保存および完了ボタン操作による自動同期が正常であること
- [x] 競合検知とロック機能が正しく動作すること
- [x] 進捗差分比較のデザインが統一されていること

## 今後の展望
- 次のステップとして、モーダル表示やテーブル描画などの「UI描画ロジック」を `js/ui-renderer.js` に分離することで、`app.js` をさらに整理する予定です。
