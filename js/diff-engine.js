/**
 * 進捗差分比較エンジン
 * バックアップデータとの比較および結果の描画を担当します。
 */

const DiffEngine = {
    // DOM要素の参照
    elements: {
        backupSelect: null,
        runBtn: null,
        body: null,
        tabBtn: null
    },

    /**
     * 初期化処理
     * DOM要素の取得とイベントリスナーの登録を行います。
     */
    init() {
        this.elements.backupSelect = document.getElementById('diff-backup-select');
        this.elements.runBtn = document.getElementById('run-diff-btn');
        this.elements.body = document.getElementById('diff-body');
        this.elements.tabBtn = document.getElementById('diff-tab-btn');

        // タブ切り替え時にバックアップリストを更新
        if (this.elements.tabBtn) {
            this.elements.tabBtn.addEventListener('click', async () => {
                await this.updateBackupList();
            });
        }

        // 比較実行ボタンのイベント
        if (this.elements.runBtn) {
            this.elements.runBtn.onclick = async () => {
                const fileName = this.elements.backupSelect.value;
                if (!fileName) {
                    alert('バックアップファイルを選択してください。');
                    return;
                }
                await this.runComparison(fileName);
            };
        }
    },

    /**
     * バックアップファイルの一覧を取得してセレクトボックスを更新する
     */
    async updateBackupList() {
        // window.dirHandle は app.js で管理されている共有フォルダのハンドル
        if (!dirHandle) {
            this.elements.backupSelect.innerHTML = '<option value="">フォルダを接続してください</option>';
            return;
        }

        try {
            const backupsDir = await dirHandle.getDirectoryHandle('backups', { create: true });
            const files = [];
            for await (const entry of backupsDir.values()) {
                if (entry.kind === 'file' && entry.name.startsWith('daily_')) {
                    files.push(entry.name);
                }
            }

            files.sort().reverse(); // 新しい順にソート

            if (files.length === 0) {
                this.elements.backupSelect.innerHTML = '<option value="">バックアップが見つかりません</option>';
            } else {
                this.elements.backupSelect.innerHTML = files.map(f => {
                    const dateStr = f.replace('daily_', '').replace('.json', '');
                    const formattedDate = `${dateStr.substring(0, 4)}/${dateStr.substring(4, 6)}/${dateStr.substring(6, 8)}`;
                    return `<option value="${f}">${formattedDate} (${f})</option>`;
                }).join('');
            }
        } catch (e) {
            console.error('Failed to list backups:', e);
            this.elements.backupSelect.innerHTML = '<option value="">読み込みエラー</option>';
        }
    },

    /**
     * 指定されたバックアップファイルと現在のデータを比較する
     * @param {string} fileName 
     */
    async runComparison(fileName) {
        if (!dirHandle) return;

        try {
            const backupsDir = await dirHandle.getDirectoryHandle('backups');
            const fileHandle = await backupsDir.getFileHandle(fileName);
            const file = await fileHandle.getFile();
            const content = await file.text();
            const oldData = JSON.parse(content);
            const oldProjects = oldData.projects || [];

            // window.state.projects は app.js で管理されている現在のデータ
            this.renderDiffResults(oldProjects, state.projects);
            
            // showToast は utils.js で定義されている共通関数
            showToast('比較が完了しました');
        } catch (e) {
            console.error('Comparison failed:', e);
            alert('バックアップの読み込みに失敗しました。');
        }
    },

    /**
     * 比較結果をテーブルに描画する
     * @param {Array} oldProjects 
     * @param {Array} newProjects 
     */
    renderDiffResults(oldProjects, newProjects) {
        const body = this.elements.body;
        if (!body) return;
        
        body.innerHTML = '';
        const diffRows = [];

        // 比較対象のフィールド定義（重要項目のみ）
        const targetFields = [
            { proc: 'specDoc', key: 'issueDate' },
            { proc: 'specDoc', key: 'dueDate' },
            { proc: 'specDoc', key: 'approvalDate' },
            { proc: 'sheetMetal', key: 'vendor' },
            { proc: 'sheetMetal', key: 'poDueDate' },
            { proc: 'sheetMetal', key: 'poRecvDate' },
            { proc: 'sheetMetal', key: 'drawingLimitDate' },
            { proc: 'sheetMetal', key: 'confirmedDate' },
            { proc: 'partsProcurement', key: 'main.dueDate' }
        ];

        newProjects.forEach(newP => {
            const oldP = oldProjects.find(p => p.id === newP.id);
            
            // 指定フィールドのいずれかに変更があるかチェック
            let hasChange = false;
            const fieldValues = targetFields.map(f => {
                // getFieldValue は utils.js で定義
                const newVal = typeof getFieldValue === 'function' ? getFieldValue(newP, f) : '';
                const oldVal = oldP ? (typeof getFieldValue === 'function' ? getFieldValue(oldP, f) : null) : null;
                const changed = oldP ? (newVal !== oldVal) : !!newVal;
                if (changed) hasChange = true;
                return { value: newVal, changed };
            });

            // 新規登録の場合も表示対象とする
            if (!oldP) hasChange = true;

            if (hasChange) {
                diffRows.push({
                    id: newP.id,
                    deadline: newP.deadline || '9999-99-99',
                    customer: newP.customer || '-',
                    subject: newP.subject || '-',
                    fields: fieldValues
                });
            }
        });

        if (diffRows.length === 0) {
            body.innerHTML = '<tr><td colspan="12" style="text-align: center; padding: 3rem; color: var(--text-muted);">指定項目の進捗に差分はありませんでした。</td></tr>';
            return;
        }

        // 納期昇順でソート
        diffRows.sort((a, b) => a.deadline.localeCompare(b.deadline));

        diffRows.forEach(d => {
            const tr = document.createElement('tr');
            
            // 基本情報カラム
            tr.innerHTML = `
                <td><strong>${d.id}</strong></td>
                <td style="text-align:center;">${d.deadline === '9999-99-99' ? '-' : d.deadline}</td>
                <td><small>${d.customer}<br>${d.subject}</small></td>
            `;

            // 各工程フィールドのカラム
            d.fields.forEach(f => {
                const td = document.createElement('td');
                td.style.fontSize = '0.85rem';
                td.style.textAlign = 'center';
                
                if (f.changed) {
                    td.innerHTML = `<span style="color:var(--success-color); font-weight:bold;">${f.value || '-'}</span>`;
                    td.style.backgroundColor = 'rgba(16, 185, 129, 0.05)';
                } else {
                    td.textContent = f.value || '-';
                    td.style.color = 'var(--text-muted)';
                }
                tr.appendChild(td);
            });
            
            body.appendChild(tr);
        });
    }
};

// グローバルに公開
window.DiffEngine = DiffEngine;
