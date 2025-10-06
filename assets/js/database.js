// A simple localStorage-based database utility for the delirium project

const DB_KEY = 'deliriumPatientsDB';

// 初始化数据库
function initDB() {
    if (!localStorage.getItem(DB_KEY)) {
        localStorage.setItem(DB_KEY, JSON.stringify([]));
    }
}

// 获取所有患者
function getAllPatients() {
    return JSON.parse(localStorage.getItem(DB_KEY));
}

// 通过ID获取单个患者
function getPatientById(patientId) {
    const patients = getAllPatients();
    return patients.find(p => p.id === patientId);
}

// 保存/更新患者信息
function savePatient(patientData) {
    let patients = getAllPatients();
    const existingIndex = patients.findIndex(p => p.id === patientData.id);

    if (existingIndex > -1) {
        // 更新
        patients[existingIndex] = { ...patients[existingIndex], ...patientData };
    } else {
        // 新增
        patients.push(patientData);
    }
    localStorage.setItem(DB_KEY, JSON.stringify(patients));
}

// 为患者添加入院评估
function addAssessmentToPatient(patientId, assessmentData) {
    let patients = getAllPatients();
    const patientIndex = patients.findIndex(p => p.id === patientId);
    if (patientIndex > -1) {
        patients[patientIndex].assessment = assessmentData;
        localStorage.setItem(DB_KEY, JSON.stringify(patients));
    }
}

// 为患者添加每日筛查记录
function addScreeningToPatient(patientId, screeningData) {
    let patients = getAllPatients();
    const patientIndex = patients.findIndex(p => p.id === patientId);
    if (patientIndex > -1) {
        if (!patients[patientIndex].screenings) {
            patients[patientIndex].screenings = [];
        }
        patients[patientIndex].screenings.unshift(screeningData); // unshift để最新記錄在最前
        
        // 更新患者的最新状态
        patients[patientIndex].latestStatus = screeningData.result === '阳性' ? 'high-risk' : 'low-risk';

        localStorage.setItem(DB_KEY, JSON.stringify(patients));
    }
}

// 初始化
initDB();