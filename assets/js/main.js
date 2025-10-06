document.addEventListener('DOMContentLoaded', () => {

    // 功能一：侧边栏链接平滑滚动
    const sidebarLinks = document.querySelectorAll('.sidebar a[href^="#"]');
    sidebarLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            const targetId = this.getAttribute('href');
            const targetElement = document.querySelector(targetId);
            if (targetElement) {
                // 计算滚动位置，-80px是为了给顶部的固定导航栏留出空间
                const offsetTop = targetElement.offsetTop - 80;
                window.scrollTo({
                    top: offsetTop,
                    behavior: 'smooth'
                });
            }
        });
    });

    // 功能二：卡片滚动进入时淡入动画
    const animatedCards = document.querySelectorAll('.animate-on-scroll');

    // 如果浏览器不支持 IntersectionObserver，则直接显示所有卡片
    if (!('IntersectionObserver' in window)) {
        animatedCards.forEach(card => card.classList.add('is-visible'));
        return;
    }
    
    const observer = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            // 当元素进入视窗时
            if (entry.isIntersecting) {
                entry.target.classList.add('is-visible');
                // 动画触发后，停止观察该元素，以提升性能
                observer.unobserve(entry.target);
            }
        });
    }, {
        threshold: 0.1 // 元素可见 10% 时触发
    });

    animatedCards.forEach(card => {
        observer.observe(card);
    });

});