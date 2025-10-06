document.addEventListener('DOMContentLoaded', () => {
    const contactForm = document.getElementById('contact-form');
    if (contactForm) {
        contactForm.addEventListener('submit', function(e) {
            e.preventDefault();
            // 在实际项目中，这里会是发送数据的代码
            // 此处我们仅做前端演示
            const submitButton = this.querySelector('button[type="submit"]');
            submitButton.textContent = '正在提交...';
            submitButton.disabled = true;

            setTimeout(() => {
                // 模拟成功
                this.innerHTML = `<div class="notice info" style="text-align:center;"><strong>提交成功！</strong><p>感谢您的留言，我们会尽快与您联系。</p></div>`;
            }, 1500);
        });
    }
});