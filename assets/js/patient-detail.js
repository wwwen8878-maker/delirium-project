document.addEventListener('DOMContentLoaded', () => {
    const patientHeader = document.getElementById('patient-header');
    const timelineContainer = document.getElementById('timeline-container');
    const camModal = document.getElementById('cam-modal');
    const closeCamModalBtn = document.getElementById('close-cam-modal-btn');
    const camForm = document.getElementById('cam-form');

    // 从URL获取患者ID
    const urlParams = new URLSearchParams(window.location.search);
    const patientId = urlParams.get('id');
    const patient = getPatientById(patientId);

    if (!patient) {
        patientHeader.innerHTML = `<h1>未找到患者信息</h1>`;
        return;
    }

    function renderPatientHeader() {
        patientHeader.innerHTML = `
            <div>
                <h1>${patient.name} <span class="muted" style="font-size: 0.6em;">(${patient.age}岁 | ${patient.room}房)</span></h1>
                <p class="muted">手术类型: ${patient.surgery || '未记录'}</p>
            </div>
            <button id="add-screening-btn" class="button-primary"><i data-feather="plus-square"></i> 添加今日筛查</button>
        `;
        feather.replace();
        document.getElementById('add-screening-btn').addEventListener('click', () => camModal.style.display = 'flex');
    }

    function renderTimeline() {
        let timelineHtml = '';

        // 添加入院评估
        if (patient.assessment) {
            const assessment = patient.assessment;
            timelineHtml += `
                <div class="timeline-item">
                    <div class="timeline-icon assessment"><i data-feather="clipboard"></i></div>
                    <div class="timeline-content card">
                        <h4>入院风险评估</h4>
                        <p><strong>风险总分:</strong> ${assessment.score} | <strong>风险等级:</strong> ${assessment.riskLevel} | <strong>预估概率:</strong> ${assessment.probability}</p>
                        <h5>系统建议的预防措施:</h5>
                        <ul class="recommendation-list small">
                            ${assessment.recommendationsHtml}
                        </ul>
                        <span class="timeline-date">评估于 ${new Date().toLocaleDateString()}</span>
                    </div>
                </div>
            `;
        } else {
            timelineHtml += `
                <div class="timeline-item">
                     <div class="timeline-icon assessment"><i data-feather="clipboard"></i></div>
                     <div class="timeline-content card card-interactive-small">
                        <h4>该患者尚未进行入院风险评估</h4>
                        <a href="./assessment.html?id=${patient.id}" class="button-primary small">立即进行评估 &rarr;</a>
                     </div>
                </div>
            `;
        }
        
        // 添加每日筛查记录
        if (patient.screenings && patient.screenings.length > 0) {
            patient.screenings.forEach(screening => {
                const isPositive = screening.result === '阳性';
                timelineHtml += `
                    <div class="timeline-item">
                        <div class="timeline-icon screening ${isPositive ? 'positive' : 'negative'}"><i data-feather="${isPositive ? 'alert-triangle' : 'check'}"></i></div>
                        <div class="timeline-content card">
                            <h4>每日谵妄筛查 (CAM) - <span style="color: ${isPositive ? 'var(--danger-color)' : 'var(--success-color)'};">${screening.result}</span></h4>
                            <p><strong>筛查要点:</strong> ${screening.details.join(', ')}</p>
                            ${screening.notes ? `<p><strong>补充记录:</strong> ${screening.notes}</p>` : ''}
                            <span class="timeline-date">记录于 ${screening.date}</span>
                        </div>
                    </div>
                `;
            });
        }

        timelineContainer.innerHTML = timelineHtml;
        feather.replace();
    }
    
    // CAM Modal Logic
    closeCamModalBtn.addEventListener('click', () => camModal.style.display = 'none');
    
    camForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const f1 = document.getElementById('cam1').checked;
        const f2 = document.getElementById('cam2').checked;
        const f3 = document.getElementById('cam3').checked;
        const f4 = document.getElementById('cam4').checked;
        const notes = document.getElementById('cam-notes').value;

        // CAM 算法: (特征1 和 特征2) 必须存在, 并且 (特征3 或 特征4) 至少存在一个
        const isPositive = (f1 && f2) && (f3 || f4);
        
        const details = [];
        if(f1) details.push('急性发作');
        if(f2) details.push('注意力不集中');
        if(f3) details.push('思维混乱');
        if(f4) details.push('意识水平改变');

        const newScreening = {
            date: new Date().toLocaleString(),
            result: isPositive ? '阳性' : '阴性',
            details: details.length > 0 ? details : ['无'],
            notes: notes
        };
        
        addScreeningToPatient(patientId, newScreening);
        camForm.reset();
        camModal.style.display = 'none';
        renderTimeline(); // Re-render the timeline with new data
    });

    // Initial render
    renderPatientHeader();
    renderTimeline();
});