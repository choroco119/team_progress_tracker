# リファクタリング：差分比較ロジックの抽出 タスクリスト

- [x] 新規ファイル `js/diff-engine.js` の作成
- [x] `app.js` から以下の要素を移動
    - [x] 差分比較用のDOM要素定数
    - [x] `updateBackupList()`
    - [x] `runComparison()`
    - [x] `renderDiffResults()`
- [x] `index.html` への `diff-engine.js` 読み込み追加
- [x] `app.js` の `init()` 内で `DiffEngine.init()` を呼び出すように変更
- [x] グローバル変数（`state`, `dirHandle`）へのアクセスの整合性確認
- [x] ドキュメント作成（Pushは保留）
