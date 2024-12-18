document.addEventListener('DOMContentLoaded', function() {
    console.log('DOM loaded');  // 用於調試
    initializeCalculator();
});

function initializeCalculator() {
    // 修改按鈕綁定方式
    const calculateButtons = document.querySelectorAll('#calculateButton');
    calculateButtons.forEach(button => {
        button.addEventListener('click', function(e) {
            e.preventDefault();
            calculateCommission();
        });
    });

    // 綁定輸入框事件
    document.querySelectorAll('.calc-input-group input').forEach(input => {
        input.addEventListener('input', calculateCommission);
    });

    // 初始計算一次
    calculateCommission();
}

// 平滑滾動效果
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            target.scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });
        }
    });
});

// 導航欄高亮當前區塊
window.addEventListener('scroll', function() {
    const sections = document.querySelectorAll('section');
    const navLinks = document.querySelectorAll('.nav-link');
    
    let current = '';
    
    sections.forEach(section => {
        const sectionTop = section.offsetTop;
        const sectionHeight = section.clientHeight;
        if (pageYOffset >= sectionTop - 150) {
            current = section.getAttribute('id');
        }
    });

    navLinks.forEach(link => {
        link.classList.remove('active');
        if (link.getAttribute('href').substring(1) === current) {
            link.classList.add('active');
        }
    });
}); 

// 計算權重值
function calculateWeight(dailyPL) {
    const absPL = Math.abs(dailyPL);
    if (absPL <= 100) return 0;
    if (absPL < 500) return 1;
    if (absPL < 1000) return 2;
    if (absPL < 2000) return 3;
    if (absPL < 4000) return 4;
    if (absPL < 6000) return 5;
    if (absPL < 8000) return 6;
    if (absPL < 10000) return 7;
    if (absPL < 15000) return 8;
    if (absPL < 30000) return 9;
    return 10;
}

// 計算實時工資
function calculateRealTimeWage(betAmount, payoutRatio) {
    return betAmount * (payoutRatio / 100);
}

// 計算半月分紅
function calculateBiweeklyBonus(betAmount, validUsers, dailyPL) {
    const salesVolume = betAmount / 10000;
    
    if (salesVolume >= 30 && dailyPL < 0) {
        if (salesVolume >= 1200 && validUsers >= 18) return betAmount * 0.25;
        if (salesVolume >= 800 && validUsers >= 15) return betAmount * 0.24;
        if (salesVolume >= 500 && validUsers >= 12) return betAmount * 0.23;
        if (salesVolume >= 250 && validUsers >= 10) return betAmount * 0.21;
        if (salesVolume >= 120 && validUsers >= 8) return betAmount * 0.20;
        if (salesVolume >= 60 && validUsers >= 5) return betAmount * 0.18;
        if (salesVolume >= 30 && validUsers >= 3) return betAmount * 0.15;
    }
    return 0;
}

// 計算綜合佣金
function calculateCommissionByWeight(weight, betAmount, dailyPL) {
    if (Math.abs(dailyPL) > 0) {
        if (weight >= 100) return betAmount * 1.00;
        if (weight >= 75) return betAmount * 0.80;
        if (weight >= 50) return betAmount * 0.60;
        if (weight >= 30) return betAmount * 0.40;
        if (weight >= 10) return betAmount * 0.20;
    }
    return 0;
}

// 計算績效工資
function calculatePerformancePay(betAmount, dailyPL) {
    if (betAmount >= 10000 && dailyPL < 0) {
        const lossRatio = Math.abs(dailyPL / betAmount);
        const basePay = Math.floor(betAmount / 10000);
        
        if (lossRatio >= 0.05) return basePay * 30;
        if (lossRatio >= 0.04) return basePay * 25;
        if (lossRatio >= 0.03) return basePay * 20;
        if (lossRatio >= 0.02) return basePay * 15;
        if (lossRatio >= 0.01) return basePay * 10;
    }
    return 0;
}

// 計算排名獎勵
function calculateRankingBonus(betAmount, rank) {
    const bonusTable = {
        1: 60000, 2: 55000, 3: 50000, 4: 45000, 5: 40000,
        6: 35000, 7: 30000, 8: 25000, 9: 20000, 10: 15000
    };
    
    if (betAmount >= 60000 && rank <= 10) {
        return bonusTable[rank] || 0;
    }
    return 0;
}

// 主要計算函數
function calculateCommission() {
    try {
        console.log('Calculating commission...'); // 調試日誌

        // 檢查元素是否存在
        const elements = {
            betAmount: document.getElementById('betAmount'),
            dailyPL: document.getElementById('dailyPL'),
            payoutRatio: document.getElementById('payoutRatio'),
            validUsers: document.getElementById('validUsers'),
            weightTotal: document.getElementById('weightTotal'),
            currentRank: document.getElementById('currentRank')
        };

        // 驗證所有必要元素都存在
        for (const [key, element] of Object.entries(elements)) {
            if (!element) {
                throw new Error(`找不到元素: ${key}`);
            }
        }

        // 獲取輸入值
        const values = {
            betAmount: parseFloat(elements.betAmount.value) || 0,
            dailyPL: parseFloat(elements.dailyPL.value) || 0,
            payoutRatio: parseFloat(elements.payoutRatio.value) || 0,
            validUsers: parseInt(elements.validUsers.value) || 0,
            weightTotal: parseInt(elements.weightTotal.value) || 0,
            currentRank: parseInt(elements.currentRank.value) || 0
        };

        console.log('Input values:', values); // 輸出輸入值

        // 計算各項數值
        const results = {
            weight: calculateWeight(values.dailyPL),
            realTimeWage: calculateRealTimeWage(values.betAmount, values.payoutRatio),
            commission: calculateCommissionByWeight(values.weight, values.betAmount, values.dailyPL),
            biweeklyBonus: calculateBiweeklyBonus(values.betAmount, values.validUsers, values.dailyPL),
            performancePay: calculatePerformancePay(values.betAmount, values.dailyPL),
            rankingBonus: calculateRankingBonus(values.betAmount, values.currentRank)
        };

        console.log('Calculation results:', results); // 輸出計算結果

        // 更新顯示結果
        updateResults(results);

    } catch (error) {
        console.error('計算錯誤:', error);
        alert('計算過程中發生錯誤，請檢查輸入值是否正確');
    }
}

function updateResults(results) {
    try {
        const elements = {
            weightResult: document.getElementById('weightResult'),
            biweeklyBonus: document.getElementById('biweeklyBonus'),
            totalCommission: document.getElementById('totalCommission'),
            rankingBonus: document.getElementById('rankingBonus'),
            performancePay: document.getElementById('performancePay'),
            totalAmount: document.getElementById('totalAmount')
        };

        // 檢查所有結果顯示元素是否存在
        for (const [key, element] of Object.entries(elements)) {
            if (!element) {
                throw new Error(`找不到結果顯示元素: ${key}`);
            }
        }

        // 更新顯示
        elements.weightResult.textContent = results.weight;
        elements.biweeklyBonus.textContent = results.biweeklyBonus.toFixed(2);
        elements.totalCommission.textContent = results.commission.toFixed(2);
        elements.rankingBonus.textContent = results.rankingBonus.toFixed(2);
        elements.performancePay.textContent = results.performancePay.toFixed(2);

        const total = Object.values(results).reduce((sum, val) => sum + (typeof val === 'number' ? val : 0), 0);
        elements.totalAmount.textContent = total.toFixed(2);

    } catch (error) {
        console.error('更新結果時發生錯誤:', error);
    }
}

// 其他輔助計算函數... 