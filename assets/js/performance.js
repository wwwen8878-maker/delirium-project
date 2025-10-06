// 性能优化功能
class PerformanceOptimizer {
    constructor() {
        this.init();
    }
    
    init() {
        this.optimizeImages();
        this.addLazyLoading();
        this.optimizeAnimations();
        this.addServiceWorker();
    }
    
    // 图片优化
    optimizeImages() {
        const images = document.querySelectorAll('img');
        images.forEach(img => {
            // 添加loading="lazy"属性
            img.setAttribute('loading', 'lazy');
            
            // 添加错误处理
            img.addEventListener('error', function() {
                this.style.display = 'none';
            });
        });
    }
    
    // 懒加载
    addLazyLoading() {
        // 使用Intersection Observer进行懒加载
        if ('IntersectionObserver' in window) {
            const lazyElements = document.querySelectorAll('[data-lazy]');
            const lazyObserver = new IntersectionObserver((entries, observer) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        const element = entry.target;
                        element.classList.add('loaded');
                        observer.unobserve(element);
                    }
                });
            });
            
            lazyElements.forEach(element => {
                lazyObserver.observe(element);
            });
        }
    }
    
    // 动画优化
    optimizeAnimations() {
        // 减少动画在低性能设备上的复杂度
        const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
        
        if (prefersReducedMotion.matches) {
            document.documentElement.style.setProperty('--transition-fast', '0s');
            document.documentElement.style.setProperty('--transition-normal', '0s');
            document.documentElement.style.setProperty('--transition-slow', '0s');
        }
        
        // 监听用户偏好变化
        prefersReducedMotion.addEventListener('change', (e) => {
            if (e.matches) {
                document.documentElement.style.setProperty('--transition-fast', '0s');
                document.documentElement.style.setProperty('--transition-normal', '0s');
                document.documentElement.style.setProperty('--transition-slow', '0s');
            } else {
                document.documentElement.style.removeProperty('--transition-fast');
                document.documentElement.style.removeProperty('--transition-normal');
                document.documentElement.style.removeProperty('--transition-slow');
            }
        });
    }
    
    // 添加Service Worker（简化版）
    addServiceWorker() {
        if ('serviceWorker' in navigator) {
            // 这里可以添加Service Worker代码来缓存资源
            console.log('Service Worker support detected');
        }
    }
}

// 资源预加载
class ResourcePreloader {
    constructor() {
        this.preloadCriticalResources();
    }
    
    preloadCriticalResources() {
        // 预加载关键CSS
        const criticalCSS = document.createElement('link');
        criticalCSS.rel = 'preload';
        criticalCSS.href = './assets/css/styles.css';
        criticalCSS.as = 'style';
        document.head.appendChild(criticalCSS);
        
        // 预加载关键字体
        const fontPreload = document.createElement('link');
        fontPreload.rel = 'preload';
        fontPreload.href = 'https://fonts.googleapis.com/css2?family=Noto+Sans+SC:wght@400;500;700&display=swap';
        fontPreload.as = 'style';
        document.head.appendChild(fontPreload);
    }
}

// 内存管理
class MemoryManager {
    constructor() {
        this.cleanup();
    }
    
    cleanup() {
        // 清理未使用的事件监听器
        window.addEventListener('beforeunload', () => {
            // 清理定时器
            const highestTimeoutId = setTimeout(() => {}, 0);
            for (let i = 0; i < highestTimeoutId; i++) {
                clearTimeout(i);
            }
            
            // 清理间隔器
            const highestIntervalId = setInterval(() => {}, 0);
            for (let i = 0; i < highestIntervalId; i++) {
                clearInterval(i);
            }
        });
    }
}

// 初始化性能优化
document.addEventListener('DOMContentLoaded', () => {
    new PerformanceOptimizer();
    new ResourcePreloader();
    new MemoryManager();
});

// 添加性能监控
class PerformanceMonitor {
    constructor() {
        this.monitor();
    }
    
    monitor() {
        // 监控页面加载性能
        window.addEventListener('load', () => {
            if ('performance' in window) {
                const perfData = performance.getEntriesByType('navigation')[0];
                console.log('页面加载时间:', perfData.loadEventEnd - perfData.loadEventStart, 'ms');
            }
        });
        
        // 监控长任务
        if ('PerformanceObserver' in window) {
            const observer = new PerformanceObserver((list) => {
                for (const entry of list.getEntries()) {
                    if (entry.duration > 50) {
                        console.warn('检测到长任务:', entry.duration, 'ms');
                    }
                }
            });
            observer.observe({ entryTypes: ['longtask'] });
        }
    }
}

// 初始化性能监控
new PerformanceMonitor();

