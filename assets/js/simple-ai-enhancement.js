// 简单AI增强模块 - 集成开源模型提升智能程度
class SimpleAIEnhancement {
    constructor() {
        this.modelEndpoint = 'https://api-inference.huggingface.co/models/microsoft/DialoGPT-small';
        this.apiKey = null;
        this.isEnabled = false;
        this.init();
    }

    init() {
        this.loadConfig();
        this.createSimpleConfigUI();
    }

    // 加载配置
    loadConfig() {
        const savedConfig = localStorage.getItem('simple_ai_config');
        if (savedConfig) {
            const config = JSON.parse(savedConfig);
            this.apiKey = config.apiKey;
            this.isEnabled = config.enabled;
        }
    }

    // 保存配置
    saveConfig() {
        const config = {
            apiKey: this.apiKey,
            enabled: this.isEnabled
        };
        localStorage.setItem('simple_ai_config', JSON.stringify(config));
    }

    // 创建简单的配置界面
    createSimpleConfigUI() {
        // 检查是否已存在配置按钮
        if (document.getElementById('simple-ai-toggle')) return;

        const toggleButton = document.createElement('button');
        toggleButton.id = 'simple-ai-toggle';
        toggleButton.className = 'simple-ai-toggle';
        toggleButton.innerHTML = `<i data-feather="${this.isEnabled ? 'brain' : 'cpu'}"></i>`;
        toggleButton.title = this.isEnabled ? 'AI增强已启用' : '启用AI增强';
        toggleButton.addEventListener('click', () => this.toggleAI());

        // 添加到导航栏
        const nav = document.querySelector('.nav');
        if (nav) {
            nav.appendChild(toggleButton);
        }

        // 重新初始化图标
        if (typeof feather !== 'undefined') {
            feather.replace();
        }
    }

    // 切换AI功能
    toggleAI() {
        if (!this.isEnabled) {
            this.showConfigModal();
        } else {
            this.isEnabled = false;
            this.saveConfig();
            this.updateToggleButton();
            this.showMessage('AI增强已禁用', 'info');
        }
    }

    // 显示配置模态框
    showConfigModal() {
        const modal = document.createElement('div');
        modal.className = 'modal-overlay simple-ai-modal';
        modal.innerHTML = `
            <div class="modal-content simple-ai-content">
                <button class="modal-close" onclick="this.closest('.modal-overlay').remove()">&times;</button>
                <h3><i data-feather="brain"></i>AI智能增强</h3>
                
                <div class="ai-description">
                    <p>启用AI增强功能，为谵妄风险评估提供更智能的分析和建议。</p>
                    <div class="ai-features">
                        <div class="feature-item">
                            <i data-feather="zap"></i>
                            <span>智能风险分析</span>
                        </div>
                        <div class="feature-item">
                            <i data-feather="target"></i>
                            <span>个性化建议</span>
                        </div>
                        <div class="feature-item">
                            <i data-feather="users"></i>
                            <span>家庭指导优化</span>
                        </div>
                    </div>
                </div>

                <div class="config-section">
                    <h4>API配置</h4>
                    <p class="config-note">
                        需要Hugging Face API密钥来启用AI功能。
                        <a href="https://huggingface.co/settings/tokens" target="_blank">获取免费API密钥</a>
                    </p>
                    
                    <div class="field">
                        <label for="ai-api-key">API密钥</label>
                        <input type="password" id="ai-api-key" class="input" 
                               placeholder="输入您的Hugging Face API密钥" 
                               value="${this.apiKey || ''}">
                    </div>
                </div>

                <div class="config-actions">
                    <button class="button-primary" onclick="simpleAI.saveConfiguration()">
                        <i data-feather="save"></i>
                        启用AI增强
                    </button>
                    <button class="button-secondary" onclick="simpleAI.testConnection()">
                        <i data-feather="wifi"></i>
                        测试连接
                    </button>
                </div>

                <div class="disclaimer">
                    <i data-feather="info"></i>
                    <strong>注意:</strong> AI分析结果仅供参考，不能替代专业医疗判断。
                </div>
            </div>
        `;

        document.body.appendChild(modal);

        // 重新初始化图标
        if (typeof feather !== 'undefined') {
            feather.replace();
        }
    }

    // 保存配置
    saveConfiguration() {
        const apiKey = document.getElementById('ai-api-key').value.trim();
        
        if (!apiKey) {
            this.showMessage('请输入API密钥', 'error');
            return;
        }

        this.apiKey = apiKey;
        this.isEnabled = true;
        this.saveConfig();
        this.updateToggleButton();
        this.showMessage('AI增强已启用', 'success');
        
        // 关闭模态框
        setTimeout(() => {
            const modal = document.querySelector('.simple-ai-modal');
            if (modal) modal.remove();
        }, 1000);
    }

    // 测试连接
    async testConnection() {
        const apiKey = document.getElementById('ai-api-key').value.trim();
        if (!apiKey) {
            this.showMessage('请先输入API密钥', 'error');
            return;
        }

        const testButton = document.querySelector('.button-secondary[onclick*="testConnection"]');
        const originalText = testButton.innerHTML;
        testButton.innerHTML = '<div class="loading-spinner"></div> 测试中...';
        testButton.disabled = true;

        try {
            const response = await fetch(this.modelEndpoint, {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${apiKey}`,
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    inputs: '测试连接',
                    parameters: {
                        max_length: 10,
                        temperature: 0.7
                    }
                })
            });

            if (response.ok) {
                this.showMessage('连接测试成功！', 'success');
            } else {
                throw new Error(`HTTP ${response.status}: ${response.statusText}`);
            }
        } catch (error) {
            console.error('连接测试失败:', error);
            this.showMessage(`连接测试失败: ${error.message}`, 'error');
        } finally {
            testButton.innerHTML = originalText;
            testButton.disabled = false;
        }
    }

    // 更新切换按钮
    updateToggleButton() {
        const toggleButton = document.getElementById('simple-ai-toggle');
        if (toggleButton) {
            toggleButton.innerHTML = `<i data-feather="${this.isEnabled ? 'brain' : 'cpu'}"></i>`;
            toggleButton.title = this.isEnabled ? 'AI增强已启用' : '启用AI增强';
            if (typeof feather !== 'undefined') {
                feather.replace();
            }
        }
    }

    // 显示消息
    showMessage(message, type = 'info') {
        const messageDiv = document.createElement('div');
        messageDiv.className = `simple-ai-message simple-ai-message-${type}`;
        messageDiv.textContent = message;
        
        document.body.appendChild(messageDiv);
        
        setTimeout(() => {
            messageDiv.classList.add('show');
        }, 100);
        
        setTimeout(() => {
            messageDiv.classList.remove('show');
            setTimeout(() => messageDiv.remove(), 300);
        }, 3000);
    }

    // AI增强分析
    async enhanceAnalysis(patientData, riskFactors) {
        if (!this.isEnabled || !this.apiKey) {
            return this.generateRuleBasedInsights(patientData, riskFactors);
        }

        try {
            const prompt = this.buildAnalysisPrompt(patientData, riskFactors);
            const response = await this.callAIModel(prompt);
            return this.parseAIResponse(response);
        } catch (error) {
            console.error('AI分析失败:', error);
            return this.generateRuleBasedInsights(patientData, riskFactors);
        }
    }

    // 构建分析提示
    buildAnalysisPrompt(patientData, riskFactors) {
        return `作为重症医学专家，请基于以下患者信息提供术前谵妄预防建议：

患者信息：
- 年龄：${patientData.age || '未知'}岁
- 风险因素：${riskFactors.map(f => f.label).join(', ')}
- 风险评分：${patientData.score || '未知'}

请提供：
1. 风险评估解释
2. 个性化预防建议
3. 家庭参与要点
4. 监测重点

请用专业但易懂的语言回答：`;
    }

    // 调用AI模型
    async callAIModel(prompt) {
        const response = await fetch(this.modelEndpoint, {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${this.apiKey}`,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                inputs: prompt,
                parameters: {
                    max_length: 300,
                    temperature: 0.7,
                    do_sample: true
                }
            })
        });

        if (!response.ok) {
            throw new Error(`API调用失败: ${response.status}`);
        }

        return await response.json();
    }

    // 解析AI响应
    parseAIResponse(data) {
        if (data && data[0] && data[0].generated_text) {
            return {
                insights: data[0].generated_text,
                source: 'AI增强分析',
                confidence: 0.8
            };
        }
        throw new Error('AI响应格式错误');
    }

    // 规则基础分析
    generateRuleBasedInsights(patientData, riskFactors) {
        let insights = `基于循证医学的术前谵妄预防分析：\n\n`;
        
        insights += `📊 风险评估：\n`;
        insights += `患者存在${riskFactors.length}个风险因素，需要重点关注预防措施。\n\n`;
        
        if (riskFactors.length > 0) {
            insights += `⚠️ 主要风险因素：\n`;
            riskFactors.forEach(factor => {
                insights += `• ${factor.label}\n`;
            });
            insights += `\n`;
        }
        
        insights += `🛡️ 预防建议：\n`;
        insights += `1. 术前认知训练和大脑储备增强\n`;
        insights += `2. 体能准备和功能优化\n`;
        insights += `3. 药物评估和优化\n`;
        insights += `4. 家庭教育和支持网络建立\n`;
        insights += `5. 术后早期活动和认知刺激\n\n`;
        
        insights += `👨‍👩‍👧‍👦 家庭参与要点：\n`;
        insights += `• 协助患者完成术前准备\n`;
        insights += `• 提供情感支持和鼓励\n`;
        insights += `• 参与认知和体能训练\n`;
        insights += `• 准备熟悉的环境物品\n\n`;
        
        return {
            insights,
            source: '循证医学分析',
            confidence: 0.9
        };
    }

    // 检查是否启用
    isAIEnabled() {
        return this.isEnabled && this.apiKey;
    }
}

// 添加简单AI增强样式
const simpleAIStyle = document.createElement('style');
simpleAIStyle.textContent = `
    .simple-ai-toggle {
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
    
    .simple-ai-toggle:hover {
        background-color: var(--primary-light);
        border-color: var(--primary-color);
        transform: translateY(-1px);
    }
    
    .simple-ai-toggle .feather {
        width: 18px;
        height: 18px;
    }
    
    .simple-ai-modal .modal-content {
        max-width: 600px;
    }
    
    .ai-description {
        margin-bottom: 24px;
    }
    
    .ai-features {
        display: grid;
        grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
        gap: 16px;
        margin-top: 16px;
    }
    
    .feature-item {
        display: flex;
        align-items: center;
        gap: 8px;
        padding: 12px;
        background: var(--light-bg-color);
        border-radius: var(--border-radius-sm);
        font-size: 0.9em;
    }
    
    .feature-item .feather {
        width: 16px;
        height: 16px;
        color: var(--primary-color);
    }
    
    .config-note {
        color: var(--text-muted-color);
        font-size: 0.9em;
        margin-bottom: 16px;
    }
    
    .config-note a {
        color: var(--primary-color);
        text-decoration: none;
    }
    
    .config-note a:hover {
        text-decoration: underline;
    }
    
    .disclaimer {
        background: var(--warning-light);
        color: var(--warning-color);
        padding: 12px 16px;
        border-radius: var(--border-radius-sm);
        border-left: 4px solid var(--warning-color);
        font-size: 0.9em;
        margin-top: 20px;
        display: flex;
        align-items: flex-start;
        gap: 8px;
    }
    
    .disclaimer .feather {
        width: 16px;
        height: 16px;
        margin-top: 2px;
        flex-shrink: 0;
    }
    
    .simple-ai-message {
        position: fixed;
        top: 20px;
        right: 20px;
        padding: 12px 20px;
        border-radius: var(--border-radius);
        color: white;
        font-weight: 500;
        z-index: 10000;
        transform: translateX(100%);
        transition: transform 0.3s ease;
    }
    
    .simple-ai-message.show {
        transform: translateX(0);
    }
    
    .simple-ai-message-success {
        background-color: var(--success-color);
    }
    
    .simple-ai-message-error {
        background-color: var(--danger-color);
    }
    
    .simple-ai-message-info {
        background-color: var(--info-color);
    }
    
    @media (max-width: 768px) {
        .ai-features {
            grid-template-columns: 1fr;
        }
        
        .simple-ai-modal .modal-content {
            margin: 10px;
            width: calc(100% - 20px);
        }
    }
`;
document.head.appendChild(simpleAIStyle);

// 初始化简单AI增强
window.simpleAI = new SimpleAIEnhancement();
