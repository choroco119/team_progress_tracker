# クイック同期機能の復旧と同期機能の改善計画

「クイック同期」ボタンが表示されなくなっていた問題の原因を特定し、修正します。また、同期機能が利用できない環境（非HTTPSなど）でのユーザー体験を改善します。

## 修正が必要な理由
1.  **ボタンの非表示**: `app.js` で `quickSyncBtn` が `const` で定義されており、`window` オブジェクトに紐付いていなかったため、`js/sync-manager.js` からの参照が `undefined` となり、保存済みフォルダがあってもボタンが表示されなくなっていました。
2.  **APIの制限**: File System Access API はセキュアなコンテキスト（HTTPSまたはlocalhost）でのみ動作します。IPアドレス直接指定などでアクセスしている場合、機能が利用できないため、その旨をユーザーに通知する必要があります。

## 提案される変更

### [Component: UI & Logic]

#### [MODIFY] [app.js](file:///c:/Users/kohei/.gemini/antigravity/scratch/team_progress_tracker/app.js)
- `quickSyncBtn` の定義を `window.quickSyncBtn` に変更し、モジュール間での参照を可能にします。
- `init` 関数内で File System Access API のサポート状況をチェックし、非サポート環境では同期機能が無効であることをユーザーに通知します。

#### [MODIFY] [js/sync-manager.js](file:///c:/Users/kohei/.gemini/antigravity/scratch/team_progress_tracker/js/sync-manager.js)
- フォルダ選択（`showDirectoryPicker`）の前にAPIの存在チェックを追加し、エラー時に適切なメッセージを表示するようにします。

## 検証計画
### 手動確認
1.  ブラウザでアプリを開き、一度同期フォルダを設定する。
2.  リロード後、「クイック同期」ボタンが表示されることを確認する。
3.  「クイック同期」ボタンをクリックして、フォルダへのアクセスが再開されることを確認する。
4.  （可能であれば）非HTTPS環境でアクセスし、機能制限の警告が表示されることを確認する。
