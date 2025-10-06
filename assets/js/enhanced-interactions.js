// 增强的交互功能
document.addEventListener('DOMContentLoaded', () => {
    
    // 1. 添加页面加载动画
    addPageLoadAnimation();
    
    // 2. 增强表单交互
    enhanceFormInteractions();
    
    // 3. 添加按钮点击反馈
    addButtonFeedback();
    
    // 4. 增强卡片悬停效果
    enhanceCardHover();
    
    // 5. 添加滚动进度指示器
    addScrollProgress();
    
    // 6. 增强模态框交互
    enhanceModalInteractions();
    
    // 7. 添加键盘导航支持
    addKeyboardNavigation();
});

// 页面加载动画
function addPageLoadAnimation() {
    const cards = document.querySelectorAll('.card');
    cards.forEach((card, index) => {
        card.style.opacity = '0';
        card.style.transform = 'translateY(30px)';
        
        setTimeout(() => {
            card.style.transition = 'opacity 0.6s ease-out, transform 0.6s ease-out';
            card.style.opacity = '1';
            card.style.transform = 'translateY(0)';
        }, index * 100);
    });
}

// 增强表单交互
function enhanceFormInteractions() {
    const inputs = document.querySelectorAll('.input, .textarea');
    
    inputs.forEach(input => {
        // 添加焦点动画
        input.addEventListener('focus', function() {
            this.parentElement.classList.add('focused');
        });
        
        input.addEventListener('blur', function() {
            this.parentElement.classList.remove('focused');
        });
        
        // 添加输入验证反馈
        input.addEventListener('input', function() {
            if (this.checkValidity()) {
                this.classList.add('valid');
                this.classList.remove('invalid');
            } else {
                this.classList.add('invalid');
                this.classList.remove('valid');
            }
        });
    });
}

// 按钮点击反馈
function addButtonFeedback() {
    const buttons = document.querySelectorAll('.button-primary');
    
    buttons.forEach(button => {
        button.addEventListener('click', function(e) {
            // 创建涟漪效果
            const ripple = document.createElement('span');
            const rect = this.getBoundingClientRect();
            const size = Math.max(rect.width, rect.height);
            const x = e.clientX - rect.left - size / 2;
            const y = e.clientY - rect.top - size / 2;
            
            ripple.style.width = ripple.style.height = size + 'px';
            ripple.style.left = x + 'px';
            ripple.style.top = y + 'px';
            ripple.classList.add('ripple');
            
            this.appendChild(ripple);
            
            setTimeout(() => {
                ripple.remove();
            }, 600);
        });
    });
}

// 增强卡片悬停效果
function enhanceCardHover() {
    const cards = document.querySelectorAll('.card');
    
    cards.forEach(card => {
        card.addEventListener('mouseenter', function() {
            this.style.transform = 'translateY(-8px) scale(1.02)';
        });
        
        card.addEventListener('mouseleave', function() {
            this.style.transform = 'translateY(0) scale(1)';
        });
    });
}

// 滚动进度指示器
function addScrollProgress() {
    const progressBar = document.createElement('div');
    progressBar.id = 'scroll-progress';
    progressBar.style.cssText = `
        position: fixed;
        top: 0;
        left: 0;
        width: 0%;
        height: 3px;
        background: linear-gradient(90deg, var(--primary-color), var(--info-color));
        z-index: 9999;
        transition: width 0.1s ease-out;
    `;
    document.body.appendChild(progressBar);
    
    window.addEventListener('scroll', () => {
        const scrollTop = window.pageYOffset;
        const docHeight = document.body.scrollHeight - window.innerHeight;
        const scrollPercent = (scrollTop / docHeight) * 100;
        progressBar.style.width = scrollPercent + '%';
    });
}

// 增强模态框交互
function enhanceModalInteractions() {
    const modals = document.querySelectorAll('.modal-overlay');
    
    modals.forEach(modal => {
        // 添加ESC键关闭
        document.addEventListener('keydown', function(e) {
            if (e.key === 'Escape' && modal.style.display === 'flex') {
                modal.style.display = 'none';
            }
        });
        
        // 添加点击外部关闭
        modal.addEventListener('click', function(e) {
            if (e.target === modal) {
                modal.style.display = 'none';
            }
        });
    });
}

// 键盘导航支持
function addKeyboardNavigation() {
    // 为可点击元素添加键盘支持
    const clickableElements = document.querySelectorAll('a, button, .patient-list-item');
    
    clickableElements.forEach(element => {
        element.setAttribute('tabindex', '0');
        
        element.addEventListener('keydown', function(e) {
            if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                this.click();
            }
        });
    });
}

// 添加涟漪效果样式
const rippleStyle = document.createElement('style');
rippleStyle.textContent = `
    .button-primary {
        position: relative;
        overflow: hidden;
    }
    
    .ripple {
        position: absolute;
        border-radius: 50%;
        background: rgba(255, 255, 255, 0.6);
        transform: scale(0);
        animation: ripple-animation 0.6s linear;
        pointer-events: none;
    }
    
    @keyframes ripple-animation {
        to {
            transform: scale(4);
            opacity: 0;
        }
    }
    
    .field.focused label {
        color: var(--primary-color);
        transform: translateY(-2px);
    }
    
    .input.valid, .textarea.valid {
        border-color: var(--success-color);
        box-shadow: 0 0 0 3px rgba(16, 185, 129, 0.1);
    }
    
    .input.invalid, .textarea.invalid {
        border-color: var(--danger-color);
        box-shadow: 0 0 0 3px rgba(239, 68, 68, 0.1);
    }
    
    .field {
        transition: var(--transition-normal);
    }
    
    .field label {
        transition: var(--transition-normal);
    }
`;
document.head.appendChild(rippleStyle);

