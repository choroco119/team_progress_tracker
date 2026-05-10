/**
 * ユーティリティ関数群
 * プロジェクト全体で使用される独立した補助関数を管理します。
 */

/**
 * 数値をカンマ区切り形式にフォーマットする
 * @param {number|string} val 
 * @returns {string}
 */
function formatNumberWithCommas(val) {
    if (val === null || val === undefined || val === '' || val === '-') return '-';
    const cleanVal = String(val).replace(/,/g, '');
    const num = parseFloat(cleanVal);
    if (isNaN(num)) return val;
    return num.toLocaleString();
}

/**
 * 日付文字列を YYYY/MM/DD 形式にフォーマットする
 * @param {string} dateStr 
 * @returns {string}
 */
function formatShortDate(dateStr) {
    if (!dateStr) return '-';
    const d = new Date(dateStr);
    if (isNaN(d.getTime())) return dateStr;
    return `${d.getFullYear()}/${d.getMonth() + 1}/${d.getDate()}`;
}

/**
 * 指定された日付が今日以前（期限超過）かどうかを判定する
 * @param {string} dateStr 
 * @returns {boolean}
 */
function isOverdue(dateStr) {
    if (!dateStr) return false;
    const target = new Date(dateStr);
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    target.setHours(0, 0, 0, 0);
    return target <= today;
}

/**
 * 指定された日付が現在から2ヶ月以内かどうかを判定する
 * @param {string} dateStr 
 * @returns {boolean}
 */
function isWithinTwoMonths(dateStr) {
    if (!dateStr) return false;
    const target = new Date(dateStr);
    const limit = new Date();
    limit.setMonth(limit.getMonth() + 2);
    limit.setHours(23, 59, 59, 999);
    return target <= limit;
}

/**
 * トースト通知を表示する
 * @param {string} message 
 */
function showToast(message) {
    const toast = document.createElement('div');
    toast.className = 'toast';
    toast.innerHTML = `<i data-lucide="check-circle" style="width:16px;height:16px;color:var(--success-color);"></i> ${message}`;
    document.body.appendChild(toast);
    
    if (window.lucide) {
        window.lucide.createIcons({ root: toast });
    }

    setTimeout(() => toast.classList.add('show'), 10);

    setTimeout(() => {
        toast.classList.remove('show');
        setTimeout(() => toast.remove(), 300);
    }, 3000);
}

/**
 * プロジェクトデータから特定の工程フィールドの値を取得する
 * @param {Object} project 
 * @param {Object} field { proc: string, key: string }
 * @returns {string}
 */
function getFieldValue(project, field) {
    if (field.proc === 'partsProcurement') {
        const parts = project.processes?.partsProcurement || {};
        if (field.key === 'main.dueDate') return parts.main?.dueDate || '';
        return '';
    }
    const proc = project.processes?.[field.proc] || {};
    return proc[field.key] || '';
}

/**
 * IndexedDBをオープンする（汎用ヘルパー）
 */
async function openDB(dbName, storeName) {
    return new Promise((resolve, reject) => {
        const request = indexedDB.open(dbName, 1);
        request.onupgradeneeded = (e) => {
            const db = e.target.result;
            if (!db.objectStoreNames.contains(storeName)) {
                db.createObjectStore(storeName);
            }
        };
        request.onsuccess = (e) => resolve(e.target.result);
        request.onerror = (e) => reject(e.target.error);
    });
}
