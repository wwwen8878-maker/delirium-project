document.addEventListener('DOMContentLoaded', () => {
    const patientListContainer = document.getElementById('patient-list-container');
    const addPatientBtn = document.getElementById('add-patient-btn');
    const modal = document.getElementById('add-patient-modal');
    const closeModalBtn = document.getElementById('close-modal-btn');
    const addPatientForm = document.getElementById('add-patient-form');

    function renderPatientList() {
        const patients = getAllPatients().reverse(); // reverse() to show latest first
        if (patients.length === 0) {
            patientListContainer.innerHTML = `<p class="muted" style="text-align:center;">暂无患者记录，请点击右上角“添加新患者”。</p>`;
            return;
        }

        let listHtml = '<div class="patient-list">';
        patients.forEach(p => {
            let statusClass = '';
            let statusText = '待评估';
            if (p.assessment) {
                statusText = p.assessment.riskLevel;
                if(statusText === '高风险' || statusText === '极高风险') statusClass = 'status-high';
                if(statusText === '中等风险') statusClass = 'status-medium';
                if(statusText === '低风险') statusClass = 'status-low';
            }
            if(p.latestStatus === 'high-risk') {
                 statusClass = 'status-high';
                 statusText = '阳性-高风险';
            } else if (p.latestStatus === 'low-risk') {
                 statusClass = 'status-low';
                 statusText = '阴性-低风险';
            }

            listHtml += `
                <a href="./patient-detail.html?id=${p.id}" class="patient-list-item">
                    <div class="patient-info">
                        <span class="patient-name">${p.name}</span>
                        <span class="patient-meta">年龄: ${p.age} | 病房: ${p.room}</span>
                    </div>
                    <div class="patient-status ${statusClass}">
                        <span>${statusText}</span>
                    </div>
                </a>
            `;
        });
        listHtml += '</div>';
        patientListContainer.innerHTML = listHtml;
    }

    // Modal logic
    addPatientBtn.addEventListener('click', () => modal.style.display = 'flex');
    closeModalBtn.addEventListener('click', () => modal.style.display = 'none');
    window.addEventListener('click', (e) => {
        if (e.target === modal) modal.style.display = 'none';
    });

    // Form submission
    addPatientForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const newPatient = {
            id: `patient_${Date.now()}`,
            name: document.getElementById('patientName').value,
            age: document.getElementById('patientAge').value,
            surgery: document.getElementById('patientSurgery').value,
            room: document.getElementById('patientRoom').value,
            assessment: null,
            screenings: [],
            latestStatus: 'pending' // pending, low-risk, high-risk
        };
        savePatient(newPatient);
        addPatientForm.reset();
        modal.style.display = 'none';
        renderPatientList();
    });

    // Initial render
    renderPatientList();
});