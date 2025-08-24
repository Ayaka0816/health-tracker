class HealthTracker {
    constructor() {
        this.records = JSON.parse(localStorage.getItem('healthRecords')) || [];
        this.init();
    }
    
    init() {
        this.setupForm();
        this.displayRecords();
        this.setTodayDate();
    }
    
    setTodayDate() {
        const today = new Date().toISOString().split('T')[0];
        document.getElementById('date').value = today;
    }
    
    setupForm() {
        const form = document.getElementById('healthForm');
        form.addEventListener('submit', (e) => {
            e.preventDefault();
            this.saveRecord();
        });
    }
    
    saveRecord() {
        const formData = new FormData(document.getElementById('healthForm'));
        
        const record = {
            id: Date.now(),
            date: formData.get('date'),
            factors: {
                meals: {
                    breakfast: formData.getAll('meals').includes('breakfast'),
                    lunch: formData.getAll('meals').includes('lunch'),
                    dinner: formData.getAll('meals').includes('dinner'),
                    snack: formData.getAll('meals').includes('snack')
                },
                sleepHours: parseInt(formData.get('sleepHours')) || 0,
                stress: formData.get('stress'),
                exercise: formData.get('exercise'),
                bowel: formData.get('bowel'),
                commute: formData.get('commute'),
                workCount: formData.get('workCount'),
                relaxTime: formData.get('relaxTime'),
                freelanceTime: formData.get('freelanceTime'),
                ahj: formData.get('ahj')
            },
            symptoms: {
                headache: formData.getAll('symptoms').includes('headache'),
                fatigue: formData.getAll('symptoms').includes('fatigue'),
                soreThroat: formData.getAll('symptoms').includes('soreThroat'),
                nasalCongestion: formData.getAll('symptoms').includes('nasalCongestion'),
                phlegm: formData.getAll('symptoms').includes('phlegm'),
                stomachPain: formData.getAll('symptoms').includes('stomachPain'),
                eyeFatigue: formData.getAll('symptoms').includes('eyeFatigue'),
                other: formData.getAll('symptoms').includes('other')
            },
            timestamp: new Date().toISOString()
        };
        
        const existingIndex = this.records.findIndex(r => r.date === record.date);
        if (existingIndex !== -1) {
            this.records[existingIndex] = record;
        } else {
            this.records.push(record);
        }
        
        this.records.sort((a, b) => new Date(b.date) - new Date(a.date));
        
        localStorage.setItem('healthRecords', JSON.stringify(this.records));
        
        this.displayRecords();
        this.showSuccessMessage();
        
        document.getElementById('healthForm').reset();
        this.setTodayDate();
    }
    
    showSuccessMessage() {
        const btn = document.querySelector('.btn');
        const originalText = btn.textContent;
        btn.textContent = '保存完了！';
        btn.style.backgroundColor = '#2196F3';
        
        setTimeout(() => {
            btn.textContent = originalText;
            btn.style.backgroundColor = '#4CAF50';
        }, 2000);
    }
    
    displayRecords() {
        const recordsList = document.getElementById('recordsList');
        
        if (this.records.length === 0) {
            recordsList.innerHTML = '<p style="text-align: center; color: #666;">まだ記録がありません</p>';
            return;
        }
        
        recordsList.innerHTML = this.records.map(record => this.createRecordHTML(record)).join('');
    }
    
    createRecordHTML(record) {
        const factors = this.formatFactors(record.factors);
        const symptoms = this.formatSymptoms(record.symptoms);
        
        return `
            <div class="record-item">
                <div class="record-date">${this.formatDate(record.date)}</div>
                <div class="record-details">
                    <strong>体調要因:</strong> ${factors}<br>
                    <strong>症状:</strong> ${symptoms}
                </div>
            </div>
        `;
    }
    
    formatFactors(factors) {
        const items = [];
        
        if (factors.meals) {
            const mealItems = [];
            if (factors.meals.breakfast) mealItems.push('朝食');
            if (factors.meals.lunch) mealItems.push('昼食');
            if (factors.meals.dinner) mealItems.push('夕食');
            if (factors.meals.snack) mealItems.push('間食');
            if (mealItems.length > 0) {
                items.push(`食事: ${mealItems.join('・')}`);
            }
        }
        if (factors.sleepHours > 0) {
            const sleepLabels = {
                4: '４時間以下',
                5: '５時間',
                6: '６時間',
                7: '７時間',
                8: '８時間'
            };
            items.push(`睡眠: ${sleepLabels[factors.sleepHours] || factors.sleepHours + '時間'}`);
        }
        if (factors.stress === 'yes') items.push('ストレスあり');
        if (factors.stress === 'no') items.push('ストレスなし');
        if (factors.exercise) items.push(`運動: ${this.getExerciseLabel(factors.exercise)}`);
        if (factors.bowel === 'yes') items.push('排便あり');
        if (factors.bowel === 'no') items.push('排便なし');
        if (factors.commute) items.push(`通勤: ${this.getCommuteLabel(factors.commute)}`);
        if (factors.workCount) {
            const workLabels = {
                '0-1': '０〜１件',
                '2-3': '２〜３件',
                '4-5': '４〜５件',
                '5+': '５〜件',
                'holiday': '休み'
            };
            items.push(`仕事: ${workLabels[factors.workCount] || factors.workCount + '件'}`);
        }
        if (factors.relaxTime === 'yes') items.push('リラックスタイムあり');
        if (factors.relaxTime === 'no') items.push('リラックスタイムなし');
        if (factors.freelanceTime === 'yes') items.push('Freelance timeあり');
        if (factors.freelanceTime === 'no') items.push('Freelance timeなし');
        if (factors.ahj) items.push(`AHJ: ${this.getAhjLabel(factors.ahj)}`);
        
        return items.length > 0 ? items.join(', ') : 'なし';
    }
    
    formatSymptoms(symptoms) {
        const items = [];
        const labels = {
            headache: '頭痛',
            fatigue: '倦怠感',
            soreThroat: '喉の痛み',
            nasalCongestion: '鼻詰まり',
            phlegm: '痰が出る',
            stomachPain: '腹痛',
            eyeFatigue: '目の疲れ',
            other: 'その他'
        };
        
        Object.keys(symptoms).forEach(key => {
            if (symptoms[key]) {
                items.push(labels[key]);
            }
        });
        
        return items.length > 0 ? items.join(', ') : 'なし';
    }
    
    getExerciseLabel(value) {
        const labels = {
            nothing: 'Nothing',
            light: 'Light',
            usually: 'Usually',
            hard: 'Hard'
        };
        return labels[value] || value;
    }
    
    getCommuteLabel(value) {
        const labels = {
            'train-walk': '電車＋徒歩',
            'train-bus': '電車＋バス',
            'car': '車',
            'holiday': '休み'
        };
        return labels[value] || value;
    }
    
    getAhjLabel(value) {
        const labels = {
            peace: 'こころの平和',
            conflict: '葛藤',
            fear: '怖れ',
            forgive: 'ゆるす',
            love: '愛'
        };
        return labels[value] || value;
    }
    
    formatDate(dateString) {
        const date = new Date(dateString);
        return date.toLocaleDateString('ja-JP', {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
            weekday: 'long'
        });
    }
    
    exportData() {
        const dataStr = JSON.stringify(this.records, null, 2);
        const dataBlob = new Blob([dataStr], {type: 'application/json'});
        const url = URL.createObjectURL(dataBlob);
        
        const link = document.createElement('a');
        link.href = url;
        link.download = `health-records-${new Date().toISOString().split('T')[0]}.json`;
        link.click();
        
        URL.revokeObjectURL(url);
    }
    
    analyzePatterns() {
        if (this.records.length < 2) {
            alert('分析には2日以上のデータが必要です');
            return;
        }
        
        const analysis = this.performAnalysis();
        this.displayAnalysis(analysis);
    }
    
    performAnalysis() {
        const symptomsWithFactors = {};
        const factorLabels = {
            breakfast: '朝食摂取',
            lunch: '昼食摂取',
            dinner: '夕食摂取',
            snack: '間食摂取',
            stress: 'ストレスあり',
            bowel: '排便あり',
            sleepHours: '睡眠時間不足',
            exercise: '運動',
            commute: '通勤方法',
            workCount: '仕事件数多',
            relaxTime: 'リラックスタイムあり',
            freelanceTime: 'Freelance timeあり',
            ahj: 'AHJ'
        };
        
        const symptomLabels = {
            headache: '頭痛',
            fatigue: '倦怠感',
            soreThroat: '喉の痛み',
            nasalCongestion: '鼻詰まり',
            phlegm: '痰が出る',
            stomachPain: '腹痛',
            eyeFatigue: '目の疲れ',
            other: 'その他'
        };
        
        Object.keys(symptomLabels).forEach(symptom => {
            symptomsWithFactors[symptom] = {
                total: 0,
                withFactors: {},
                label: symptomLabels[symptom]
            };
        });
        
        this.records.forEach(record => {
            Object.keys(record.symptoms).forEach(symptom => {
                if (record.symptoms[symptom]) {
                    symptomsWithFactors[symptom].total++;
                    
                    Object.keys(record.factors).forEach(factor => {
                        let hasFactor = false;
                        
                        if (factor === 'meals') {
                            // 各食事を個別にチェック
                            Object.keys(record.factors.meals).forEach(mealType => {
                                if (record.factors.meals[mealType]) {
                                    if (!symptomsWithFactors[symptom].withFactors[mealType]) {
                                        symptomsWithFactors[symptom].withFactors[mealType] = 0;
                                    }
                                    symptomsWithFactors[symptom].withFactors[mealType]++;
                                }
                            });
                        } else if (factor === 'sleepHours') {
                            hasFactor = record.factors[factor] <= 6;
                        } else if (factor === 'workCount') {
                            hasFactor = record.factors[factor] === '4-5' || record.factors[factor] === '5+' || record.factors[factor] === 'holiday';
                        } else if (factor === 'stress') {
                            hasFactor = record.factors[factor] === 'yes';
                        } else if (factor === 'bowel') {
                            hasFactor = record.factors[factor] === 'yes';
                        } else if (factor === 'relaxTime') {
                            hasFactor = record.factors[factor] === 'yes';
                        } else if (factor === 'freelanceTime') {
                            hasFactor = record.factors[factor] === 'yes';
                        } else if (factor === 'ahj') {
                            hasFactor = record.factors[factor] === 'peace' || record.factors[factor] === 'forgive' || record.factors[factor] === 'love';
                        } else if (typeof record.factors[factor] === 'boolean') {
                            hasFactor = record.factors[factor];
                        } else if (typeof record.factors[factor] === 'string') {
                            hasFactor = record.factors[factor] !== '';
                        }
                        
                        if (hasFactor && factor !== 'meals') {
                            if (!symptomsWithFactors[symptom].withFactors[factor]) {
                                symptomsWithFactors[symptom].withFactors[factor] = 0;
                            }
                            symptomsWithFactors[symptom].withFactors[factor]++;
                        }
                    });
                }
            });
        });
        
        const correlations = [];
        Object.keys(symptomsWithFactors).forEach(symptom => {
            const data = symptomsWithFactors[symptom];
            if (data.total > 0) {
                Object.keys(data.withFactors).forEach(factor => {
                    const correlation = (data.withFactors[factor] / data.total) * 100;
                    if (correlation >= 50) {
                        correlations.push({
                            symptom: data.label,
                            factor: factorLabels[factor] || factor,
                            percentage: correlation.toFixed(1),
                            strength: correlation >= 80 ? 'strong' : correlation >= 65 ? 'moderate' : 'weak'
                        });
                    }
                });
            }
        });
        
        return correlations.sort((a, b) => parseFloat(b.percentage) - parseFloat(a.percentage));
    }
    
    displayAnalysis(correlations) {
        const analysisResult = document.getElementById('analysisResult');
        
        if (correlations.length === 0) {
            analysisResult.innerHTML = `
                <div class="analysis-section">
                    <h4>パターン分析結果</h4>
                    <p>明確な相関関係は見つかりませんでした。より多くのデータを蓄積してから再度分析してください。</p>
                </div>
            `;
            return;
        }
        
        const correlationHTML = correlations.map(correlation => `
            <div class="correlation-item correlation-${correlation.strength}">
                <div style="display: flex; justify-content: space-between; align-items: center;">
                    <span><strong>${correlation.symptom}</strong> と <strong>${correlation.factor}</strong> の関連性</span>
                    <span class="percentage">${correlation.percentage}%</span>
                </div>
                <div style="font-size: 12px; color: #666; margin-top: 5px;">
                    ${correlation.symptom}が発生した時の${correlation.percentage}%で${correlation.factor}が関与しています
                </div>
            </div>
        `).join('');
        
        analysisResult.innerHTML = `
            <div class="analysis-section">
                <h4>パターン分析結果</h4>
                <p style="margin-bottom: 15px;">以下は体調症状と要因の相関関係です（相関率50%以上を表示）:</p>
                ${correlationHTML}
                <div style="margin-top: 15px; font-size: 12px; color: #666;">
                    <strong>相関の強さ:</strong> 
                    <span style="color: #f44336;">■</span> 強い相関(80%以上) 
                    <span style="color: #ff9800;">■</span> 中程度の相関(65-79%) 
                    <span style="color: #4caf50;">■</span> 弱い相関(50-64%)
                </div>
            </div>
        `;
        
        analysisResult.scrollIntoView({ behavior: 'smooth' });
    }
    
    deleteTodayRecord() {
        const today = new Date().toISOString().split('T')[0];
        
        if (confirm(`${today}の記録を削除しますか？この操作は取り消せません。`)) {
            this.records = this.records.filter(record => record.date !== today);
            localStorage.setItem('healthRecords', JSON.stringify(this.records));
            this.displayRecords();
            alert('今日の記録を削除しました。');
        }
    }
}

document.addEventListener('DOMContentLoaded', () => {
    const tracker = new HealthTracker();
    
    window.exportData = () => tracker.exportData();
    window.analyzePatterns = () => tracker.analyzePatterns();
    window.deleteTodayRecord = () => tracker.deleteTodayRecord();
});