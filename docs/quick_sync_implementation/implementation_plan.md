# フォルダ同期の利便性向上（クイック同期機能）

現状、ページを読み込むたびに「同期設定」からフォルダを選択する必要がありますが、これを IndexedDB を用いて記憶し、「現在のフォルダ（一度選択したフォルダ）」で即座に同期を開始できるようにします。

## ユーザーレビューが必要な事項
- **ブラウザの権限確認**: セキュリティ上の理由から、保存されたフォルダに再接続する際、ブラウザが「ファイルの編集を許可しますか？」という確認ダイアログを出すことがあります。これは回避できない仕様です。
- **UIの配置**: ヘッダーに新しいボタンを追加しますが、既存の「同期設定」ボタンも予備として残します。

## 変更内容

### [index.html](file:///c:/Users/kohei/.gemini/antigravity/scratch/team_progress_tracker/index.html)
- ヘッダーの `header-actions` 内に、新しいボタン `id="quick-sync-btn"` を追加します。
- アイコンには `folder-sync` や `zap`（クイック）などを使用します。

### [app.js](file:///c:/Users/kohei/.gemini/antigravity/scratch/team_progress_tracker/app.js)
- **IndexedDB管理ロジックの追加**:
    - `idb-keyval` ライクな軽量な IndexedDB 操作関数を実装（外部ライブラリなしで実装）。
- **`connectToFolder` の拡張**:
    - フォルダ選択時にハンドルを保存する処理を追加。
- **`quickConnect` 関数の新規作成**:
    - 保存されたハンドルを読み込み、権限を確認して同期を開始。
- **`init` の更新**:
    - 起動時に保存されたハンドルがあるかチェックし、UIの状態（ボタンの活性化など）を更新。

### [style.css](file:///c:/Users/kohei/.gemini/antigravity/scratch/team_progress_tracker/style.css)
- 新しいボタン用のスタイル調整（必要に応じて）。

## 検証計画
### 手動検証
1. ページを開き、新設された「クイック同期」または「同期設定」でフォルダを選択。
2. データが正常に読み込まれることを確認。
3. ページをリロードする。
4. 「クイック同期」をクリック、または自動接続が機能し、フォルダ選択なしで同期が再開されることを確認。
