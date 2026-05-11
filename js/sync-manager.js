/**
 * 同期管理マネージャー
 * File System Access API を使用したファイルの読み書き、同期、ロック制御を担当します。
 */

const SyncManager = {
    // 定数
    DB_NAME: 'TrackerDB',
    STORE_NAME: 'Settings',
    KEY_NAME: 'sync-directory',

    /**
     * 保存されたフォルダハンドルを確認し、可能であれば接続する
     */
    async checkStoredFolder() {
        try {
            const handle = await this.getStoredHandle();
            if (handle) {
                // 保存されたハンドルがある場合、UIを更新
                if (window.quickSyncBtn) {
                    window.quickSyncBtn.style.display = 'inline-flex';
                    window.quickSyncBtn.title = `記憶されたフォルダ: ${handle.name}`;
                }
                
                // 権限があるか確認
                if (await handle.queryPermission({ mode: 'readwrite' }) === 'granted') {
                    await this.connectToFolder(handle);
                }
            }
        } catch (e) {
            console.error('Failed to check stored folder:', e);
        }
    },

    /**
     * フォルダに接続する（新規選択または保存済みからの復元）
     * @param {FileSystemDirectoryHandle} existingHandle 
     */
    async connectToFolder(existingHandle = null) {
        // APIサポートチェック
        if (!window.showDirectoryPicker) {
            alert('お使いのブラウザ環境では同期機能（File System Access API）がサポートされていません。\nHTTPS接続、または localhost でのアクセスが必要です。');
            return;
        }

        try {
            if (existingHandle) {
                dirHandle = existingHandle;
                if (await dirHandle.queryPermission({ mode: 'readwrite' }) !== 'granted') {
                    if (await dirHandle.requestPermission({ mode: 'readwrite' }) !== 'granted') {
                        return;
                    }
                }
            } else {
                dirHandle = await window.showDirectoryPicker();
                await this.storeHandle(dirHandle);
                if (window.quickSyncBtn) {
                    window.quickSyncBtn.style.display = 'inline-flex';
                    window.quickSyncBtn.title = `記憶されたフォルダ: ${dirHandle.name}`;
                }
            }
            
            await this.loadFromFolder();
            if (window.updateSyncStatusUI) window.updateSyncStatusUI('connected');
            showToast('同期フォルダに接続しました');
            this.startAutoSync();
        } catch (err) {
            if (err.name !== 'AbortError') {
                console.error('Folder connection failed:', err);
                alert('フォルダ接続に失敗しました: ' + err.message);
            }
        }
    },

    /**
     * 共有フォルダからデータを読み込む
     */
    async loadFromFolder() {
        if (!dirHandle) return;
        try {
            const fileHandle = await dirHandle.getFileHandle('team_data.json', { create: true });
            const file = await fileHandle.getFile();
            const content = await file.text();
            
            if (!content || content.trim() === '') {
                // 新規ファイルの場合は現在のstateを保存
                await this.saveToFolder(state);
                return;
            }

            const data = JSON.parse(content);
            if (data.projects && data.config) {
                state = data;
                lastLoadedData = JSON.parse(JSON.stringify(data));
                lastFsModified = file.lastModified;
                
                // UIの更新（app.js側の関数を呼び出し）
                if (window.renderHeader) window.renderHeader();
                if (window.renderTable) window.renderTable();
                if (window.populateSelectOptions) window.populateSelectOptions();
                if (window.updateSyncStatusUI) window.updateSyncStatusUI('connected');
                
                // バックアップ作成
                await this.saveToDailyBackup(data);
            }
        } catch (err) {
            console.error('Loading failed:', err);
            showToast('データの読み込みに失敗しました');
        }
    },

    /**
     * 同期保存（ロック制御・競合チェックを含む）
     * @param {boolean} isAutoSave 
     */
    async saveWithSync(isAutoSave = false) {
        if (!dirHandle) {
            if (!isAutoSave) alert('同期フォルダが設定されていません。');
            return;
        }

        if (isSaving) return;
        isSaving = true;
        if (window.updateSyncStatusUI) window.updateSyncStatusUI('locked');

        try {
            // 1. ロック制御
            const locked = await this.acquireLock();
            if (!locked) {
                isSaving = false;
                if (window.updateSyncStatusUI) window.updateSyncStatusUI('connected');
                return;
            }

            // 2. 競合チェック
            const fileHandle = await dirHandle.getFileHandle('team_data.json');
            const file = await fileHandle.getFile();
            const content = await file.text();
            const currentFileData = JSON.parse(content);

            if (currentFileData.lastUpdated && lastLoadedData && currentFileData.lastUpdated !== lastLoadedData.lastUpdated) {
                alert('編集中に他の人がデータを更新しました。最新データを読み込みます。');
                await this.releaseLock();
                await this.loadFromFolder();
                isSaving = false;
                if (window.updateSyncStatusUI) window.updateSyncStatusUI('connected');
                return;
            }

            // 3. 書き込み
            state.lastUpdated = new Date().toISOString();
            await this.saveToFolder(state);
            lastLoadedData = JSON.parse(JSON.stringify(state));
            
            const updatedFile = await (await dirHandle.getFileHandle('team_data.json')).getFile();
            lastFsModified = updatedFile.lastModified;

            // 4. ロック解除
            await this.releaseLock();
            showToast('データを同期しました');

        } catch (err) {
            console.error('Sync failed:', err);
            alert('同期に失敗しました：' + err.message);
        } finally {
            isSaving = false;
            if (window.updateSyncStatusUI) window.updateSyncStatusUI('connected');
        }
    },

    /**
     * ロックファイルの作成
     */
    async acquireLock() {
        try {
            let lockHandle;
            try {
                lockHandle = await dirHandle.getFileHandle('lock.json', { create: false });
                const lockFile = await lockHandle.getFile();
                const now = Date.now();
                
                if (now - lockFile.lastModified < 5 * 60 * 1000) {
                    await dirHandle.removeEntry('lock.json');
                } else {
                    alert('現在、他の人が保存中です。');
                    return false;
                }
            } catch (e) {}

            lockHandle = await dirHandle.getFileHandle('lock.json', { create: true });
            const writable = await lockHandle.createWritable();
            await writable.write(JSON.stringify({ user: 'active-user', time: Date.now() }));
            await writable.close();
            return true;
        } catch (e) {
            console.error('Lock failed:', e);
            return false;
        }
    },

    /**
     * ロックファイルの削除
     */
    async releaseLock() {
        try {
            await dirHandle.removeEntry('lock.json');
        } catch (e) {
            console.error('Unlock failed:', e);
        }
    },

    /**
     * 純粋なファイル書き込み
     */
    async saveToFolder(data) {
        if (!dirHandle) return;
        const fileHandle = await dirHandle.getFileHandle('team_data.json', { create: true });
        const writable = await fileHandle.createWritable();
        await writable.write(JSON.stringify(data, null, 2));
        await writable.close();
    },

    /**
     * デイリーバックアップの作成
     */
    async saveToDailyBackup(data) {
        if (!dirHandle) return;
        try {
            const backupsDir = await dirHandle.getDirectoryHandle('backups', { create: true });
            const now = new Date();
            const today = now.getFullYear() + String(now.getMonth() + 1).padStart(2, '0') + String(now.getDate()).padStart(2, '0');
            const fileName = `daily_${today}.json`;
            
            let exists = false;
            try {
                await backupsDir.getFileHandle(fileName, { create: false });
                exists = true;
            } catch (e) {}

            if (!exists) {
                const backupFile = await backupsDir.getFileHandle(fileName, { create: true });
                const writable = await backupFile.createWritable();
                await writable.write(JSON.stringify(data, null, 2));
                await writable.close();
                await this.cleanupOldBackups(backupsDir);
            }
        } catch (err) {
            console.error('Backup failed:', err);
        }
    },

    /**
     * 古いバックアップの削除（30日分保持）
     */
    async cleanupOldBackups(backupsDir) {
        try {
            const entries = [];
            for await (const entry of backupsDir.values()) {
                if (entry.kind === 'file' && entry.name.startsWith('daily_')) {
                    entries.push(entry);
                }
            }
            entries.sort((a, b) => a.name.localeCompare(b.name));
            const MAX_BACKUPS = 30;
            if (entries.length > MAX_BACKUPS) {
                const toDelete = entries.slice(0, entries.length - MAX_BACKUPS);
                for (const entry of toDelete) {
                    await backupsDir.removeEntry(entry.name);
                }
            }
        } catch (e) {
            console.error('Cleanup failed:', e);
        }
    },

    /**
     * 自動同期（ポーリング）の開始
     */
    startAutoSync() {
        if (syncInterval) clearInterval(syncInterval);
        syncInterval = setInterval(async () => {
            if (!dirHandle || isSaving) return;
            try {
                const fileHandle = await dirHandle.getFileHandle('team_data.json');
                const file = await fileHandle.getFile();
                if (file.lastModified !== lastFsModified) {
                    const content = await file.text();
                    const remoteData = JSON.parse(content);
                    if (remoteData.lastUpdated !== state.lastUpdated) {
                        await this.loadFromFolder();
                        showToast('最新データを自動読み込みしました');
                    }
                }
            } catch (e) {}
        }, 30000); // 30秒間隔
    },

    /**
     * 他のアクション前の簡易リフレッシュチェック
     */
    async refreshIfRemoteUpdated() {
        if (!dirHandle || isSaving) return;
        try {
            const fileHandle = await dirHandle.getFileHandle('team_data.json');
            const file = await fileHandle.getFile();
            if (file.lastModified !== lastFsModified) {
                const content = await file.text();
                const remoteData = JSON.parse(content);
                if (remoteData.lastUpdated !== state.lastUpdated) {
                    await this.loadFromFolder();
                    showToast('最新データを読み込みました');
                }
            }
        } catch (e) {}
    },

    /**
     * IndexedDBへのハンドル保存
     */
    async storeHandle(handle) {
        const db = await openDB(this.DB_NAME, this.STORE_NAME);
        const tx = db.transaction(this.STORE_NAME, 'readwrite');
        tx.objectStore(this.STORE_NAME).put(handle, this.KEY_NAME);
        return new Promise((resolve, reject) => {
            tx.oncomplete = () => resolve();
            tx.onerror = () => reject(tx.error);
        });
    },

    /**
     * IndexedDBからのハンドル取得
     */
    async getStoredHandle() {
        const db = await openDB(this.DB_NAME, this.STORE_NAME);
        const tx = db.transaction(this.STORE_NAME, 'readonly');
        const request = tx.objectStore(this.STORE_NAME).get(this.KEY_NAME);
        return new Promise((resolve, reject) => {
            request.onsuccess = () => resolve(request.result);
            request.onerror = () => reject(request.error);
        });
    }
};

// グローバルに公開
window.SyncManager = SyncManager;
