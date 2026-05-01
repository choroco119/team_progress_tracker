// Application State
let state = {
    lastUpdated: null, // 同期用タイムスタンプ
    projects: [
        // ... (existing sample data)
    ],
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

// UI Elements
const tableHeaderRow = document.getElementById('table-header-row');
const progressBody = document.getElementById('progress-body');
const activeProjectsEl = document.getElementById('active-projects-count');
const thisWeekDeadlinesEl = document.getElementById('this-week-deadlines');
const alertCountEl = document.getElementById('alert-count');
const modalOverlay = document.getElementById('modal-overlay');
const addProjectBtn = document.getElementById('add-project-btn');
const deleteProjectBtn = document.getElementById('delete-project-btn');
const closeModalBtn = document.getElementById('close-modal');
const cancelBtn = document.getElementById('cancel-btn');
const addProjectForm = document.getElementById('add-project-form');

// Settings & Sync Elements
// Process Modal Elements
const processSpecModal = document.getElementById('process-spec-modal');
const closeSpecModalBtn = document.getElementById('close-spec-modal');
const cancelSpecModalBtn = document.getElementById('cancel-spec-modal');
const saveSpecModalBtn = document.getElementById('save-spec-modal');

const specIssueBtn = document.getElementById('spec-issue-btn');
const specIssueDateInput = document.getElementById('spec-issue-date');
const specDueInput = document.getElementById('spec-due-date');
const specReturnBtn = document.getElementById('spec-return-btn');
const specReturnDateInput = document.getElementById('spec-return-date');
const specFixYesBtn = document.getElementById('spec-fix-yes-btn');
const specFixNoBtn = document.getElementById('spec-fix-no-btn');
const specApprovalBtn = document.getElementById('spec-approval-btn');
const specApprovalDateInput = document.getElementById('spec-approval-date');
const specMemoInput = document.getElementById('spec-memo');

const processSheetMetalModal = document.getElementById('process-sheetMetal-modal');
const closeSheetMetalModalBtn = document.getElementById('close-sheetMetal-modal');
const cancelSheetMetalModalBtn = document.getElementById('cancel-sheetMetal-modal');
const saveSheetMetalModalBtn = document.getElementById('save-sheetMetal-modal');

const smQuoteBtn = document.getElementById('sm-quote-btn');
const smQuoteDate = document.getElementById('sm-quote-date');
const smVendorSelect = document.getElementById('sm-vendor');
const smPoSentBtn = document.getElementById('sm-po-sent-btn');
const smPoSentDate = document.getElementById('sm-po-sent-date');
const smPoDueDate = document.getElementById('sm-po-due-date');
const smDrawingDueDate = document.getElementById('sm-drawing-due-date');
const smPoRecvBtn = document.getElementById('sm-po-recv-btn');
const smPoRecvDate = document.getElementById('sm-po-recv-date');
const smDrawingSentBtn = document.getElementById('sm-drawing-sent-btn');
const smDrawingSentDate = document.getElementById('sm-drawing-sent-date');
const smDrawingLimitDate = document.getElementById('sm-drawing-limit-date');
const smConfirmedBtn = document.getElementById('sm-confirmed-btn');
const smConfirmedDate = document.getElementById('sm-confirmed-date');
const smMemoInput = document.getElementById('sm-memo');

const processPartsModal = document.getElementById('process-parts-modal');
const closePartsModalBtn = document.getElementById('close-parts-modal');
const cancelPartsModalBtn = document.getElementById('cancel-parts-modal');
const savePartsModalBtn = document.getElementById('save-parts-modal');

const ppMainReqBtn = document.getElementById('pp-main-req-btn');
const ppMainReqDate = document.getElementById('pp-main-req-date');
const ppMainDueDate = document.getElementById('pp-main-due-date');
const ppMainSection = document.getElementById('pp-main-section');

const ppSpareReqBtn = document.getElementById('pp-spare-req-btn');
const ppSpareReqDate = document.getElementById('pp-spare-req-date');
const ppSpareCopyBtn = document.getElementById('pp-spare-copy-btn');
const ppSpareCopyDate = document.getElementById('pp-spare-copy-date');
const ppSpareDueDate = document.getElementById('pp-spare-due-date');
const ppSpareSection = document.getElementById('pp-spare-section');

const ppProvReqBtn = document.getElementById('pp-prov-req-btn');
const ppProvReqDate = document.getElementById('pp-prov-req-date');
const ppProvDueDate = document.getElementById('pp-prov-due-date');
const ppProvSection = document.getElementById('pp-provided-section');
const ppMemoInput = document.getElementById('pp-memo');

const processNameplateModal = document.getElementById('process-nameplate-modal');
const closeNameplateModalBtn = document.getElementById('close-nameplate-modal');
const cancelNameplateModalBtn = document.getElementById('cancel-nameplate-modal');
const saveNameplateModalBtn = document.getElementById('save-nameplate-modal');

const npPoSentBtn = document.getElementById('np-po-sent-btn');
const npPoSentDate = document.getElementById('np-po-sent-date');
const npDueDate = document.getElementById('np-due-date');
const npMemoInput = document.getElementById('np-memo');

const processInternalDrawingsModal = document.getElementById('process-internal-drawings-modal');
const closeInternalDrawingsModalBtn = document.getElementById('close-internal-drawings-modal');
const cancelInternalDrawingsModalBtn = document.getElementById('cancel-internal-drawings-modal');
const saveInternalDrawingsModalBtn = document.getElementById('save-internal-drawings-modal');

const idIssueBtn = document.getElementById('id-issue-btn');
const idIssueDate = document.getElementById('id-issue-date');
const idMemoInput = document.getElementById('id-memo');

const processSoftwareModal = document.getElementById('process-software-modal');
const closeSoftwareModalBtn = document.getElementById('close-software-modal');
const cancelSoftwareModalBtn = document.getElementById('cancel-software-modal');
const saveSoftwareModalBtn = document.getElementById('save-software-modal');

const swCreationBtn = document.getElementById('sw-creation-btn');
const swCreationDate = document.getElementById('sw-creation-date');
const swDebuggingBtn = document.getElementById('sw-debugging-btn');
const swDebuggingDate = document.getElementById('sw-debugging-date');
const swMemoInput = document.getElementById('sw-memo');

let currentSpecData = {
    issueDate: '',
    dueDate: '',
    returnDate: '',
    needsFix: '',
    approvalDate: '',
    memo: ''
};

let currentSheetMetalData = {
    quoteDate: '',
    vendor: '',
    poSentDate: '',
    poDueDate: '',
    drawingDueDate: '',
    poRecvDate: '',
    drawingSentDate: '',
    drawingLimitDate: '',
    confirmedDate: '',
    memo: ''
};

let currentPartsData = {
    main: { requestDate: '', dueDate: '' },
    spare: { requestDate: '', copyDate: '', dueDate: '' },
    provided: { requestDate: '', dueDate: '' },
    memo: ''
};

let currentNameplateData = {
    poSentDate: '',
    dueDate: '',
    memo: ''
};

let currentInternalDrawingsData = {
    issueDate: '',
    memo: ''
};

let currentSoftwareData = {
    creationDate: '',
    debuggingDate: '',
    memo: ''
};

// Settings Elements
const settingsBtn = document.getElementById('settings-btn');
const settingsOverlay = document.getElementById('settings-overlay');
const closeSettingsBtn = document.getElementById('close-settings');
const cancelSettingsBtn = document.getElementById('cancel-settings');
const saveSettingsBtn = document.getElementById('save-settings-btn');

const mainTabBtns = document.querySelectorAll('.tab-nav .tab-btn');
const mainTabContents = document.querySelectorAll('main > .tab-content');
const settingsTabBtns = document.querySelectorAll('.settings-modal .tabs .tab-btn');
const settingsTabContents = document.querySelectorAll('.settings-modal .tab-content');

const newCustomerNameInput = document.getElementById('new-customer-name-input');
const newCustomerKanaInput = document.getElementById('new-customer-kana-input');
const addCustomerBtn = document.getElementById('add-customer-btn');
const customerListContainer = document.getElementById('customer-list-container');

const newSpecInput = document.getElementById('new-spec-input');
const addSpecBtn = document.getElementById('add-spec-btn');
const specListContainer = document.getElementById('spec-list-container');

const newVendorInput = document.getElementById('new-vendor-input');
const addVendorBtn = document.getElementById('add-vendor-btn');
const vendorListContainer = document.getElementById('vendor-list-container');

const newStaffInput = document.getElementById('new-staff-input');
const addStaffBtn = document.getElementById('add-staff-btn');
const staffListContainer = document.getElementById('staff-list-container');

const syncFolderBtn = document.getElementById('sync-folder-btn');
const refreshDataBtn = document.getElementById('save-sync-btn');
const copyFromSection = document.getElementById('copy-from-section');
const copySearchInput = document.getElementById('copy-search-input');
const copySearchResults = document.getElementById('copy-search-results');
const syncStatusEl = document.getElementById('sync-status');

const projectCustomerSelect = document.getElementById('project-customer');
const projectSpecSelect = document.getElementById('project-spec');
const projectStaffSelect = document.getElementById('project-staff');
const projectBudgetInput = document.getElementById('project-budget');
const projectLinkInput = document.getElementById('project-link');

// Necessity Elements
const necSpecYes = document.getElementById('nec-spec-yes');
const necSpecNo = document.getElementById('nec-spec-no');
const necSmYes = document.getElementById('nec-sm-yes');
const necSmNo = document.getElementById('nec-sm-no');
const necPpMainYes = document.getElementById('nec-pp-main-yes');
const necPpMainNo = document.getElementById('nec-pp-main-no');
const necPpSpareYes = document.getElementById('nec-pp-spare-yes');
const necPpSpareNo = document.getElementById('nec-pp-spare-no');
const necPpProvYes = document.getElementById('nec-pp-prov-yes');
const necPpProvNo = document.getElementById('nec-pp-prov-no');
const necNpYes = document.getElementById('nec-np-yes');
const necNpNo = document.getElementById('nec-np-no');
const necIdYes = document.getElementById('nec-id-yes');
const necIdNo = document.getElementById('nec-id-no');
const necSwYes = document.getElementById('nec-sw-yes');
const necSwNo = document.getElementById('nec-sw-no');
// Filter Elements
const filterId = document.getElementById('filter-id');
const filterCustomer = document.getElementById('filter-customer');
const filterSubject = document.getElementById('filter-subject');
const filterDestination = document.getElementById('filter-destination');
const filterName = document.getElementById('filter-name');
const filterStaff = document.getElementById('filter-staff');
const filterExcludeCompleted = document.getElementById('filter-exclude-completed');
const clearFiltersBtn = document.getElementById('clear-filters');
const processFilterBtns = document.querySelectorAll('#process-filter-group button');
const sortIdHeader = document.getElementById('sort-id');
const sortDeadlineHeader = document.getElementById('sort-deadline');

// State for Modal
let editingProjectId = null;
let editingCustomerIndex = null;
let editingSpecIndex = null;
let editingVendorIndex = null;
let editingStaffIndex = null;

let tempCustomerList = [];
let tempSpecList = [];
let tempVendorList = [];
let tempStaffList = [];

let currentNecessityData = {
    specDoc: true,
    sheetMetal: true,
    partsProcurement: { main: true, spare: true, provided: true },
    nameplateProcurement: true,
    internalDrawings: true,
    software: true
};

let dirHandle = null;
let lastLoadedData = null; // 競合検知用
let lastFsModified = 0; // ファイルシステム上の最終更新時刻
let syncInterval = null;
let isSaving = false; // 二重保存防止
let editingProcessProjectId = null;

// Sort & Filter State
let sortField = 'id'; // 'id' or 'deadline'
let sortOrder = 'asc'; // 'asc' or 'desc'

// Filter State
let activeProcessFilters = new Set();
let excludeCompletedFilter = false;

// Initialize
function init() {
    populateSelectOptions();
    renderHeader();
    renderTable();
    setupEventListeners();
    setupInputFormatters();
    
    // 自動更新の開始（接続済みの場合）
    startAutoSync();
}

// Logic: Setup Input Formatters
function setupInputFormatters() {
    // 全角英数字を半角英数字に変換する関数
    const toHalfWidth = (str) => {
        return str.replace(/[！-～]/g, (s) => String.fromCharCode(s.charCodeAt(0) - 0xFEE0))
            .replace(/　/g, ' '); // 全角スペースを半角スペースに
    };

    // 予算: 半角数字とカンマのみに制限
    projectBudgetInput.addEventListener('input', (e) => {
        let val = toHalfWidth(e.target.value);
        val = val.replace(/[^0-9,]/g, ''); // 数字とカンマ以外を除去
        e.target.value = val;
    });

    // リンク: 半角英数字記号に変換
    projectLinkInput.addEventListener('input', (e) => {
        e.target.value = toHalfWidth(e.target.value);
    });

    // オートフリガナ（客先名の入力から自動補完）
    let baseKana = '';
    let isComposing = false;

    newCustomerNameInput.addEventListener('compositionstart', () => {
        isComposing = true;
        baseKana = newCustomerKanaInput.value;
    });

    newCustomerNameInput.addEventListener('compositionupdate', (e) => {
        // 漢字が含まれていない（ひらがな・カタカナ・アルファベット等）入力中の文字だけを対象にする
        if (e.data && /^[ぁ-んァ-ンーa-zA-Z0-9]+$/.test(e.data)) {
            let katakana = e.data.replace(/[ぁ-ん]/g, s => String.fromCharCode(s.charCodeAt(0) + 0x60));
            katakana = katakana.toUpperCase(); // アルファベットは一応大文字に
            newCustomerKanaInput.value = baseKana + katakana;
        }
    });

    newCustomerNameInput.addEventListener('compositionend', () => {
        isComposing = false;
        baseKana = newCustomerKanaInput.value;
    });

    newCustomerNameInput.addEventListener('input', (e) => {
        // 名前が完全にクリアされたらフリガナもクリア
        if (e.target.value === '') {
            newCustomerKanaInput.value = '';
            baseKana = '';
        } else if (!isComposing && e.data && /^[a-zA-Z0-9]+$/.test(e.data)) {
            // IMEを使わずに直接打たれた英数字などへの対応
            newCustomerKanaInput.value += e.data.toUpperCase();
            baseKana = newCustomerKanaInput.value;
        }
    });
}

// Logic: Populate Select Options
function populateSelectOptions() {
    const createOptions = (list, selectEl, isObject = false) => {
        selectEl.innerHTML = '<option value="">選択してください</option>';
        list.forEach(item => {
            const opt = document.createElement('option');
            const val = isObject ? item.name : item;
            opt.value = val;
            opt.textContent = val;
            selectEl.appendChild(opt);
        });
    };

    // 後方互換性：文字列の配列が来た場合は変換して扱う
    const safeCustomerList = (state.config.customerList || []).map(item =>
        typeof item === 'string' ? { name: item, kana: item } : item
    );

    createOptions(safeCustomerList, projectCustomerSelect, true);
    createOptions(state.config.specList || [], projectSpecSelect, false);
    createOptions(state.config.sheetMetalVendors || [], smVendorSelect, false);
    createOptions(state.config.staffList || [], projectStaffSelect, false);

    // フィルタ用のセレクトボックスを更新
    const filterStaff = document.getElementById('filter-staff');
    if (filterStaff) {
        filterStaff.innerHTML = '<option value="">全員</option>';
        (state.config.staffList || []).forEach(staff => {
            const opt = document.createElement('option');
            opt.value = staff;
            opt.textContent = staff;
            filterStaff.appendChild(opt);
        });
    }
}

// Event Listeners
function setupEventListeners() {
    // Project Modal
    addProjectBtn.onclick = async () => {
        await refreshIfRemoteUpdated();
        editingProjectId = null;
        document.getElementById('modal-title').textContent = '新規製番登録';
        deleteProjectBtn.style.display = 'none';
        copyFromSection.style.display = 'block'; // コピー機能を表示
        copySearchInput.value = ''; // 検索窓をリセット
        copySearchResults.style.display = 'none';
        addProjectForm.reset();
        
        // Reset necessity to default all required
        currentNecessityData = {
            specDoc: true,
            sheetMetal: true,
            partsProcurement: { main: true, spare: true, provided: true },
            nameplateProcurement: true,
            internalDrawings: true,
            software: true
        };
        renderNecessityButtons();
        
        modalOverlay.classList.add('active');
    };
    closeModalBtn.onclick = () => modalOverlay.classList.remove('active');
    cancelBtn.onclick = () => modalOverlay.classList.remove('active');

    // 既存案件からのコピー検索ロジック
    copySearchInput.oninput = () => {
        const query = copySearchInput.value.trim().toLowerCase();
        if (!query) {
            copySearchResults.style.display = 'none';
            return;
        }

        const matches = state.projects.filter(p => 
            p.id.toLowerCase().includes(query) ||
            (p.customer || '').toLowerCase().includes(query) ||
            (p.subject || '').toLowerCase().includes(query)
        ).slice(0, 15); // 最大15件

        copySearchResults.innerHTML = '';
        if (matches.length > 0) {
            matches.forEach(project => {
                const div = document.createElement('div');
                div.className = 'search-result-item';
                div.style.padding = '0.75rem';
                div.style.cursor = 'pointer';
                div.style.borderBottom = '1px solid rgba(255,255,255,0.05)';
                
                div.innerHTML = `
                    <div style="font-weight: 600; color: var(--primary-color); font-size: 0.95rem;">${project.id}</div>
                    <div style="font-size: 0.8rem; color: #e2e8f0; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; margin-top: 2px;">
                        ${project.customer || '-'} | ${project.subject || '-'}
                    </div>
                `;
                
                div.onclick = () => {
                    applyCopyFrom(project);
                    copySearchResults.style.display = 'none';
                    copySearchInput.value = '';
                };
                
                // Hover effect
                div.onmouseenter = () => {
                    div.style.backgroundColor = 'var(--primary-color)';
                    div.querySelectorAll('div').forEach(el => el.style.color = 'white');
                };
                div.onmouseleave = () => {
                    div.style.backgroundColor = 'transparent';
                    div.querySelector('div:first-child').style.color = 'var(--primary-color)';
                    div.querySelector('div:last-child').style.color = '#e2e8f0';
                };
                
                copySearchResults.appendChild(div);
            });
        } else {
            const div = document.createElement('div');
            div.style.padding = '0.75rem';
            div.style.color = 'var(--text-muted)';
            div.style.fontSize = '0.8rem';
            div.textContent = '一致する案件がありません';
            copySearchResults.appendChild(div);
        }
        copySearchResults.style.display = 'block';
    };

    // 検索結果以外をクリックした時にリストを閉じる
    document.addEventListener('click', (e) => {
        if (!copySearchInput.contains(e.target) && !copySearchResults.contains(e.target)) {
            copySearchResults.style.display = 'none';
        }
    });

    deleteProjectBtn.onclick = async () => {
        if (editingProjectId) {
            const projectId = editingProjectId;
            if (deleteProject(projectId)) {
                modalOverlay.classList.remove('active');
                // 自動保存を実行
                await saveWithSync(true);
            }
        }
    };

    // Process Spec Modal
    closeSpecModalBtn.onclick = () => processSpecModal.classList.remove('active');
    cancelSpecModalBtn.onclick = () => processSpecModal.classList.remove('active');

    // Process Sheet Metal Modal
    closeSheetMetalModalBtn.onclick = () => processSheetMetalModal.classList.remove('active');
    cancelSheetMetalModalBtn.onclick = () => processSheetMetalModal.classList.remove('active');
    saveSheetMetalModalBtn.onclick = async () => {
        if (!editingProcessProjectId) return;

        const index = state.projects.findIndex(p => p.id === editingProcessProjectId);
        if (index !== -1) {
            currentSheetMetalData.vendor = smVendorSelect.value;
            currentSheetMetalData.poDueDate = smPoDueDate.value;
            currentSheetMetalData.drawingDueDate = smDrawingDueDate.value;
            currentSheetMetalData.drawingLimitDate = smDrawingLimitDate.value;
            currentSheetMetalData.memo = smMemoInput.value;

            state.projects[index].processes.sheetMetal = { ...currentSheetMetalData };
            renderTable();
            // 自動保存を実行
            await saveWithSync(true);
        }
        processSheetMetalModal.classList.remove('active');
    };

    // Process Parts Procurement Modal
    closePartsModalBtn.onclick = () => processPartsModal.classList.remove('active');
    cancelPartsModalBtn.onclick = () => processPartsModal.classList.remove('active');
    savePartsModalBtn.onclick = async () => {
        if (!editingProcessProjectId) return;

        const index = state.projects.findIndex(p => p.id === editingProcessProjectId);
        if (index !== -1) {
            currentPartsData.main.dueDate = ppMainDueDate.value;
            currentPartsData.spare.dueDate = ppSpareDueDate.value;
            currentPartsData.provided.dueDate = ppProvDueDate.value;
            currentPartsData.memo = ppMemoInput.value;

            // deep copy to avoid reference issues
            state.projects[index].processes.partsProcurement = JSON.parse(JSON.stringify(currentPartsData));
            renderTable();
            // 自動保存を実行
            await saveWithSync(true);
        }
        processPartsModal.classList.remove('active');
    };

    // Process Nameplate Procurement Modal
    closeNameplateModalBtn.onclick = () => processNameplateModal.classList.remove('active');
    cancelNameplateModalBtn.onclick = () => processNameplateModal.classList.remove('active');
    saveNameplateModalBtn.onclick = async () => {
        if (!editingProcessProjectId) return;

        const index = state.projects.findIndex(p => p.id === editingProcessProjectId);
        if (index !== -1) {
            currentNameplateData.dueDate = npDueDate.value;
            currentNameplateData.memo = npMemoInput.value;

            state.projects[index].processes.nameplateProcurement = { ...currentNameplateData };
            renderTable();
            // 自動保存を実行
            await saveWithSync(true);
        }
        processNameplateModal.classList.remove('active');
    };

    // Process Internal Drawings Modal
    closeInternalDrawingsModalBtn.onclick = () => processInternalDrawingsModal.classList.remove('active');
    cancelInternalDrawingsModalBtn.onclick = () => processInternalDrawingsModal.classList.remove('active');
    saveInternalDrawingsModalBtn.onclick = async () => {
        if (!editingProcessProjectId) return;

        const index = state.projects.findIndex(p => p.id === editingProcessProjectId);
        if (index !== -1) {
            currentInternalDrawingsData.memo = idMemoInput.value;
            state.projects[index].processes.internalDrawings = { ...currentInternalDrawingsData };
            renderTable();
            // 自動保存を実行
            await saveWithSync(true);
        }
        processInternalDrawingsModal.classList.remove('active');
    };

    // Process Software Modal
    closeSoftwareModalBtn.onclick = () => processSoftwareModal.classList.remove('active');
    cancelSoftwareModalBtn.onclick = () => processSoftwareModal.classList.remove('active');
    saveSoftwareModalBtn.onclick = async () => {
        if (!editingProcessProjectId) return;

        const index = state.projects.findIndex(p => p.id === editingProcessProjectId);
        if (index !== -1) {
            currentSoftwareData.memo = swMemoInput.value;
            state.projects[index].processes.software = { ...currentSoftwareData };
            renderTable();
            // 自動保存を実行
            await saveWithSync(true);
        }
        processSoftwareModal.classList.remove('active');
    };
    saveSpecModalBtn.onclick = async () => {
        if (!editingProcessProjectId) return;
        const project = state.projects.find(p => p.id === editingProcessProjectId);
        if (project) {
            project.processes.specDoc = {
                ...currentSpecData,
                dueDate: specDueInput.value,
                memo: specMemoInput.value
            };
            renderTable();
            // 自動保存を実行
            await saveWithSync(true);
        }
        processSpecModal.classList.remove('active');
    };

    // Toggle Buttons Logic
    const getTodayStr = () => {
        const d = new Date();
        const year = d.getFullYear();
        const month = String(d.getMonth() + 1).padStart(2, '0');
        const day = String(d.getDate()).padStart(2, '0');
        return `${year}-${month}-${day}`;
    };

    specIssueBtn.onclick = () => {
        currentSpecData.issueDate = currentSpecData.issueDate ? '' : getTodayStr();
        renderSpecDocModal();
    };
    specIssueDateInput.onchange = (e) => {
        currentSpecData.issueDate = e.target.value;
        renderSpecDocModal();
    };
    specMemoInput.oninput = (e) => {
        currentSpecData.memo = e.target.value;
    };

    specReturnBtn.onclick = () => {
        currentSpecData.returnDate = currentSpecData.returnDate ? '' : getTodayStr();
        renderSpecDocModal();
    };
    specReturnDateInput.onchange = (e) => {
        currentSpecData.returnDate = e.target.value;
        renderSpecDocModal();
    };

    specApprovalBtn.onclick = () => {
        currentSpecData.approvalDate = currentSpecData.approvalDate ? '' : getTodayStr();
        renderSpecDocModal();
    };
    specApprovalDateInput.onchange = (e) => {
        currentSpecData.approvalDate = e.target.value;
        renderSpecDocModal();
    };

    // Needs Fix Logic
    specFixYesBtn.onclick = () => {
        currentSpecData.needsFix = currentSpecData.needsFix === '要' ? '' : '要';
        if (currentSpecData.needsFix === '要') {
            currentSpecData.issueDate = '';
            currentSpecData.dueDate = '';
            specDueInput.value = '';
        }
        renderSpecDocModal();
    };

    specFixNoBtn.onclick = () => {
        currentSpecData.needsFix = currentSpecData.needsFix === '否' ? '' : '否';
        renderSpecDocModal();
    };

    // Sheet Metal Toggle Logic
    const setupSmToggle = (btnEl, inputEl, key) => {
        btnEl.onclick = () => {
            currentSheetMetalData[key] = currentSheetMetalData[key] ? '' : getTodayStr();
            renderSheetMetalModal();
        };
        inputEl.onchange = (e) => {
            currentSheetMetalData[key] = e.target.value;
            renderSheetMetalModal();
        };
    };

    setupSmToggle(smQuoteBtn, smQuoteDate, 'quoteDate');
    setupSmToggle(smPoSentBtn, smPoSentDate, 'poSentDate');
    setupSmToggle(smPoRecvBtn, smPoRecvDate, 'poRecvDate');
    setupSmToggle(smDrawingSentBtn, smDrawingSentDate, 'drawingSentDate');
    setupSmToggle(smConfirmedBtn, smConfirmedDate, 'confirmedDate');
    smMemoInput.oninput = (e) => {
        currentSheetMetalData.memo = e.target.value;
    };

    // Parts Procurement Toggle Logic
    const setupPpToggle = (btnEl, inputEl, category, key) => {
        btnEl.onclick = () => {
            currentPartsData[category][key] = currentPartsData[category][key] ? '' : getTodayStr();
            renderPartsModal();
        };
        inputEl.onchange = (e) => {
            currentPartsData[category][key] = e.target.value;
            renderPartsModal();
        };
    };

    setupPpToggle(ppMainReqBtn, ppMainReqDate, 'main', 'requestDate');
    setupPpToggle(ppSpareReqBtn, ppSpareReqDate, 'spare', 'requestDate');
    setupPpToggle(ppSpareCopyBtn, ppSpareCopyDate, 'spare', 'copyDate');
    setupPpToggle(ppProvReqBtn, ppProvReqDate, 'provided', 'requestDate');
    ppMemoInput.oninput = (e) => {
        currentPartsData.memo = e.target.value;
    };

    // Nameplate Procurement Toggle Logic
    const setupNpToggle = (btnEl, inputEl, key) => {
        btnEl.onclick = () => {
            currentNameplateData[key] = currentNameplateData[key] ? '' : getTodayStr();
            renderNameplateModal();
        };
        inputEl.onchange = (e) => {
            currentNameplateData[key] = e.target.value;
            renderNameplateModal();
        };
    };

    setupNpToggle(npPoSentBtn, npPoSentDate, 'poSentDate');
    npMemoInput.oninput = (e) => {
        currentNameplateData.memo = e.target.value;
    };

    // Internal Drawings Toggle Logic
    const setupIdToggle = (btnEl, inputEl, key) => {
        btnEl.onclick = () => {
            currentInternalDrawingsData[key] = currentInternalDrawingsData[key] ? '' : getTodayStr();
            renderInternalDrawingsModal();
        };
        inputEl.onchange = (e) => {
            currentInternalDrawingsData[key] = e.target.value;
            renderInternalDrawingsModal();
        };
    };

    setupIdToggle(idIssueBtn, idIssueDate, 'issueDate');
    idMemoInput.oninput = (e) => {
        currentInternalDrawingsData.memo = e.target.value;
    };

    // Software Toggle Logic
    const setupSwToggle = (btnEl, inputEl, key) => {
        btnEl.onclick = () => {
            currentSoftwareData[key] = currentSoftwareData[key] ? '' : getTodayStr();
            renderSoftwareModal();
        };
        inputEl.onchange = (e) => {
            currentSoftwareData[key] = e.target.value;
            renderSoftwareModal();
        };
    };

    setupSwToggle(swCreationBtn, swCreationDate, 'creationDate');
    setupSwToggle(swDebuggingBtn, swDebuggingDate, 'debuggingDate');
    swMemoInput.oninput = (e) => {
        currentSoftwareData.memo = e.target.value;
    };

    // Necessity Toggle Handlers
    const setNecHandler = (yesBtn, noBtn, key, subKey = null) => {
        if (!yesBtn || !noBtn) return;
        yesBtn.onclick = () => {
            if (subKey) {
                if (!currentNecessityData[key]) currentNecessityData[key] = {};
                currentNecessityData[key][subKey] = true;
            }
            else currentNecessityData[key] = true;
            renderNecessityButtons();
        };
        noBtn.onclick = () => {
            if (subKey) {
                if (!currentNecessityData[key]) currentNecessityData[key] = {};
                currentNecessityData[key][subKey] = false;
            }
            else currentNecessityData[key] = false;
            renderNecessityButtons();
        };
    };

    setNecHandler(necSpecYes, necSpecNo, 'specDoc');
    setNecHandler(necSmYes, necSmNo, 'sheetMetal');
    setNecHandler(necPpMainYes, necPpMainNo, 'partsProcurement', 'main');
    setNecHandler(necPpSpareYes, necPpSpareNo, 'partsProcurement', 'spare');
    setNecHandler(necPpProvYes, necPpProvNo, 'partsProcurement', 'provided');
    setNecHandler(necNpYes, necNpNo, 'nameplateProcurement');
    setNecHandler(necIdYes, necIdNo, 'internalDrawings');
    setNecHandler(necSwYes, necSwNo, 'software');

    // Settings Modal
    settingsBtn.onclick = async () => {
        await refreshIfRemoteUpdated();
        // 後方互換性: 古い文字列データがあればオブジェクトに変換してコピー
        tempCustomerList = (state.config.customerList || []).map(item =>
            typeof item === 'string' ? { name: item, kana: item } : { ...item }
        );
        tempSpecList = [...(state.config.specList || [])];
        tempVendorList = [...(state.config.sheetMetalVendors || [])];
        tempStaffList = [...(state.config.staffList || [])];
        resetEditStates();
        renderSettingsLists();
        settingsOverlay.classList.add('active');
    };
    closeSettingsBtn.onclick = () => { settingsOverlay.classList.remove('active'); resetEditStates(); };
    cancelSettingsBtn.onclick = () => { settingsOverlay.classList.remove('active'); resetEditStates(); };
    settingsOverlay.onclick = (e) => {
        if (e.target === settingsOverlay) settingsOverlay.classList.remove('active');
    };

    // Add/Update Customer
    addCustomerBtn.onclick = () => {
        const nameVal = newCustomerNameInput.value.trim();
        const kanaVal = newCustomerKanaInput.value.trim() || nameVal; // フリガナ未入力なら名前を代入

        if (nameVal) {
            const isDuplicate = tempCustomerList.some((c, idx) => c.name === nameVal && idx !== editingCustomerIndex);
            if (isDuplicate) {
                alert('すでに登録されている客先です。');
                return;
            }

            if (editingCustomerIndex !== null) {
                tempCustomerList[editingCustomerIndex] = { name: nameVal, kana: kanaVal };
                editingCustomerIndex = null;
                addCustomerBtn.textContent = '追加';
            } else {
                tempCustomerList.push({ name: nameVal, kana: kanaVal });
            }

            // フリガナベースでソート
            tempCustomerList.sort((a, b) => a.kana.localeCompare(b.kana, 'ja'));
            newCustomerNameInput.value = '';
            newCustomerKanaInput.value = '';
            baseKana = '';
            renderSettingsLists();
        }
    };

    // Add/Update Spec
    addSpecBtn.onclick = () => {
        const val = newSpecInput.value.trim();
        if (val) {
            const isDuplicate = tempSpecList.some((s, idx) => s === val && idx !== editingSpecIndex);
            if (isDuplicate) {
                alert('すでに登録されている規格です。');
                return;
            }

            if (editingSpecIndex !== null) {
                tempSpecList[editingSpecIndex] = val;
                editingSpecIndex = null;
                addSpecBtn.textContent = '追加';
            } else {
                tempSpecList.push(val);
            }

            tempSpecList.sort((a, b) => a.localeCompare(b, 'ja')); // 自動ソート
            newSpecInput.value = '';
            renderSettingsLists();
        }
    };

    // Add/Update Vendor
    addVendorBtn.onclick = () => {
        const val = newVendorInput.value.trim();
        if (val) {
            const isDuplicate = tempVendorList.some((v, idx) => v === val && idx !== editingVendorIndex);
            if (isDuplicate) {
                alert('すでに登録されている業者です。');
                return;
            }

            if (editingVendorIndex !== null) {
                tempVendorList[editingVendorIndex] = val;
                editingVendorIndex = null;
                addVendorBtn.textContent = '追加';
            } else {
                tempVendorList.push(val);
            }

            tempVendorList.sort((a, b) => a.localeCompare(b, 'ja')); // 自動ソート
            newVendorInput.value = '';
            renderSettingsLists();
        }
    };

    // Add/Update Staff
    addStaffBtn.onclick = () => {
        const val = newStaffInput.value.trim();
        if (val) {
            const isDuplicate = tempStaffList.some((s, idx) => s === val && idx !== editingStaffIndex);
            if (isDuplicate) {
                alert('すでに登録されている担当者です。');
                return;
            }

            if (editingStaffIndex !== null) {
                tempStaffList[editingStaffIndex] = val;
                editingStaffIndex = null;
                addStaffBtn.textContent = '追加';
            } else {
                tempStaffList.push(val);
            }

            tempStaffList.sort((a, b) => a.localeCompare(b, 'ja')); // 自動ソート
            newStaffInput.value = '';
            renderSettingsLists();
        }
    };

    saveSettingsBtn.onclick = async () => {
        state.config.customerList = tempCustomerList;
        state.config.specList = tempSpecList;
        state.config.sheetMetalVendors = tempVendorList;
        state.config.staffList = tempStaffList;

        populateSelectOptions();
        renderHeader();
        renderTable();
        settingsOverlay.classList.remove('active');
        resetEditStates();
        // 自動保存を実行
        await saveWithSync(true);
    };

    // File Sync
    syncFolderBtn.onclick = connectToFolder;
    refreshDataBtn.onclick = async () => {
        if (!dirHandle) {
            alert('同期フォルダが設定されていません。「同期設定」からフォルダを選択してください。');
            return;
        }
        await loadFromFolder();
        showToast('最新データを読み込みました');
    };

    modalOverlay.onclick = (e) => {
        if (e.target === modalOverlay) modalOverlay.classList.remove('active');
    };
    settingsOverlay.onclick = (e) => {
        if (e.target === settingsOverlay) settingsOverlay.classList.remove('active');
    };

    addProjectForm.onsubmit = async (e) => {
        e.preventDefault();
        const data = {
            id: document.getElementById('project-id').value,
            deadline: document.getElementById('project-deadline').value,
            customer: document.getElementById('project-customer').value,
            subject: document.getElementById('project-subject').value,
            destination: document.getElementById('project-destination').value,
            name: document.getElementById('project-name').value,
            quantity: document.getElementById('project-quantity').value,
            spec: document.getElementById('project-spec').value,
            staff: document.getElementById('project-staff').value,
            inspection: document.getElementById('project-inspection').value,
            budget: document.getElementById('project-budget').value,
            link: document.getElementById('project-link').value,
            remarks: document.getElementById('project-remarks').value,
            necessity: JSON.parse(JSON.stringify(currentNecessityData))
        };

        if (editingProjectId) {
            updateProject(editingProjectId, data);
        } else {
            addNewProject(data);
        }

        addProjectForm.reset();
        modalOverlay.classList.remove('active');
        
        // 自動保存を実行
        await saveWithSync(true);
    };

    // Filter Events
    const filterEvents = ['input', 'change'];
    [filterId, filterCustomer, filterSubject, filterDestination, filterName, filterStaff].forEach(el => {
        if (!el) return;
        filterEvents.forEach(evt => {
            el.addEventListener(evt, renderTable);
        });
    });

    processFilterBtns.forEach(btn => {
        btn.onclick = () => {
            const filterKey = btn.getAttribute('data-filter');
            if (activeProcessFilters.has(filterKey)) {
                activeProcessFilters.delete(filterKey);
                btn.classList.remove('active');
            } else {
                activeProcessFilters.add(filterKey);
                btn.classList.add('active');
            }
            renderTable();
        };
    });

    filterExcludeCompleted.onclick = () => {
        excludeCompletedFilter = !excludeCompletedFilter;
        filterExcludeCompleted.classList.toggle('active', excludeCompletedFilter);
        renderTable();
    };

    clearFiltersBtn.onclick = () => {
        [filterId, filterCustomer, filterSubject, filterDestination, filterName, filterStaff].forEach(el => {
            if (el) el.value = '';
        });
        activeProcessFilters.clear();
        processFilterBtns.forEach(btn => btn.classList.remove('active'));
        excludeCompletedFilter = false;
        filterExcludeCompleted.classList.remove('active');
        renderTable();
    };

    // Tab Events (Main)
    mainTabBtns.forEach(btn => {
        btn.onclick = () => {
            if (btn.disabled) return;
            const target = btn.getAttribute('data-tab');
            mainTabBtns.forEach(b => b.classList.toggle('active', b === btn));
            mainTabContents.forEach(c => c.classList.toggle('active', c.id === target));
        };
    });

    // Tab Events (Settings)
    settingsTabBtns.forEach(btn => {
        btn.onclick = () => {
            const target = btn.getAttribute('data-tab');
            settingsTabBtns.forEach(b => b.classList.toggle('active', b === btn));
            settingsTabContents.forEach(c => c.classList.toggle('active', c.id === target));
        };
    });

    // Sort Events
    const toggleSort = (field) => {
        if (sortField === field) {
            sortOrder = sortOrder === 'asc' ? 'desc' : 'asc';
        } else {
            sortField = field;
            sortOrder = 'asc';
        }
        renderTable();
    };

    if (sortIdHeader) sortIdHeader.onclick = () => toggleSort('id');
    if (sortDeadlineHeader) sortDeadlineHeader.onclick = () => toggleSort('deadline');
}

// Logic: Update Project
function updateProject(oldId, newData) {
    const index = state.projects.findIndex(p => p.id === oldId);
    if (index !== -1) {
        // 工程データは維持し、それ以外の情報を上書き
        state.projects[index] = {
            ...state.projects[index],
            ...newData
        };
        renderTable();

    }
}

// Logic: Delete Project
function deleteProject(projectId) {
    if (confirm(`製番 ${projectId} を削除してもよろしいですか？\nこの操作は取り消せません。`)) {
        state.projects = state.projects.filter(p => p.id !== projectId);
        renderTable();
        return true;
    }
    return false;
}

// Logic: File Operations
function showToast(message) {
    const toast = document.createElement('div');
    toast.className = 'toast';
    toast.innerHTML = `<i data-lucide="check-circle" style="width:16px;height:16px;color:var(--success-color);"></i> ${message}`;
    document.body.appendChild(toast);
    lucide.createIcons({ root: toast });

    setTimeout(() => toast.classList.add('show'), 10);

    setTimeout(() => {
        toast.classList.remove('show');
        setTimeout(() => toast.remove(), 300);
    }, 3000);
}

// Logic: Render Settings Lists
function resetEditStates() {
    editingCustomerIndex = null;
    editingSpecIndex = null;
    editingVendorIndex = null;
    editingStaffIndex = null;
    addCustomerBtn.textContent = '追加';
    addSpecBtn.textContent = '追加';
    addVendorBtn.textContent = '追加';
    addStaffBtn.textContent = '追加';
    newCustomerNameInput.value = '';
    newCustomerKanaInput.value = '';
    newSpecInput.value = '';
    newVendorInput.value = '';
    newStaffInput.value = '';
}

function renderSettingsLists() {
    const createListHTML = (list, container, type) => {
        container.innerHTML = '';
        list.forEach((item, index) => {
            const li = document.createElement('li');
            li.className = 'list-item';

            if (type === 'customer' && index === editingCustomerIndex) {
                li.classList.add('editing');
            } else if (type === 'spec' && index === editingSpecIndex) {
                li.classList.add('editing');
            } else if (type === 'vendor' && index === editingVendorIndex) {
                li.classList.add('editing');
            } else if (type === 'staff' && index === editingStaffIndex) {
                li.classList.add('editing');
            }

            const span = document.createElement('span');
            if (type === 'customer') {
                span.textContent = `${item.name} (${item.kana})`;
            } else {
                span.textContent = item;
            }

            const actionDiv = document.createElement('div');
            actionDiv.style.display = 'flex';
            actionDiv.style.gap = '0.25rem';

            const editBtn = document.createElement('button');
            editBtn.className = 'btn-icon';
            editBtn.innerHTML = '<i data-lucide="edit-2" style="width:14px; height:14px;"></i>';
            editBtn.onclick = () => {
                if (type === 'customer') {
                    newCustomerNameInput.value = item.name;
                    newCustomerKanaInput.value = item.kana;
                    editingCustomerIndex = index;
                    addCustomerBtn.textContent = '更新';
                } else if (type === 'spec') {
                    newSpecInput.value = item;
                    editingSpecIndex = index;
                    addSpecBtn.textContent = '更新';
                } else if (type === 'vendor') {
                    newVendorInput.value = item;
                    editingVendorIndex = index;
                    addVendorBtn.textContent = '更新';
                } else if (type === 'staff') {
                    newStaffInput.value = item;
                    editingStaffIndex = index;
                    addStaffBtn.textContent = '更新';
                }
                renderSettingsLists(); // ハイライトを反映するために再描画
            };

            const deleteBtn = document.createElement('button');
            deleteBtn.className = 'btn-icon';
            deleteBtn.style.color = 'var(--danger-color)';
            deleteBtn.innerHTML = '<i data-lucide="trash-2" style="width:14px; height:14px;"></i>';
            deleteBtn.onclick = () => {
                if (type === 'customer') {
                    tempCustomerList.splice(index, 1);
                    if (editingCustomerIndex === index) resetEditStates();
                } else if (type === 'spec') {
                    tempSpecList.splice(index, 1);
                    if (editingSpecIndex === index) resetEditStates();
                } else if (type === 'vendor') {
                    tempVendorList.splice(index, 1);
                    if (editingVendorIndex === index) resetEditStates();
                } else if (type === 'staff') {
                    tempStaffList.splice(index, 1);
                    if (editingStaffIndex === index) resetEditStates();
                }
                renderSettingsLists();
            };

            actionDiv.appendChild(editBtn);
            actionDiv.appendChild(deleteBtn);

            li.appendChild(span);
            li.appendChild(actionDiv);
            container.appendChild(li);
        });
    };

    createListHTML(tempCustomerList, customerListContainer, 'customer');
    createListHTML(tempSpecList, specListContainer, 'spec');
    createListHTML(tempVendorList, vendorListContainer, 'vendor');
    createListHTML(tempStaffList, staffListContainer, 'staff');
    lucide.createIcons({ root: settingsOverlay });
}

// Logic: File Operations (Folder Sync)

async function refreshIfRemoteUpdated() {
    if (!dirHandle || isSaving) return;
    try {
        const fileHandle = await dirHandle.getFileHandle('team_data.json');
        const file = await fileHandle.getFile();
        // ファイルシステムの時刻が異なれば中身を確認
        if (file.lastModified !== lastFsModified) {
            const content = await file.text();
            const remoteData = JSON.parse(content);
            if (remoteData.lastUpdated !== state.lastUpdated) {
                console.log('Detected remote update before action, refreshing...');
                await loadFromFolder();
                showToast('最新データを読み込みました');
            }
        }
    } catch (e) {
        // Ignore
    }
}

async function connectToFolder() {
    try {
        dirHandle = await window.showDirectoryPicker();
        // 権限の確認
        if (await dirHandle.queryPermission({ mode: 'readwrite' }) !== 'granted') {
            await dirHandle.requestPermission({ mode: 'readwrite' });
        }
        
        await loadFromFolder();
        updateSyncStatusUI('connected');
        showToast('共有フォルダに接続しました');
        startAutoSync();
    } catch (err) {
        if (err.name !== 'AbortError') {
            console.error('Folder connection failed:', err);
            alert('フォルダ接続に失敗しました');
        }
    }
}

async function loadFromFolder() {
    if (!dirHandle) return;
    try {
        const fileHandle = await dirHandle.getFileHandle('team_data.json', { create: true });
        const file = await fileHandle.getFile();
        const content = await file.text();
        
        if (!content || content.trim() === '') {
            // 新規ファイルの場合は現在のstateを保存
            await saveToFolder(state);
            return;
        }

        const data = JSON.parse(content);
        if (data.projects && data.config) {
            state = data;
            lastLoadedData = JSON.parse(JSON.stringify(data)); // クローンを保存
            lastFsModified = file.lastModified; // FS時刻を保存
            renderHeader();
            renderTable();
            populateSelectOptions();
            updateSyncStatusUI('connected');
            
            // その日最初の接続時にバックアップを作成
            await saveToDailyBackup(data);
        }
    } catch (err) {
        console.error('Loading failed:', err);
        showToast('データの読み込みに失敗しました');
    }
}

async function saveWithSync(isAutoSave = false) {
    if (!dirHandle) {
        if (!isAutoSave) {
            alert('同期フォルダが設定されていません。「同期設定」からフォルダを選択してください。');
        }
        return;
    }

    if (isSaving) return;
    isSaving = true;
    updateSyncStatusUI('locked');

    try {
        // 1. ロックファイルの確認と作成
        let lockHandle;
        try {
            lockHandle = await dirHandle.getFileHandle('lock.json', { create: false });
            // すでにロックファイルがある場合
            const lockFile = await lockHandle.getFile();
            const lockTime = lockFile.lastModified;
            const now = Date.now();
            
            // 5分以上古いロックは無視（デッドロック対策）
            if (now - lockTime < 5 * 60 * 1000) {
                // 削除を試みる
                await dirHandle.removeEntry('lock.json');
            } else {
                alert('現在、他の人が保存中です。数秒待ってからやり直してください。');
                isSaving = false;
                updateSyncStatusUI('connected');
                return;
            }
        } catch (e) {
            // ロックファイルがない場合は正常
        }

        // ロック作成
        lockHandle = await dirHandle.getFileHandle('lock.json', { create: true });
        const writableLock = await lockHandle.createWritable();
        await writableLock.write(JSON.stringify({ user: 'active-user', time: Date.now() }));
        await writableLock.close();

        // 2. 競合チェック
        const fileHandle = await dirHandle.getFileHandle('team_data.json');
        const file = await fileHandle.getFile();
        const content = await file.text();
        const currentFileData = JSON.parse(content);

        if (currentFileData.lastUpdated && lastLoadedData && currentFileData.lastUpdated !== lastLoadedData.lastUpdated) {
            alert('編集中に他の人がデータを更新しました。データ整合性を守るため、最新のデータを読み込みます。\n恐れ入りますが、もう一度編集をお願いいたします。');
            await dirHandle.removeEntry('lock.json');
            await loadFromFolder();
            isSaving = false;
            updateSyncStatusUI('connected');
            return;
        }

        // 3. 書き込み
        state.lastUpdated = new Date().toISOString();
        await saveToFolder(state);
        lastLoadedData = JSON.parse(JSON.stringify(state));
        
        // 保存後のファイルシステム時刻を再取得
        const updatedFile = await (await dirHandle.getFileHandle('team_data.json')).getFile();
        lastFsModified = updatedFile.lastModified;

        // 4. ロック解除
        await dirHandle.removeEntry('lock.json');
        showToast('データを同期しました');

    } catch (err) {
        console.error('Sync failed:', err);
        alert('同期に失敗しました：' + err.message);
    } finally {
        isSaving = false;
        updateSyncStatusUI('connected');
    }
}

async function saveToFolder(data) {
    const fileHandle = await dirHandle.getFileHandle('team_data.json', { create: true });
    const writable = await fileHandle.createWritable();
    await writable.write(JSON.stringify(data, null, 2));
    await writable.close();
}

async function saveToDailyBackup(data) {
    if (!dirHandle) return;
    try {
        const backupsDir = await dirHandle.getDirectoryHandle('backups', { create: true });
        const now = new Date();
        const today = now.getFullYear() + String(now.getMonth() + 1).padStart(2, '0') + String(now.getDate()).padStart(2, '0');
        const fileName = `daily_${today}.json`;
        
        // 今日の分が既に存在するかチェック
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
            console.log('Daily backup created:', fileName);
            
            // 古いバックアップの削除（30日分保持）
            await cleanupOldBackups(backupsDir);
        }
    } catch (err) {
        console.error('Backup failed:', err);
    }
}

async function cleanupOldBackups(backupsDir) {
    try {
        const entries = [];
        for await (const entry of backupsDir.values()) {
            if (entry.kind === 'file' && entry.name.startsWith('daily_')) {
                entries.push(entry);
            }
        }
        
        // 名前順（日付順）にソートして、古いもの（先頭）を削除
        entries.sort((a, b) => a.name.localeCompare(b.name));
        
        const MAX_BACKUPS = 30;
        if (entries.length > MAX_BACKUPS) {
            const toDelete = entries.slice(0, entries.length - MAX_BACKUPS);
            for (const entry of toDelete) {
                await backupsDir.removeEntry(entry.name);
                console.log('Old backup removed:', entry.name);
            }
        }
    } catch (e) {
        console.error('Cleanup failed:', e);
    }
}

function updateSyncStatusUI(status) {
    if (!syncStatusEl) return;
    
    syncStatusEl.className = 'sync-status ' + status;
    
    if (status === 'connected') {
        syncStatusEl.innerHTML = `<i data-lucide="cloud-check"></i> 同期中: ${state.lastUpdated ? formatTime(state.lastUpdated) : '接続済'}`;
    } else if (status === 'locked') {
        syncStatusEl.innerHTML = `<i data-lucide="lock"></i> 同期処理中...`;
    } else {
        syncStatusEl.innerHTML = `<i data-lucide="cloud-off"></i> フォルダ未接続`;
    }
    lucide.createIcons({ root: syncStatusEl });
}

function formatTime(isoStr) {
    const d = new Date(isoStr);
    return `${d.getHours()}:${String(d.getMinutes()).padStart(2, '0')}`;
}

function startAutoSync() {
    if (syncInterval) clearInterval(syncInterval);
    syncInterval = setInterval(async () => {
        if (!dirHandle || isSaving) return;
        
        try {
            const fileHandle = await dirHandle.getFileHandle('team_data.json');
            const file = await fileHandle.getFile();
            // ファイルシステムの時刻が異なれば中身を確認
            if (file.lastModified !== lastFsModified) {
                // 内容を軽くチェック
                const content = await file.text();
                const remoteData = JSON.parse(content);
                if (remoteData.lastUpdated !== state.lastUpdated) {
                    console.log('Detected remote update, refreshing...');
                    await loadFromFolder();
                    showToast('最新のデータを読み込みました');
                }
            }
        } catch (e) {
            // ファイルがないなどの場合は無視
        }
    }, 30000); // 30秒ごとにチェック
}

// Logic: Add New Project
function addNewProject(data) {
    const newProject = {
        ...data,
        isCompleted: false,
        processes: {
            specDoc: {
                issueDate: '',
                dueDate: '',
                returnDate: '',
                needsFix: '',
                approvalDate: '',
                memo: ''
            },
            sheetMetal: {
                quoteDate: '',
                vendor: '',
                poSentDate: '',
                poDueDate: '',
                drawingDueDate: '',
                poRecvDate: '',
                drawingSentDate: '',
                drawingLimitDate: '',
                confirmedDate: '',
                memo: ''
            },
            partsProcurement: {
                main: { requestDate: '', dueDate: '' },
                spare: { requestDate: '', copyDate: '', dueDate: '' },
                provided: { requestDate: '', dueDate: '' },
                memo: ''
            },
            nameplateProcurement: {
                poSentDate: '',
                dueDate: '',
                memo: ''
            },
            internalDrawings: {
                issueDate: '',
                memo: ''
            },
            software: {
                creationDate: '',
                debuggingDate: '',
                memo: ''
            }
        },
        necessity: data.necessity || {
            specDoc: true,
            sheetMetal: true,
            partsProcurement: { main: true, spare: true, provided: true },
            nameplateProcurement: true,
            internalDrawings: true,
            software: true
        }
    };

    state.projects.unshift(newProject);
    renderTable();
}

// Render Table Header
function renderHeader() {
    const headerRow = document.getElementById('table-header-row');
    const staticStartCount = 8; // 製番, 担当者, リンク, 客先, 件名, 向先, 品名, 納期
    const staticEndCount = 0;

    // Remove all dynamic columns
    while (headerRow.children.length > staticStartCount + staticEndCount) {
        headerRow.removeChild(headerRow.children[staticStartCount]);
    }

    const thSpec = document.createElement('th');
    thSpec.textContent = '納入仕様書';
    thSpec.style.textAlign = 'center';
    headerRow.appendChild(thSpec);

    const thSheetMetal = document.createElement('th');
    thSheetMetal.textContent = '板金手配';
    thSheetMetal.style.textAlign = 'center';
    headerRow.appendChild(thSheetMetal);

    const thParts = document.createElement('th');
    thParts.textContent = '部品手配';
    thParts.style.textAlign = 'center';
    headerRow.appendChild(thParts);

    const thNameplate = document.createElement('th');
    thNameplate.textContent = '銘板手配';
    thNameplate.style.textAlign = 'center';
    headerRow.appendChild(thNameplate);

    const thInternalDrawings = document.createElement('th');
    thInternalDrawings.textContent = '社内工事図';
    thInternalDrawings.style.textAlign = 'center';
    headerRow.appendChild(thInternalDrawings);

    const thSoftware = document.createElement('th');
    thSoftware.textContent = 'ソフト';
    thSoftware.style.textAlign = 'center';
    headerRow.appendChild(thSoftware);

    const thCompleted = document.createElement('th');
    thCompleted.textContent = '完了';
    thCompleted.style.textAlign = 'center';
    thCompleted.style.width = '60px';
    headerRow.appendChild(thCompleted);
}

// Render Table Body
function renderTable() {
    progressBody.innerHTML = '';

    // Apply Sorting
    const sortedProjects = [...state.projects].sort((a, b) => {
        let valA = a[sortField] || '';
        let valB = b[sortField] || '';
        if (sortOrder === 'desc') {
            return valB.localeCompare(valA, 'ja', { numeric: true });
        }
        return valA.localeCompare(valB, 'ja', { numeric: true });
    });

    // Update Sort UI
    const updateHeaderIcon = (headerEl, field) => {
        if (!headerEl) return;
        headerEl.classList.toggle('sort-active', sortField === field);
        const wrapper = headerEl.querySelector('.icon-wrapper');
        if (wrapper) {
            const iconName = sortField === field ? (sortOrder === 'asc' ? 'chevron-up' : 'chevron-down') : 'chevrons-up-down';
            wrapper.innerHTML = `<i data-lucide="${iconName}" class="sort-icon"></i>`;
        }
    };

    updateHeaderIcon(sortIdHeader, 'id');
    updateHeaderIcon(sortDeadlineHeader, 'deadline');
    lucide.createIcons({ root: document.getElementById('table-header-row') });

    // Apply Filters
    const filteredProjects = sortedProjects.filter(project => {
        const matchId = !filterId.value || project.id.toLowerCase().includes(filterId.value.toLowerCase());
        const matchCustomer = !filterCustomer.value || (project.customer || '').toLowerCase().includes(filterCustomer.value.toLowerCase());
        const matchSubject = !filterSubject.value || (project.subject || '').toLowerCase().includes(filterSubject.value.toLowerCase());
        const matchDestination = !filterDestination.value || (project.destination || '').toLowerCase().includes(filterDestination.value.toLowerCase());
        const matchName = !filterName.value || (project.name || '').toLowerCase().includes(filterName.value.toLowerCase());
        const matchStaff = !filterStaff.value || project.staff === filterStaff.value;
        
        const excludeCompleted = excludeCompletedFilter && project.isCompleted;
        
        let matchProcessFilters = true;
        if (activeProcessFilters.size > 0) {
            const nec = project.necessity || { specDoc: true, sheetMetal: true, partsProcurement: { main: true, spare: true, provided: true }, nameplateProcurement: true, internalDrawings: true, software: true };
            const proc = project.processes || {};
            
            // Check if ANY of the active filters' corresponding processes are uncompleted
            matchProcessFilters = Array.from(activeProcessFilters).some(key => {
                if (key === 'partsProcurement') {
                    const ppNec = nec.partsProcurement || { main: true, spare: true, provided: true };
                    const ppMainDone = !ppNec.main || (proc.partsProcurement && proc.partsProcurement.main.requestDate);
                    const ppSpareDone = !ppNec.spare || (proc.partsProcurement && proc.partsProcurement.spare.requestDate);
                    const ppProvDone = !ppNec.provided || (proc.partsProcurement && proc.partsProcurement.provided.requestDate);
                    return !(ppMainDone && ppSpareDone && ppProvDone);
                }
                
                const isDone = !nec[key] || (proc[key] && (
                    (key === 'specDoc' && proc[key].approvalDate) ||
                    (key === 'sheetMetal' && proc[key].drawingSentDate && proc[key].drawingLimitDate) ||
                    (key === 'nameplateProcurement' && proc[key].poSentDate) ||
                    (key === 'internalDrawings' && proc[key].issueDate) ||
                    (key === 'software' && proc[key].creationDate)
                ));
                return !isDone;
            });
        }

        return matchId && matchCustomer && matchSubject && matchDestination && matchName && matchStaff && !excludeCompleted && matchProcessFilters;
    });

    filteredProjects.forEach(project => {
        const tr = document.createElement('tr');

        const resetTooltip = () => {
            const customer = state.config.customerList?.find(c => c.name === project.customer) || { name: project.customer || '-', kana: '' };
            const customerName = customer.kana ? `${customer.name} (${customer.kana})` : customer.name;
            const qty = project.quantity || '-';
            const memo = project.remarks || '-';
            tooltipEl.innerHTML = `<strong>${project.id}</strong><br>` +
                `担当者: ${project.staff || '-'}<br>` +
                `客先: ${customerName}<br>` +
                `件名: ${project.subject || '-'}<br>` +
                `向先: ${project.destination || '-'}<br>` +
                `品名: ${project.name || '-'}<br>` +
                `数量: ${qty}<br>` +
                `規格: ${project.spec || '-'}<br>` +
                `検査: ${project.inspection || '-'}<br>` +
                `板金予算: ${project.budget || '-'}<br>` +
                `リンク: ${project.link || '-'}<br>` +
                `メモ: ${memo}`;
        };

        tr.addEventListener('mouseenter', () => {
            resetTooltip();
            tooltipEl.classList.add('show');
        });
        tr.addEventListener('mousemove', (e) => {
            const margin = 15;
            let left = e.pageX + margin;
            let top = e.pageY + margin;

            // 画面端の判定（ビューポート基準）
            const tooltipWidth = tooltipEl.offsetWidth;
            const tooltipHeight = tooltipEl.offsetHeight;
            const viewportWidth = window.innerWidth;
            const viewportHeight = window.innerHeight;
            
            // マウスの現在位置（ビューポート内）
            const mouseX = e.clientX;
            const mouseY = e.clientY;

            // 右端で切れる場合、マウスの左側に表示
            if (mouseX + margin + tooltipWidth > viewportWidth) {
                left = e.pageX - tooltipWidth - margin;
            }

            // 下端で切れる場合、マウスの上側に表示
            if (mouseY + margin + tooltipHeight > viewportHeight) {
                top = e.pageY - tooltipHeight - margin;
            }

            tooltipEl.style.left = left + 'px';
            tooltipEl.style.top = top + 'px';
        });
        tr.addEventListener('mouseleave', () => {
            tooltipEl.classList.remove('show');
        });

        // Define columns to render
        const fields = [
            { key: 'id', bold: true },
            { key: 'staff' },
            { key: 'link', special: 'link' },
            { key: 'customer' },
            { key: 'subject' },
            { key: 'destination' },
            { key: 'name' },
            { key: 'deadline', special: 'deadline' }
        ];

        fields.forEach(field => {
            const td = document.createElement('td');
            td.style.cursor = 'pointer';
            td.onclick = async (e) => {
                // aタグ（リンク）クリック時は編集画面を開かない
                if (e.target.closest('a')) return;
                await refreshIfRemoteUpdated();
                const latestProject = state.projects.find(p => p.id === project.id);
                if (!latestProject) {
                    alert('対象のデータが見つかりません。他のユーザーによって製番が変更または削除された可能性があります。');
                    renderTable();
                    return;
                }
                openEditModal(latestProject);
            };

            if (field.special === 'link') {
                if (project.link) {
                    const a = document.createElement('a');
                    a.href = project.link;
                    a.target = '_blank';
                    a.className = 'btn-icon';
                    a.style.display = 'inline-flex';
                    a.innerHTML = '<i data-lucide="external-link" style="width:16px; height:16px;"></i>';
                    a.title = 'ブラウザで開く＆パスをコピー';

                    a.onclick = (e) => {
                        // コピー処理を実行（失敗してもリンクは開く）
                        navigator.clipboard.writeText(project.link).then(() => {
                            showToast('パスをクリップボードにコピーしました');
                        }).catch(err => {
                            console.error('Clipboard copy failed:', err);
                        });
                        // e.preventDefault() は呼ばないため、<a>タグの標準動作（別タブで開く）がそのまま実行される
                    };

                    td.appendChild(a);
                    td.style.textAlign = 'center';
                } else {
                    td.textContent = '-';
                    td.style.textAlign = 'center';
                    td.style.color = 'var(--text-muted)';
                }
            } else {
                td.textContent = project[field.key] || '-';
                if (field.bold) td.style.fontWeight = '600';

                if (field.special === 'deadline') {
                    if (isThisWeek(project.deadline)) {
                        td.style.color = 'var(--danger-color)';
                        td.style.fontWeight = 'bold';
                    }
                }
            }
            tr.appendChild(td);
        });

        // Process: Spec Document (納入仕様書)
        const tdSpec = document.createElement('td');
        tdSpec.className = 'process-cell';
        tdSpec.style.cursor = 'pointer';
        tdSpec.style.textAlign = 'center';

        // Provide backward compatibility
        if (!project.processes) project.processes = {};
        if (!project.processes.specDoc) project.processes.specDoc = { issueDate: '', dueDate: '', returnDate: '', needsFix: '', approvalDate: '', memo: '' };
        if (!project.processes.sheetMetal) project.processes.sheetMetal = { quoteDate: '', vendor: '', poSentDate: '', poDueDate: '', drawingDueDate: '', poRecvDate: '', drawingSentDate: '', drawingLimitDate: '', confirmedDate: '', memo: '' };
        if (!project.processes.partsProcurement) project.processes.partsProcurement = { main: { requestDate: '', dueDate: '' }, spare: { requestDate: '', copyDate: '', dueDate: '' }, provided: { requestDate: '', dueDate: '' }, memo: '' };
        if (!project.processes.nameplateProcurement) project.processes.nameplateProcurement = { poSentDate: '', dueDate: '', memo: '' };
        if (!project.processes.internalDrawings) project.processes.internalDrawings = { issueDate: '', memo: '' };
        if (!project.processes.software) project.processes.software = { creationDate: '', debuggingDate: '', memo: '' };

        if (!project.necessity) {
            project.necessity = {
                specDoc: true,
                sheetMetal: true,
                partsProcurement: { main: true, spare: true, provided: true },
                nameplateProcurement: true,
                internalDrawings: true,
                software: true
            };
        }

        const nec = project.necessity;
        const spec = project.processes.specDoc;
        let summaryHTML = '-';

        if (!nec.specDoc) {
            summaryHTML = '<span style="color:var(--text-muted);">不要</span>';
            tdSpec.onclick = null;
        } else {
            if (spec.approvalDate) {
                const fixStr = spec.needsFix === '要' ? '<br><span style="color:var(--danger-color);font-weight:bold;">修正要</span>' : '';
                summaryHTML = `<span style="color:#4ade80;font-weight:bold;">承認済<br><small>${formatShortDate(spec.approvalDate)}</small></span>${fixStr}`;
                tdSpec.style.backgroundColor = 'var(--process-done-bg)';
            } else if (spec.returnDate) {
                const fixStr = spec.needsFix === '要' ? '<br><span style="color:var(--danger-color);font-weight:bold;">修正要</span>' : '';
                summaryHTML = `<span>返却済<br><small>${formatShortDate(spec.returnDate)}</small>${fixStr}</span>`;
            } else if (spec.issueDate) {
                const dueStr = spec.dueDate ? `<br><small>返却期日:${formatShortDate(spec.dueDate)}</small>` : '';
                summaryHTML = `<span>出図済${dueStr}</span>`;
            }
            tdSpec.onclick = async () => {
                await refreshIfRemoteUpdated();
                const latestProject = state.projects.find(p => p.id === project.id);
                if (!latestProject) {
                    alert('対象のデータが見つかりません。他のユーザーによって製番が変更または削除された可能性があります。');
                    renderTable();
                    return;
                }
                openSpecDocModal(latestProject);
            };
        }

        tdSpec.innerHTML = summaryHTML;
        tdSpec.addEventListener('mouseenter', () => {
            tooltipEl.innerHTML = `<strong>納入仕様書</strong> (${nec.specDoc ? '要' : '不要'})<br>` +
                `出図: ${spec.issueDate || '-'}<br>` +
                `返却期日: ${spec.dueDate || '-'}<br>` +
                `返却: ${spec.returnDate || '-'}<br>` +
                `修正要否: ${spec.needsFix || '-'}<br>` +
                `承認: ${spec.approvalDate || '-'}<br>` +
                `メモ: ${spec.memo || '-'}`;
        });
        tdSpec.addEventListener('mouseleave', resetTooltip);
        tr.appendChild(tdSpec);

        // Process: Sheet Metal (板金手配)
        const tdSheetMetal = document.createElement('td');
        tdSheetMetal.className = 'process-cell';
        tdSheetMetal.style.cursor = 'pointer';
        tdSheetMetal.style.textAlign = 'center';

        const sm = project.processes.sheetMetal;
        let smSummaryHTML = '-';

        if (!nec.sheetMetal) {
            smSummaryHTML = '<span style="color:var(--text-muted);">不要</span>';
            tdSheetMetal.onclick = null;
        } else {
            if (sm.drawingSentDate && sm.drawingLimitDate) {
                const confirmedStr = sm.confirmedDate ? `<br><small style="color:var(--primary-color);">納期確定:${formatShortDate(sm.confirmedDate)}</small>` : '';
                smSummaryHTML = `<span style="color:#4ade80;font-weight:bold;">完了 (詳細図送付)<br><small>納期:${formatShortDate(sm.drawingLimitDate)}</small></span>${confirmedStr}`;
                tdSheetMetal.style.backgroundColor = 'var(--process-done-bg)';
            } else if (sm.drawingSentDate) {
                smSummaryHTML = `<span>詳細図送付済<br><small>納期(詳細図):-</small></span>`;
            } else if (sm.poSentDate) {
                const poDueStr = sm.poDueDate ? `納期(注文書):${formatShortDate(sm.poDueDate)}` : '';
                const dwgDueStr = sm.drawingDueDate ? `詳細図送付期日:${formatShortDate(sm.drawingDueDate)}` : '';
                const dueStr = [poDueStr, dwgDueStr].filter(Boolean).join('<br>');
                smSummaryHTML = `<span>注文書送付済<br><small>${dueStr || '-'}</small></span>`;
            } else if (sm.quoteDate) {
                smSummaryHTML = `<span>見積依頼送付済<br><small>${formatShortDate(sm.quoteDate)}</small></span>`;
            }
            tdSheetMetal.onclick = async () => {
                await refreshIfRemoteUpdated();
                const latestProject = state.projects.find(p => p.id === project.id);
                if (!latestProject) {
                    alert('対象のデータが見つかりません。他のユーザーによって製番が変更または削除された可能性があります。');
                    renderTable();
                    return;
                }
                openSheetMetalModal(latestProject);
            };
        }

        tdSheetMetal.innerHTML = smSummaryHTML;
        tdSheetMetal.addEventListener('mouseenter', () => {
            tooltipEl.innerHTML = `<strong>板金手配</strong> (${nec.sheetMetal ? '要' : '不要'})<br>` +
                `見積依頼送付: ${sm.quoteDate || '-'}<br>` +
                `手配先: ${sm.vendor || '-'}<br>` +
                `注文書送付: ${sm.poSentDate || '-'}<br>` +
                `納期(注文書): ${sm.poDueDate || '-'}<br>` +
                `詳細図期日: ${sm.drawingDueDate || '-'}<br>` +
                `注文書受領: ${sm.poRecvDate || '-'}<br>` +
                `詳細図送付: ${sm.drawingSentDate || '-'}<br>` +
                `納期(詳細図): ${sm.drawingLimitDate || '-'}<br>` +
                `納期確定: ${sm.confirmedDate || '-'}<br>` +
                `メモ: ${sm.memo || '-'}`;
        });
        tdSheetMetal.addEventListener('mouseleave', resetTooltip);
        tr.appendChild(tdSheetMetal);

        // Process: Parts Procurement (部品手配)
        const tdParts = document.createElement('td');
        tdParts.className = 'process-cell';
        tdParts.style.cursor = 'pointer';
        tdParts.style.textAlign = 'center';

        const pp = project.processes.partsProcurement;
        const ppNec = nec.partsProcurement || { main: true, spare: true, provided: true };
        const partsSummary = [];

        // 全て不要の場合
        if (!ppNec.main && !ppNec.spare && !ppNec.provided) {
            tdParts.innerHTML = '<span style="color:var(--text-muted);">不要</span>';
            tdParts.onclick = null;
        } else {
            if (ppNec.main) {
                if (pp.main.requestDate) {
                    const mainDueStr = pp.main.dueDate ? formatShortDate(pp.main.dueDate) : '-';
                    partsSummary.push(`<span style="color:#4ade80;">納期(主): ${mainDueStr}</span>`);
                }
            } else {
                partsSummary.push(`<span style="color:var(--text-muted);">不要(主)</span>`);
            }

            if (ppNec.spare) {
                if (pp.spare.requestDate) {
                    const spareDueStr = pp.spare.dueDate ? formatShortDate(pp.spare.dueDate) : '-';
                    const spareCopyStr = pp.spare.copyDate ? '<span style="color:#4ade80; font-size:0.85em; margin-left:4px;">[コピー済]</span>' : '';
                    partsSummary.push(`<span style="color:#4ade80;">納期(予): ${spareDueStr}${spareCopyStr}</span>`);
                }
            } else {
                partsSummary.push(`<span style="color:var(--text-muted);">不要(予)</span>`);
            }

            if (ppNec.provided) {
                if (pp.provided.requestDate) {
                    const provDueStr = pp.provided.dueDate ? formatShortDate(pp.provided.dueDate) : '-';
                    partsSummary.push(`<span style="color:#4ade80;">納期(支): ${provDueStr}</span>`);
                }
            } else {
                partsSummary.push(`<span style="color:var(--text-muted);">不要(支)</span>`);
            }

            tdParts.innerHTML = partsSummary.length > 0 ? `<small>${partsSummary.join('<br>')}</small>` : '-';
            
            // 全て完了(または不要)のチェック
            const mainDone = !ppNec.main || pp.main.requestDate;
            const spareDone = !ppNec.spare || pp.spare.requestDate;
            const providedDone = !ppNec.provided || pp.provided.requestDate;
            
            if (mainDone && spareDone && providedDone && (ppNec.main || ppNec.spare || ppNec.provided)) {
                tdParts.style.backgroundColor = 'var(--process-done-bg)';
            }
            tdParts.onclick = async () => {
                await refreshIfRemoteUpdated();
                const latestProject = state.projects.find(p => p.id === project.id);
                if (!latestProject) {
                    alert('対象のデータが見つかりません。他のユーザーによって製番が変更または削除された可能性があります。');
                    renderTable();
                    return;
                }
                openPartsModal(latestProject);
            };
        }

        tdParts.addEventListener('mouseenter', () => {
            tooltipEl.innerHTML = `<strong>部品手配</strong><br>` +
                `【主部品手配】(${ppNec.main ? '要' : '不要'})<br>` +
                `手配依頼: ${pp.main.requestDate || '-'}<br>` +
                `納期: ${pp.main.dueDate || '-'}<br>` +
                `【予備品手配】(${ppNec.spare ? '要' : '不要'})<br>` +
                `手配依頼: ${pp.spare.requestDate || '-'}<br>` +
                `納期: ${pp.spare.dueDate || '-'}<br>` +
                `コピー: ${pp.spare.copyDate || '-'}<br>` +
                `【支給品手配】(${ppNec.provided ? '要' : '不要'})<br>` +
                `手配依頼: ${pp.provided.requestDate || '-'}<br>` +
                `納期: ${pp.provided.dueDate || '-'}<br>` +
                `メモ: ${pp.memo || '-'}`;
        });
        tdParts.addEventListener('mouseleave', resetTooltip);
        tr.appendChild(tdParts);

        // Process: Nameplate Procurement (銘板手配)
        const tdNameplate = document.createElement('td');
        tdNameplate.className = 'process-cell';
        tdNameplate.style.cursor = 'pointer';
        tdNameplate.style.textAlign = 'center';

        const np = project.processes.nameplateProcurement;
        let npSummaryHTML = '-';

        if (!nec.nameplateProcurement) {
            npSummaryHTML = '<span style="color:var(--text-muted);">不要</span>';
            tdNameplate.onclick = null;
        } else {
            if (np.poSentDate) {
                npSummaryHTML = `<span style="color:#4ade80;font-weight:bold;">注文書送付済<br><small>納期:${np.dueDate ? formatShortDate(np.dueDate) : '-'}</small></span>`;
                tdNameplate.style.backgroundColor = 'var(--process-done-bg)';
            }
            tdNameplate.onclick = async () => {
                await refreshIfRemoteUpdated();
                const latestProject = state.projects.find(p => p.id === project.id);
                if (!latestProject) {
                    alert('対象のデータが見つかりません。他のユーザーによって製番が変更または削除された可能性があります。');
                    renderTable();
                    return;
                }
                openNameplateModal(latestProject);
            };
        }

        tdNameplate.innerHTML = npSummaryHTML;
        tdNameplate.addEventListener('mouseenter', () => {
            tooltipEl.innerHTML = `<strong>銘板手配</strong> (${nec.nameplateProcurement ? '要' : '不要'})<br>` +
                `注文書送付: ${np.poSentDate || '-'}<br>` +
                `納期: ${np.dueDate || '-'}<br>` +
                `メモ: ${np.memo || '-'}`;
        });
        tdNameplate.addEventListener('mouseleave', resetTooltip);
        tr.appendChild(tdNameplate);

        // Process: Internal Drawings (社内工事図)
        const tdInternalDrawings = document.createElement('td');
        tdInternalDrawings.className = 'process-cell';
        tdInternalDrawings.style.cursor = 'pointer';
        tdInternalDrawings.style.textAlign = 'center';

        const idProc = project.processes.internalDrawings;
        let idSummaryHTML = '-';

        if (!nec.internalDrawings) {
            idSummaryHTML = '<span style="color:var(--text-muted);">不要</span>';
            tdInternalDrawings.onclick = null;
        } else {
            if (idProc.issueDate) {
                idSummaryHTML = `<span style="color:#4ade80;font-weight:bold;">出図済<br><small>${formatShortDate(idProc.issueDate)}</small></span>`;
                tdInternalDrawings.style.backgroundColor = 'var(--process-done-bg)';
            }
            tdInternalDrawings.onclick = async () => {
                await refreshIfRemoteUpdated();
                const latestProject = state.projects.find(p => p.id === project.id);
                if (!latestProject) {
                    alert('対象のデータが見つかりません。他のユーザーによって製番が変更または削除された可能性があります。');
                    renderTable();
                    return;
                }
                openInternalDrawingsModal(latestProject);
            };
        }

        tdInternalDrawings.innerHTML = idSummaryHTML;
        tdInternalDrawings.addEventListener('mouseenter', () => {
            tooltipEl.innerHTML = `<strong>社内工事図</strong> (${nec.internalDrawings ? '要' : '不要'})<br>` +
                `出図: ${idProc.issueDate || '-'}<br>` +
                `メモ: ${idProc.memo || '-'}`;
        });
        tdInternalDrawings.addEventListener('mouseleave', resetTooltip);
        tr.appendChild(tdInternalDrawings);

        // Process: Software (ソフト)
        const tdSoftware = document.createElement('td');
        tdSoftware.className = 'process-cell';
        tdSoftware.style.cursor = 'pointer';
        tdSoftware.style.textAlign = 'center';

        const swProc = project.processes.software;
        let swSummaryHTML = '-';

        if (!nec.software) {
            swSummaryHTML = '<span style="color:var(--text-muted);">不要</span>';
            tdSoftware.onclick = null;
        } else {
            if (swProc.debuggingDate) {
                swSummaryHTML = `<span style="color:#4ade80;font-weight:bold;">デバッグ済<br><small>${formatShortDate(swProc.debuggingDate)}</small></span>`;
                tdSoftware.style.backgroundColor = 'var(--process-done-bg)';
            } else if (swProc.creationDate) {
                swSummaryHTML = `作成済<br><small>${formatShortDate(swProc.creationDate)}</small>`;
            }
            tdSoftware.onclick = async () => {
                await refreshIfRemoteUpdated();
                const latestProject = state.projects.find(p => p.id === project.id);
                if (!latestProject) {
                    alert('対象のデータが見つかりません。他のユーザーによって製番が変更または削除された可能性があります。');
                    renderTable();
                    return;
                }
                openSoftwareModal(latestProject);
            };
        }

        tdSoftware.innerHTML = swSummaryHTML;
        tdSoftware.addEventListener('mouseenter', () => {
            tooltipEl.innerHTML = `<strong>ソフト</strong> (${nec.software ? '要' : '不要'})<br>` +
                `作成: ${swProc.creationDate || '-'}<br>` +
                `デバッグ: ${swProc.debuggingDate || '-'}<br>` +
                `メモ: ${swProc.memo || '-'}`;
        });
        tdSoftware.addEventListener('mouseleave', resetTooltip);
        tr.appendChild(tdSoftware);

        // Process: Completed (完了)
        const tdCompleted = document.createElement('td');
        tdCompleted.style.textAlign = 'center';
        tdCompleted.style.verticalAlign = 'middle';
        
        const completedBtn = document.createElement('button');
        completedBtn.className = project.isCompleted ? 'btn btn-primary' : 'btn';
        completedBtn.textContent = project.isCompleted ? '完了済' : '完了';
        completedBtn.style.padding = '0.25rem 0.5rem';
        completedBtn.style.fontSize = '0.8rem';
        
        completedBtn.onclick = async (e) => {
            e.stopPropagation();
            await refreshIfRemoteUpdated();
            const latestProject = state.projects.find(p => p.id === project.id);
            if (!latestProject) {
                alert('対象のデータが見つかりません。他のユーザーによって製番が変更または削除された可能性があります。');
                renderTable();
                return;
            }
            latestProject.isCompleted = !latestProject.isCompleted;
            renderTable();
            // 自動保存を実行
            await saveWithSync(true);
        };

        tdCompleted.appendChild(completedBtn);
        tr.appendChild(tdCompleted);

        // Apply completed style to row
        if (project.isCompleted) {
            tr.style.opacity = '0.5';
            tr.style.backgroundColor = 'rgba(0, 0, 0, 0.2)';
        }

        progressBody.appendChild(tr);
    });

    lucide.createIcons();
}

// Logic: Open Process Modal
function openSpecDocModal(project) {
    editingProcessProjectId = project.id;

    // Provide backward compatibility
    if (!project.processes.specDoc) {
        project.processes.specDoc = { issueDate: '', dueDate: '', returnDate: '', needsFix: '', approvalDate: '', memo: '' };
    }

    // Copy data to temporary state
    currentSpecData = { ...project.processes.specDoc };
    specDueInput.value = currentSpecData.dueDate || '';
    specMemoInput.value = currentSpecData.memo || '';

    renderSpecDocModal();

    processSpecModal.classList.add('active');
}

function renderSpecDocModal() {
    // Helper to set button active state and input value
    const setBtnState = (btn, inputEl, dateVal) => {
        if (dateVal) {
            btn.classList.add('btn-primary');
            inputEl.value = dateVal;
        } else {
            btn.classList.remove('btn-primary');
            inputEl.value = '';
        }
    };

    setBtnState(specIssueBtn, specIssueDateInput, currentSpecData.issueDate);
    setBtnState(specReturnBtn, specReturnDateInput, currentSpecData.returnDate);
    setBtnState(specApprovalBtn, specApprovalDateInput, currentSpecData.approvalDate);

    // Needs Fix State
    specFixYesBtn.classList.remove('btn-primary');
    specFixNoBtn.classList.remove('btn-primary');
    if (currentSpecData.needsFix === '要') {
        specFixYesBtn.classList.add('btn-primary');
    } else if (currentSpecData.needsFix === '否') {
        specFixNoBtn.classList.add('btn-primary');
    }

    specMemoInput.value = currentSpecData.memo || '';
}

// Logic: Open Sheet Metal Modal
function openSheetMetalModal(project) {
    editingProcessProjectId = project.id;

    if (!project.processes.sheetMetal) {
        project.processes.sheetMetal = {
            quoteDate: '', vendor: '', poSentDate: '', poDueDate: '',
            drawingDueDate: '', poRecvDate: '', drawingSentDate: '',
            drawingLimitDate: '', confirmedDate: '', memo: ''
        };
    }

    currentSheetMetalData = { ...project.processes.sheetMetal };
    smVendorSelect.value = currentSheetMetalData.vendor || '';
    smPoDueDate.value = currentSheetMetalData.poDueDate || '';
    smDrawingDueDate.value = currentSheetMetalData.drawingDueDate || '';
    smDrawingLimitDate.value = currentSheetMetalData.drawingLimitDate || '';
    smMemoInput.value = currentSheetMetalData.memo || '';

    renderSheetMetalModal();
    processSheetMetalModal.classList.add('active');
}

function renderSheetMetalModal() {
    const setBtnState = (btn, inputEl, dateVal) => {
        if (dateVal) {
            btn.classList.add('btn-primary');
            inputEl.value = dateVal;
        } else {
            btn.classList.remove('btn-primary');
            inputEl.value = '';
        }
    };

    setBtnState(smQuoteBtn, smQuoteDate, currentSheetMetalData.quoteDate);
    setBtnState(smPoSentBtn, smPoSentDate, currentSheetMetalData.poSentDate);
    setBtnState(smPoRecvBtn, smPoRecvDate, currentSheetMetalData.poRecvDate);
    setBtnState(smDrawingSentBtn, smDrawingSentDate, currentSheetMetalData.drawingSentDate);
    setBtnState(smConfirmedBtn, smConfirmedDate, currentSheetMetalData.confirmedDate);
    smMemoInput.value = currentSheetMetalData.memo || '';
}

// Logic: Open Parts Procurement Modal
function openPartsModal(project) {
    editingProcessProjectId = project.id;

    if (!project.processes.partsProcurement) {
        project.processes.partsProcurement = {
            main: { requestDate: '', dueDate: '' },
            spare: { requestDate: '', copyDate: '', dueDate: '' },
            provided: { requestDate: '', dueDate: '' },
            memo: ''
        };
    }

    currentPartsData = JSON.parse(JSON.stringify(project.processes.partsProcurement));

    // Necessity based visibility
    const nec = project.necessity || { partsProcurement: { main: true, spare: true, provided: true } };
    const ppNec = nec.partsProcurement || { main: true, spare: true, provided: true };
    
    if (ppMainSection) ppMainSection.style.display = ppNec.main ? 'block' : 'none';
    if (ppSpareSection) ppSpareSection.style.display = ppNec.spare ? 'block' : 'none';
    if (ppProvSection) ppProvSection.style.display = ppNec.provided ? 'block' : 'none';

    ppMainDueDate.value = currentPartsData.main.dueDate || '';
    ppSpareDueDate.value = currentPartsData.spare.dueDate || '';
    ppProvDueDate.value = currentPartsData.provided.dueDate || '';
    ppMemoInput.value = currentPartsData.memo || '';

    renderPartsModal();
    processPartsModal.classList.add('active');
}

function renderPartsModal() {
    const setBtnState = (btn, inputEl, dateVal) => {
        if (dateVal) {
            btn.classList.add('btn-primary');
            inputEl.value = dateVal;
        } else {
            btn.classList.remove('btn-primary');
            inputEl.value = '';
        }
    };

    setBtnState(ppMainReqBtn, ppMainReqDate, currentPartsData.main.requestDate);
    setBtnState(ppSpareReqBtn, ppSpareReqDate, currentPartsData.spare.requestDate);
    setBtnState(ppSpareCopyBtn, ppSpareCopyDate, currentPartsData.spare.copyDate);
    setBtnState(ppProvReqBtn, ppProvReqDate, currentPartsData.provided.requestDate);
    ppMemoInput.value = currentPartsData.memo || '';
}

// Logic: Open Nameplate Procurement Modal
function openNameplateModal(project) {
    editingProcessProjectId = project.id;

    if (!project.processes.nameplateProcurement) {
        project.processes.nameplateProcurement = { poSentDate: '', dueDate: '', memo: '' };
    }

    currentNameplateData = { ...project.processes.nameplateProcurement };
    npDueDate.value = currentNameplateData.dueDate || '';
    npMemoInput.value = currentNameplateData.memo || '';

    renderNameplateModal();
    processNameplateModal.classList.add('active');
}

function renderNameplateModal() {
    const setBtnState = (btn, inputEl, dateVal) => {
        if (dateVal) {
            btn.classList.add('btn-primary');
            inputEl.value = dateVal;
        } else {
            btn.classList.remove('btn-primary');
            inputEl.value = '';
        }
    };

    setBtnState(npPoSentBtn, npPoSentDate, currentNameplateData.poSentDate);
    npMemoInput.value = currentNameplateData.memo || '';
}

// Logic: Open Internal Drawings Modal
function openInternalDrawingsModal(project) {
    editingProcessProjectId = project.id;

    if (!project.processes.internalDrawings) {
        project.processes.internalDrawings = { issueDate: '', memo: '' };
    }

    currentInternalDrawingsData = { ...project.processes.internalDrawings };
    idMemoInput.value = currentInternalDrawingsData.memo || '';

    renderInternalDrawingsModal();
    processInternalDrawingsModal.classList.add('active');
}

function renderInternalDrawingsModal() {
    const setBtnState = (btn, inputEl, dateVal) => {
        if (dateVal) {
            btn.classList.add('btn-primary');
            inputEl.value = dateVal;
        } else {
            btn.classList.remove('btn-primary');
            inputEl.value = '';
        }
    };

    setBtnState(idIssueBtn, idIssueDate, currentInternalDrawingsData.issueDate);
    idMemoInput.value = currentInternalDrawingsData.memo || '';
}

// Logic: Open Software Modal
function openSoftwareModal(project) {
    editingProcessProjectId = project.id;

    if (!project.processes.software) {
        project.processes.software = { creationDate: '', debuggingDate: '', memo: '' };
    }

    currentSoftwareData = { ...project.processes.software };
    swMemoInput.value = currentSoftwareData.memo || '';

    renderSoftwareModal();
    processSoftwareModal.classList.add('active');
}

function renderSoftwareModal() {
    const setBtnState = (btn, inputEl, dateVal) => {
        if (dateVal) {
            btn.classList.add('btn-primary');
            inputEl.value = dateVal;
        } else {
            btn.classList.remove('btn-primary');
            inputEl.value = '';
        }
    };

    setBtnState(swCreationBtn, swCreationDate, currentSoftwareData.creationDate);
    setBtnState(swDebuggingBtn, swDebuggingDate, currentSoftwareData.debuggingDate);
    swMemoInput.value = currentSoftwareData.memo || '';
}

// Logic: Open Edit Modal
function openEditModal(project) {
    editingProjectId = project.id;
    document.getElementById('modal-title').textContent = '製番情報の編集';
    deleteProjectBtn.style.display = 'block';
    copyFromSection.style.display = 'none'; // コピー機能を非表示

    document.getElementById('project-id').value = project.id;
    document.getElementById('project-deadline').value = project.deadline;
    document.getElementById('project-customer').value = project.customer || '';
    document.getElementById('project-subject').value = project.subject || '';
    document.getElementById('project-destination').value = project.destination || '';
    document.getElementById('project-name').value = project.name || '';
    document.getElementById('project-quantity').value = project.quantity || 1;
    document.getElementById('project-spec').value = project.spec || '';
    document.getElementById('project-staff').value = project.staff || '';
    document.getElementById('project-inspection').value = project.inspection || '';
    document.getElementById('project-budget').value = project.budget || '';
    document.getElementById('project-link').value = project.link || '';
    document.getElementById('project-remarks').value = project.remarks || '';
    
    // Load necessity data (with fallback for old data)
    currentNecessityData = project.necessity ? JSON.parse(JSON.stringify(project.necessity)) : {
        specDoc: true,
        sheetMetal: true,
        partsProcurement: { main: true, spare: true, provided: true },
        nameplateProcurement: true,
        internalDrawings: true,
        software: true
    };
    renderNecessityButtons();

    modalOverlay.classList.add('active');
}

function applyCopyFrom(project) {
    // 基本情報をセット (製番以外)
    document.getElementById('project-deadline').value = project.deadline || '';
    document.getElementById('project-customer').value = project.customer || '';
    document.getElementById('project-subject').value = project.subject || '';
    document.getElementById('project-destination').value = project.destination || '';
    document.getElementById('project-name').value = project.name || '';
    document.getElementById('project-quantity').value = project.quantity || 1;
    document.getElementById('project-spec').value = project.spec || '';
    document.getElementById('project-staff').value = project.staff || '';
    document.getElementById('project-inspection').value = project.inspection || '';
    document.getElementById('project-budget').value = project.budget || '';
    document.getElementById('project-link').value = project.link || '';
    document.getElementById('project-remarks').value = project.remarks || '';

    // 要否設定をコピー
    currentNecessityData = JSON.parse(JSON.stringify(project.necessity || {
        specDoc: true,
        sheetMetal: true,
        partsProcurement: { main: true, spare: true, provided: true },
        nameplateProcurement: true,
        internalDrawings: true,
        software: true
    }));
    renderNecessityButtons();
    showToast(`${project.id} の情報をコピーしました`);
}



// Helpers
function isThisWeek(dateStr) {
    if (!dateStr) return false;
    const target = new Date(dateStr);
    const now = new Date();
    const startOfWeek = new Date(now.setDate(now.getDate() - now.getDay()));
    const endOfWeek = new Date(now.setDate(now.getDate() - now.getDay() + 6));
    return target >= startOfWeek && target <= endOfWeek;
}

function formatShortDate(dateStr) {
    const d = new Date(dateStr);
    return `${d.getFullYear()}/${d.getMonth() + 1}/${d.getDate()}`;
}

function renderNecessityButtons() {
    const updateButtons = (yesBtn, noBtn, isRequired) => {
        if (!yesBtn || !noBtn) return;
        if (isRequired) {
            yesBtn.classList.add('btn-primary');
            yesBtn.classList.remove('btn-outline');
            noBtn.classList.remove('btn-primary');
            noBtn.classList.add('btn-outline');
        } else {
            yesBtn.classList.remove('btn-primary');
            yesBtn.classList.add('btn-outline');
            noBtn.classList.add('btn-primary');
            noBtn.classList.remove('btn-outline');
        }
    };

    updateButtons(necSpecYes, necSpecNo, currentNecessityData.specDoc);
    updateButtons(necSmYes, necSmNo, currentNecessityData.sheetMetal);
    updateButtons(necPpMainYes, necPpMainNo, currentNecessityData.partsProcurement.main);
    updateButtons(necPpSpareYes, necPpSpareNo, currentNecessityData.partsProcurement.spare);
    updateButtons(necPpProvYes, necPpProvNo, currentNecessityData.partsProcurement.provided);
    updateButtons(necNpYes, necNpNo, currentNecessityData.nameplateProcurement);
    updateButtons(necIdYes, necIdNo, currentNecessityData.internalDrawings);
    updateButtons(necSwYes, necSwNo, currentNecessityData.software);
}

// Global Tooltip element
const tooltipEl = document.createElement('div');
tooltipEl.className = 'custom-tooltip';
document.body.appendChild(tooltipEl);

init();
