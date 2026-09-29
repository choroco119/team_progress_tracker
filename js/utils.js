/**
 * ユーティリティ関数群
 * プロジェクト全体で使用される独立した補助関数を管理します。
 */

// Global Application State (shared across all scripts)
var dirHandle = null;
var state = {
    lastUpdated: null,
    projects: [],
    config: {
        customerList: [
            { name: 'A社', kana: 'エーシャ' },
            { name: 'B社', kana: 'ビーシャ' },
            { name: 'C工業', kana: 'シーコウギョウ' }
        ],
        specList: ['JIS規格', '社内規格', '特注'],
        sheetMetalVendors: ['株式会社D鈑金', 'E工業株式会社'],
        staffList: ['田中', '佐藤', '鈴木']
    }
};

// Sync State (shared across all scripts)
var lastLoadedData = null; // 競合検知用
var lastFsModified = 0; // ファイルシステム上の最終更新時刻
var syncInterval = null; // 自動同期のタイマー
var isSaving = false; // 二重保存防止

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

/* ==========================================================================
   テーマ切替コントローラー (Light / Dark)
   ========================================================================== */
const ThemeManager = {
    STORAGE_KEY: 'progress-tracker-theme',

    init() {
        const saved = localStorage.getItem(this.STORAGE_KEY);
        const prefersDark = window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;
        const initialTheme = saved ? saved : (prefersDark ? 'dark' : 'light');
        
        this.apply(initialTheme);

        // OSテーマ変更リスナー
        if (window.matchMedia) {
            window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', (e) => {
                if (!localStorage.getItem(this.STORAGE_KEY)) {
                    this.apply(e.matches ? 'dark' : 'light');
                }
            });
        }

        // ボタンのイベント登録
        const btn = document.getElementById('theme-toggle-btn');
        if (btn) {
            btn.addEventListener('click', () => this.toggle());
        }
    },

    apply(theme) {
        document.documentElement.setAttribute('data-theme', theme);
        const textSpan = document.getElementById('theme-text');
        const iconSpan = document.getElementById('theme-icon');
        
        if (theme === 'dark') {
            if (textSpan) textSpan.innerText = 'Light';
            if (iconSpan) {
                iconSpan.innerHTML = '<svg width="14" height="14" viewBox="0 0 16 16" fill="none"><circle cx="8" cy="8" r="6" fill="#F4F0E6" stroke="#C8C2B8" stroke-width="1.8"/></svg>';
            }
        } else {
            if (textSpan) textSpan.innerText = 'Dark';
            if (iconSpan) {
                iconSpan.innerHTML = '<svg width="14" height="14" viewBox="0 0 16 16" fill="none"><circle cx="8" cy="8" r="6.5" fill="#1E1D1B" stroke="#5E5850" stroke-width="1.2"/></svg>';
            }
        }
    },

    toggle() {
        const current = document.documentElement.getAttribute('data-theme') || 'light';
        const next = current === 'dark' ? 'light' : 'dark';
        localStorage.setItem(this.STORAGE_KEY, next);
        this.apply(next);
    }
};

// DOM構築時にテーマコントローラーを初期化
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => ThemeManager.init());
} else {
    ThemeManager.init();
}
