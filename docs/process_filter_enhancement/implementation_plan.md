# 工程フィルタの機能強化（ドロップダウン化）

現在の「工程未完フィルタ」を「工程フィルタ」に名称変更し、各工程の詳細な進捗段階で絞り込めるようにUIとロジックを刷新します。

## ユーザー確認事項
- **各工程の選択肢**: 現在のデータ構造から推測した選択肢（ステータス）を提案しています。不足や名称の違和感があればご指摘ください。
- **UI配置**: 複数のドロップダウンが並ぶため、画面幅が狭い場合に折り返して表示されるよう調整します。

## 変更内容

### 1. UIの変更 ([index.html](file:///c:/Users/kohei/.gemini/antigravity/scratch/team_progress_tracker/index.html))
- ラベルを「工程フィルタ:」に変更。
- 「納入仕様書」ボタンを削除し、以下の選択肢を持つセレクトボックスを追加。
    - 全て (空)
    - 未出図
    - 未返却
    - 修正要
    - 未承認
- その他の工程ボタンは、順次置き換えるまで一旦維持します。

### 2. ロジックの刷新 ([app.js](file:///c:/Users/kohei/.gemini/antigravity/scratch/team_progress_tracker/app.js))
- 新しいフィルタ状態管理用オブジェクト `processFilterValues` を導入。
- 納入仕様書フィルタの `change` イベントで `processFilterValues.specDoc` を更新。
- `renderTable` 内のフィルタロジックを、ご指定の条件（未出図・未返却・修正要・未承認）で分岐するように実装。

#### 納入仕様書の詳細条件
- **未出図**: `!proc.specDoc.issueDate`
- **未返却**: `proc.specDoc.issueDate && !proc.specDoc.returnDate`
- **修正要**: `proc.specDoc.needsFix === '要'`
- **未承認**: `(proc.specDoc.issueDate || proc.specDoc.returnDate) && !proc.specDoc.approvalDate`

## 検証計画
### 手動検証
- 各工程のドロップダウンを切り替え、期待通りに表の行が絞り込まれることを確認。
- 「全て解除」ボタンで、すべてのドロップダウンが「全て」にリセットされることを確認。
- データの編集（モーダルでの入力）が即座にフィルタ結果に反映されることを確認。
