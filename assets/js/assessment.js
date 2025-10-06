document.addEventListener('DOMContentLoaded', () => {
    // E-PRE-DELIRIC 模型及家属宣教内容库
    const E_PRE_DELIRIC_MODEL = {
        riskFactors: [
            // ... riskFactors 内容与您提供的文件一致，此处省略 ...
             { id: 'age', label: '年龄 ≥ 71 岁', points: 2, type: 'checkbox' },
            { id: 'cognitive_impairment', label: '存在认知障碍史', points: 2, type: 'checkbox' },
            { id: 'admission_type', label: '入院类型为急诊', points: 1, type: 'checkbox' },
            { id: 'blood_urea_nitrogen', label: '血尿素氮 > 7.5 mmol/L', points: 1, type: 'checkbox' },
            { id: 'infection', label: '入院时存在感染', points: 1, type: 'checkbox' },
            { id: 'coma', label: '入院时存在昏迷 (GCS < 10)', points: 2, type: 'checkbox' },
            { id: 'metabolic_acidosis', label: '存在代谢性酸中毒', points: 1, type: 'checkbox' },
            { id: 'sedative_use', label: '入院前24小时内使用过镇静药物', points: 1, type: 'checkbox' },
            { id: 'opioid_use', label: '入院前24小时内使用过阿片类药物', points: 1, type: 'checkbox' },
            { id: 'sleep_disturbance', label: '入院前存在睡眠障碍', points: 1, type: 'checkbox' },
        ],
        recommendations: {
            // ... recommendations 内容与您提供的文件一致，此处省略 ...
            'age': '高龄是重要风险因素。请确保提供易于消化的营养饮食，并在医生允许下，协助患者尽早进行床上或床边活动。',
            'cognitive_impairment': '认知障碍患者对环境变化敏感。请多与患者进行“现实定向”沟通（告知时间、地点），并尽量由固定、熟悉的家人陪伴。',
            'admission_type': '急诊患者通常病情较重，应激水平高。请为其营造一个安静、舒适的休养环境，减少不必要的探视和噪音。',
            'blood_urea_nitrogen': '血尿素氮升高可能与脱水或肾功能有关。请确保患者每日摄入足够的水分，并密切观察尿量。',
            'infection': '感染是谵妄的常见诱因。请遵医嘱使用抗生素，并监测患者体温变化，注意口腔和皮肤的清洁。',
            'coma': '昏迷患者苏醒后是谵妄高危期。苏醒后应立即进行听觉、视觉和触觉的柔和刺激，帮助其恢复定向力。',
            'metabolic_acidosis': '代谢性酸中毒是严重疾病的标志。需要医疗团队积极治疗原发病，家属能做的是密切观察患者的意识状态变化并及时报告。',
            'sedative_use': '镇静药物会增加大脑混乱的风险。请与医生沟通，是否可以采用非药物助眠方法，如夜间调暗灯光、播放轻音乐等。',
            'opioid_use': '阿片类药物是术后镇痛的常用药，但也可能诱发谵妄。请与医生沟通多模式镇痛方案，以减少阿片类药物用量。',
            'sleep_disturbance': '睡眠障碍会破坏大脑的修复过程。请帮助患者建立规律的作息，白天保持病房明亮、鼓励活动，夜间则保持黑暗、安静。',
            'default': '<strong>核心建议：</strong>请确保患者佩戴自己的眼镜和助听器，这对于减少环境陌生感、预防谵妄至关重要。'
        },
        // 【全新】家属宣教模块内容库
        familyEducation: {
            'age': { title: '❤️ 关于年龄', content: '年龄是影响恢复的因素之一，但您的陪伴是最好的良药。术后请多鼓励亲人在床上活动手脚，和他/她说说话，这能大大帮助他/她保持头脑清晰。' },
            'cognitive_impairment': { title: '🧠 关于记忆力', content: '如果您的亲人术前记忆力有所下降，术后可能会对新环境感到陌生和不安。请您多一些耐心，经常告诉他/她现在在哪里、现在是什么时间，给他/她带来熟悉感和安全感。' },
            'sleep_disturbance': { title: '🌙 关于睡眠', content: '术前的睡眠不好可能会影响术后恢复。我们可以一起帮助亲人重建“生物钟”：白天拉开窗帘，鼓励他/她坐起来；晚上调暗灯光，保持安静。一个好的睡眠是大脑修复的关键。' },
            'infection': { title: '🛡️ 关于感染', content: '感染会给身体带来压力。除了遵医嘱治疗，我们能做的是帮助亲人保持口腔和身体的清洁，并留意体温变化，共同筑起一道健康的防线。' },
             'default_intro': '您的家人即将进行手术，这份个性化的预防指南希望能帮助您更好地参与到亲人的康复过程中。您的关心和参与，是预防术后大脑“临时短路”（谵妄）的最重要力量。',
             'default_outro': '请记住，您不是一个人在战斗。有任何疑问，请随时与我们的医护人员沟通。让我们一起，为亲人的平稳康复努力！'
        }
    };

    const form = document.getElementById('assessment-form');
    const resultContainer = document.getElementById('assessment-result');
    let assessmentChart = null;
    
    // 从URL获取患者ID (关键代码)
    const urlParams = new URLSearchParams(window.location.search);
    const patientId = urlParams.get('id');

    if (!patientId && !window.location.pathname.includes('guide.html')) { // Allow on guide page for demo
        form.innerHTML = `<p class="notice danger">错误：未指定患者。请从“患者仪表盘”选择一位患者后进入此页面。</p>`;
        return;
    }

    // ... (generateQuestionnaire, calculateRisk, renderGauge 函数保持不变) ...
    function generateQuestionnaire() {
        let formHtml = '';
        E_PRE_DELIRIC_MODEL.riskFactors.forEach(factor => {
            formHtml += `
                <div class="form-question-card">
                    <label for="${factor.id}">${factor.label}</label>
                    <input type="${factor.type}" id="${factor.id}" name="${factor.id}" data-points="${factor.points}">
                </div>
            `;
        });
        formHtml += `<div class="actions"><button type="submit" class="button-primary">完成评估，生成报告</button></div>`;
        form.innerHTML = formHtml;
    }
    function calculateRisk(score) {
        let level, probability, color;
        if (score >= 6) {
            level = '高风险';
            probability = '约 51%';
            color = 'var(--danger-color)';
        } else if (score >= 4) {
            level = '中等风险';
            probability = '约 27%';
            color = '#ffc107';
        } else {
            level = '低风险';
            probability = '约 10%';
            color = 'var(--success-color)';
        }
        return { level, probability, color };
    }
    function renderGauge(score) {
        const gaugeContainer = document.getElementById('gauge-container');
        gaugeContainer.innerHTML = '<canvas id="gauge-chart"></canvas>';
        const ctx = document.getElementById('gauge-chart').getContext('2d');
        const riskData = calculateRisk(score);
        if(assessmentChart) { assessmentChart.destroy(); }
        assessmentChart = new Chart(ctx, { type: 'doughnut', data: { datasets: [{ data: [score, 10 - score], backgroundColor: [riskData.color, '#e9ecef'], borderWidth: 0 }] }, options: { rotation: -90, circumference: 180, cutout: '70%', responsive: true, maintainAspectRatio: true, plugins: { legend: { display: false }, tooltip: { enabled: false } } } });
    }

    // 【全新】生成家属宣教内容的函数
    function generateFamilyEducationHTML(selectedFactors) {
        const education = E_PRE_DELIRIC_MODEL.familyEducation;
        let html = `<div class="family-education-sheet"><h3><i data-feather="heart"></i>致患者家属的一封信</h3>`;
        html += `<p class="intro">${education.default_intro}</p>`;
        html += `<h4>针对您家人的情况，我们特别提醒：</h4><ul>`;

        if (selectedFactors.length === 0) {
            html += `<li>太棒了！您家人的风险因素较少，请继续保持，并参照我们的《指南解读》做好基础预防。</li>`;
        } else {
            selectedFactors.forEach(factorId => {
                if (education[factorId]) {
                    html += `<li><strong>${education[factorId].title}:</strong> ${education[factorId].content}</li>`;
                }
            });
        }
        
        html += `</ul><p class="outro">${education.default_outro}</p></div>`;
        return html;
    }

    // 【修复并升级】表单提交事件
    form.addEventListener('submit', function(e) {
        e.preventDefault();
        let totalScore = 0;
        const selectedFactors = [];
        const formData = new FormData(form);

        E_PRE_DELIRIC_MODEL.riskFactors.forEach(factor => {
            if (formData.has(factor.id)) {
                totalScore += factor.points;
                selectedFactors.push(factor.id);
            }
        });

        const riskData = calculateRisk(totalScore);
        
        // 生成医护人员看的专业建议
        let recommendationsHtml = `<li>${E_PRE_DELIRIC_MODEL.recommendations.default}</li>`;
        selectedFactors.forEach(factorId => {
            recommendationsHtml += `<li>${E_PRE_DELIRIC_MODEL.recommendations[factorId]}</li>`;
        });

        // 生成给家属看的宣教内容
        const familyEducationHtml = generateFamilyEducationHTML(selectedFactors);

        // 构建要保存到数据库的评估数据
        const assessmentData = {
            score: totalScore,
            riskLevel: riskData.level,
            probability: riskData.probability,
            recommendationsHtml: recommendationsHtml // 保存专业建议
        };

        // 【关键修复】调用 database.js 中的函数保存数据
        if (patientId) {
             addAssessmentToPatient(patientId, assessmentData);
        }

        // --- 渲染页面 ---
        // 渲染专业报告部分
        document.getElementById('risk-score').innerHTML = `<strong>风险总分:</strong> ${totalScore} 分`;
        document.getElementById('risk-level').innerHTML = `<strong>风险等级:</strong> <span style="color:${riskData.color};">${riskData.level}</span>`;
        document.getElementById('risk-probability').innerHTML = `<strong>预估谵妄概率:</strong> ${riskData.probability}`;
        document.querySelector('#recommendations-container .recommendation-list').innerHTML = recommendationsHtml;
        
        // 【全新】渲染家属宣教部分
        document.getElementById('family-education-container').innerHTML = familyEducationHtml;
        feather.replace();

        // 渲染图表并显示整个结果区
        renderGauge(totalScore);
        resultContainer.style.display = 'block';
        resultContainer.scrollIntoView({ behavior: 'smooth' });
        
        // 禁用提交按钮并提供下一步操作
        const button = form.querySelector('button');
        button.textContent = '评估已保存';
        button.disabled = true;
        
        if (patientId) {
            const backButton = document.createElement('a');
            backButton.href = `./patient-detail.html?id=${patientId}`;
            backButton.className = 'button-primary';
            backButton.textContent = '返回患者详情页';
            backButton.style.marginLeft = '20px';
            if (!button.parentElement.querySelector('a')) { // 防止重复添加
                button.parentElement.appendChild(backButton);
            }
        }
    });

    // 初始化页面
    generateQuestionnaire();
});