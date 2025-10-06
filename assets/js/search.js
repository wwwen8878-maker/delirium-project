// 搜索功能
class SearchManager {
    constructor() {
        this.searchInput = null;
        this.searchResults = null;
        this.init();
    }
    
    init() {
        this.createSearchInterface();
        this.bindEvents();
    }
    
    createSearchInterface() {
        // 创建搜索容器
        const searchContainer = document.createElement('div');
        searchContainer.className = 'search-container';
        searchContainer.innerHTML = `
            <div class="search-box">
                <i data-feather="search"></i>
                <input type="text" id="search-input" placeholder="搜索患者姓名、病房号..." />
                <button id="search-clear" class="search-clear" style="display: none;">
                    <i data-feather="x"></i>
                </button>
            </div>
            <div id="search-results" class="search-results" style="display: none;"></div>
        `;
        
        // 添加到页面头部
        const pageHead = document.querySelector('.page-head');
        if (pageHead) {
            pageHead.appendChild(searchContainer);
        }
        
        // 重新初始化feather图标
        if (typeof feather !== 'undefined') {
            feather.replace();
        }
        
        this.searchInput = document.getElementById('search-input');
        this.searchResults = document.getElementById('search-results');
    }
    
    bindEvents() {
        if (this.searchInput) {
            this.searchInput.addEventListener('input', (e) => {
                this.handleSearch(e.target.value);
            });
            
            this.searchInput.addEventListener('focus', () => {
                this.searchResults.style.display = 'block';
            });
        }
        
        const clearButton = document.getElementById('search-clear');
        if (clearButton) {
            clearButton.addEventListener('click', () => {
                this.clearSearch();
            });
        }
        
        // 点击外部关闭搜索结果
        document.addEventListener('click', (e) => {
            if (!e.target.closest('.search-container')) {
                this.searchResults.style.display = 'none';
            }
        });
    }
    
    handleSearch(query) {
        const clearButton = document.getElementById('search-clear');
        
        if (query.trim() === '') {
            this.clearSearch();
            return;
        }
        
        clearButton.style.display = 'block';
        
        // 搜索患者数据
        const patients = this.getAllPatients();
        const results = patients.filter(patient => 
            patient.name.toLowerCase().includes(query.toLowerCase()) ||
            patient.room.toLowerCase().includes(query.toLowerCase()) ||
            (patient.surgery && patient.surgery.toLowerCase().includes(query.toLowerCase()))
        );
        
        this.displayResults(results, query);
    }
    
    getAllPatients() {
        // 从localStorage获取患者数据
        try {
            const patients = JSON.parse(localStorage.getItem('patients') || '[]');
            return patients;
        } catch (e) {
            return [];
        }
    }
    
    displayResults(results, query) {
        if (results.length === 0) {
            this.searchResults.innerHTML = `
                <div class="search-no-results">
                    <i data-feather="search"></i>
                    <p>未找到匹配的患者</p>
                </div>
            `;
        } else {
            const resultsHtml = results.map(patient => {
                let statusClass = '';
                let statusText = '待评估';
                
                if (patient.assessment) {
                    statusText = patient.assessment.riskLevel;
                    if(statusText === '高风险' || statusText === '极高风险') statusClass = 'status-high';
                    if(statusText === '中等风险') statusClass = 'status-medium';
                    if(statusText === '低风险') statusClass = 'status-low';
                }
                
                if(patient.latestStatus === 'high-risk') {
                    statusClass = 'status-high';
                    statusText = '阳性-高风险';
                } else if (patient.latestStatus === 'low-risk') {
                    statusClass = 'status-low';
                    statusText = '阴性-低风险';
                }
                
                return `
                    <div class="search-result-item" onclick="window.location.href='./patient-detail.html?id=${patient.id}'">
                        <div class="search-result-info">
                            <h4>${this.highlightText(patient.name, query)}</h4>
                            <p>年龄: ${patient.age} | 病房: ${this.highlightText(patient.room, query)}</p>
                            ${patient.surgery ? `<p>手术: ${this.highlightText(patient.surgery, query)}</p>` : ''}
                        </div>
                        <div class="search-result-status ${statusClass}">
                            <span>${statusText}</span>
                        </div>
                    </div>
                `;
            }).join('');
            
            this.searchResults.innerHTML = resultsHtml;
        }
        
        // 重新初始化feather图标
        if (typeof feather !== 'undefined') {
            feather.replace();
        }
    }
    
    highlightText(text, query) {
        if (!query) return text;
        const regex = new RegExp(`(${query})`, 'gi');
        return text.replace(regex, '<mark>$1</mark>');
    }
    
    clearSearch() {
        if (this.searchInput) {
            this.searchInput.value = '';
        }
        
        const clearButton = document.getElementById('search-clear');
        if (clearButton) {
            clearButton.style.display = 'none';
        }
        
        if (this.searchResults) {
            this.searchResults.style.display = 'none';
        }
    }
}

// 添加搜索样式
const searchStyle = document.createElement('style');
searchStyle.textContent = `
    .search-container {
        position: relative;
        max-width: 500px;
        margin: 20px auto 0;
    }
    
    .search-box {
        position: relative;
        display: flex;
        align-items: center;
        background: var(--card-bg);
        border: 2px solid var(--border-color);
        border-radius: var(--border-radius);
        padding: 12px 16px;
        box-shadow: var(--card-shadow);
        transition: var(--transition-normal);
    }
    
    .search-box:focus-within {
        border-color: var(--primary-color);
        box-shadow: 0 0 0 4px rgba(37, 99, 235, 0.1);
    }
    
    .search-box i {
        color: var(--text-muted-color);
        margin-right: 12px;
        width: 20px;
        height: 20px;
    }
    
    .search-box input {
        flex: 1;
        border: none;
        outline: none;
        background: none;
        font-size: 1em;
        color: var(--text-color);
    }
    
    .search-box input::placeholder {
        color: var(--text-muted-color);
    }
    
    .search-clear {
        background: none;
        border: none;
        color: var(--text-muted-color);
        cursor: pointer;
        padding: 4px;
        border-radius: 4px;
        transition: var(--transition-normal);
    }
    
    .search-clear:hover {
        background-color: var(--light-bg-color);
        color: var(--text-color);
    }
    
    .search-results {
        position: absolute;
        top: 100%;
        left: 0;
        right: 0;
        background: var(--card-bg);
        border: 1px solid var(--border-color);
        border-radius: var(--border-radius);
        box-shadow: var(--card-shadow-hover);
        max-height: 400px;
        overflow-y: auto;
        z-index: 1000;
        margin-top: 4px;
    }
    
    .search-result-item {
        display: flex;
        justify-content: space-between;
        align-items: center;
        padding: 16px;
        border-bottom: 1px solid var(--border-color);
        cursor: pointer;
        transition: var(--transition-normal);
    }
    
    .search-result-item:last-child {
        border-bottom: none;
    }
    
    .search-result-item:hover {
        background-color: var(--light-bg-color);
    }
    
    .search-result-info h4 {
        margin: 0 0 4px 0;
        font-size: 1.1em;
        color: var(--text-color);
    }
    
    .search-result-info p {
        margin: 0;
        font-size: 0.9em;
        color: var(--text-muted-color);
    }
    
    .search-result-status span {
        padding: 4px 12px;
        border-radius: 12px;
        font-size: 0.8em;
        font-weight: 600;
        color: white;
    }
    
    .search-no-results {
        text-align: center;
        padding: 40px 20px;
        color: var(--text-muted-color);
    }
    
    .search-no-results i {
        width: 48px;
        height: 48px;
        margin-bottom: 16px;
        opacity: 0.5;
    }
    
    mark {
        background-color: var(--warning-light);
        color: var(--warning-color);
        padding: 2px 4px;
        border-radius: 4px;
        font-weight: 600;
    }
    
    @media (max-width: 768px) {
        .search-container {
            margin: 16px 0 0;
        }
        
        .search-result-item {
            flex-direction: column;
            align-items: flex-start;
            gap: 8px;
        }
        
        .search-result-status {
            align-self: flex-end;
        }
    }
`;
document.head.appendChild(searchStyle);

// 初始化搜索功能
document.addEventListener('DOMContentLoaded', () => {
    // 只在患者仪表盘页面初始化搜索
    if (window.location.pathname.includes('index.html') || window.location.pathname === '/') {
        new SearchManager();
    }
});

