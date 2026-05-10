# リファクタリング：ユーティリティ関数の抽出 タスクリスト

- [x] 新規ファイル `js/utils.js` の作成
- [x] `app.js` から以下の関数を移動
    - [x] `formatNumberWithCommas`
    - [x] `formatShortDate`
    - [x] `isOverdue`
    - [x] `isWithinTwoMonths`
    - [x] `showToast`
    - [x] `getFieldValue`
    - [x] `openDB` (汎用化)
- [x] `index.html` への `utils.js` 読み込み追加
- [x] `app.js` 内の `openDB` 呼び出し箇所の修正
- [x] 動作確認（コード整合性の確認）
- [x] ドキュメント作成とプッシュ
