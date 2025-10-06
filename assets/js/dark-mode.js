// 深色模式功能
class DarkMode {
    constructor() {
        this.isDark = localStorage.getItem('darkMode') === 'true';
        this.init();
    }
    
    init() {
        this.createToggleButton();
        this.applyTheme();
        this.bindEvents();
    }
    
    createToggleButton() {
        const toggleButton = document.createElement('button');
        toggleButton.id = 'dark-mode-toggle';
        toggleButton.innerHTML = `
            <i data-feather="${this.isDark ? 'sun' : 'moon'}"></i>
        `;
        toggleButton.className = 'dark-mode-toggle';
        toggleButton.setAttribute('aria-label', '切换深色模式');
        
        // 添加到导航栏
        const nav = document.querySelector('.nav');
        if (nav) {
            nav.appendChild(toggleButton);
        }
        
        // 重新初始化feather图标
        if (typeof feather !== 'undefined') {
            feather.replace();
        }
    }
    
    applyTheme() {
        const root = document.documentElement;
        
        if (this.isDark) {
            root.classList.add('dark-mode');
            this.updateCSSVariables(true);
        } else {
            root.classList.remove('dark-mode');
            this.updateCSSVariables(false);
        }
    }
    
    updateCSSVariables(isDark) {
        const root = document.documentElement;
        
        if (isDark) {
            // 深色模式变量
            root.style.setProperty('--primary-color', '#3b82f6');
            root.style.setProperty('--primary-hover', '#2563eb');
            root.style.setProperty('--primary-light', '#1e3a8a');
            root.style.setProperty('--primary-dark', '#1e40af');
            
            root.style.setProperty('--secondary-color', '#94a3b8');
            root.style.setProperty('--success-color', '#10b981');
            root.style.setProperty('--success-light', '#064e3b');
            root.style.setProperty('--info-color', '#06b6d4');
            root.style.setProperty('--info-light', '#083344');
            root.style.setProperty('--warning-color', '#f59e0b');
            root.style.setProperty('--warning-light', '#451a03');
            root.style.setProperty('--danger-color', '#ef4444');
            root.style.setProperty('--danger-light', '#450a0a');
            
            root.style.setProperty('--light-bg-color', '#0f172a');
            root.style.setProperty('--card-bg', '#1e293b');
            root.style.setProperty('--card-bg-hover', '#334155');
            
            root.style.setProperty('--border-color', '#334155');
            root.style.setProperty('--border-color-light', '#475569');
            
            root.style.setProperty('--text-color', '#f1f5f9');
            root.style.setProperty('--text-muted-color', '#94a3b8');
            root.style.setProperty('--text-light-color', '#64748b');
            
            root.style.setProperty('--card-shadow', '0 4px 6px -1px rgba(0, 0, 0, 0.3), 0 2px 4px -1px rgba(0, 0, 0, 0.2)');
            root.style.setProperty('--card-shadow-hover', '0 10px 15px -3px rgba(0, 0, 0, 0.4), 0 4px 6px -2px rgba(0, 0, 0, 0.3)');
        } else {
            // 重置为浅色模式
            root.style.removeProperty('--primary-color');
            root.style.removeProperty('--primary-hover');
            root.style.removeProperty('--primary-light');
            root.style.removeProperty('--primary-dark');
            root.style.removeProperty('--secondary-color');
            root.style.removeProperty('--success-color');
            root.style.removeProperty('--success-light');
            root.style.removeProperty('--info-color');
            root.style.removeProperty('--info-light');
            root.style.removeProperty('--warning-color');
            root.style.removeProperty('--warning-light');
            root.style.removeProperty('--danger-color');
            root.style.removeProperty('--danger-light');
            root.style.removeProperty('--light-bg-color');
            root.style.removeProperty('--card-bg');
            root.style.removeProperty('--card-bg-hover');
            root.style.removeProperty('--border-color');
            root.style.removeProperty('--border-color-light');
            root.style.removeProperty('--text-color');
            root.style.removeProperty('--text-muted-color');
            root.style.removeProperty('--text-light-color');
            root.style.removeProperty('--card-shadow');
            root.style.removeProperty('--card-shadow-hover');
        }
    }
    
    bindEvents() {
        const toggleButton = document.getElementById('dark-mode-toggle');
        if (toggleButton) {
            toggleButton.addEventListener('click', () => {
                this.toggle();
            });
        }
    }
    
    toggle() {
        this.isDark = !this.isDark;
        localStorage.setItem('darkMode', this.isDark);
        this.applyTheme();
        
        // 更新按钮图标
        const toggleButton = document.getElementById('dark-mode-toggle');
        if (toggleButton) {
            const icon = toggleButton.querySelector('i');
            if (icon) {
                icon.setAttribute('data-feather', this.isDark ? 'sun' : 'moon');
                if (typeof feather !== 'undefined') {
                    feather.replace();
                }
            }
        }
        
        // 添加切换动画
        document.body.style.transition = 'background-color 0.3s ease, color 0.3s ease';
        setTimeout(() => {
            document.body.style.transition = '';
        }, 300);
    }
}

// 初始化深色模式
document.addEventListener('DOMContentLoaded', () => {
    new DarkMode();
});

// 添加深色模式切换按钮样式
const darkModeStyle = document.createElement('style');
darkModeStyle.textContent = `
    .dark-mode-toggle {
        background: none;
        border: 2px solid var(--border-color);
        border-radius: var(--border-radius-sm);
        padding: 8px 12px;
        cursor: pointer;
        transition: var(--transition-normal);
        color: var(--text-color);
        display: flex;
        align-items: center;
        justify-content: center;
    }
    
    .dark-mode-toggle:hover {
        background-color: var(--primary-light);
        border-color: var(--primary-color);
        transform: translateY(-1px);
    }
    
    .dark-mode-toggle i {
        width: 18px;
        height: 18px;
    }
    
    .dark-mode {
        color-scheme: dark;
    }
    
    .dark-mode .site-header {
        background: linear-gradient(135deg, var(--card-bg) 0%, var(--primary-light) 100%);
    }
    
    .dark-mode .page-head {
        background: linear-gradient(135deg, var(--light-bg-color) 0%, var(--primary-light) 100%);
    }
    
    .dark-mode .page-head h1 {
        background: linear-gradient(135deg, var(--primary-color), var(--info-color));
        -webkit-background-clip: text;
        -webkit-text-fill-color: transparent;
        background-clip: text;
    }
`;
document.head.appendChild(darkModeStyle);

