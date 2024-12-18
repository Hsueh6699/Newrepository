// 主要計算函數
function calculateCommission() {
    try {
        // 獲取輸入值
        const betAmount = parseFloat(document.getElementById('betAmount').value) || 0;
        const dailyPL = parseFloat(document.getElementById('dailyPL').value) || 0;
        const payoutRatio = parseFloat(document.getElementById('payoutRatio').value) || 0;
        const validUsers = parseInt(document.getElementById('validUsers').value) || 0;
        const weightTotal = parseInt(document.getElementById('weightTotal').value) || 0;
        const currentRank = parseInt(document.getElementById('currentRank').value) || 0;

        // 計算權重值
        const weight = calculateWeight(dailyPL);
        
        // 計算實時工資
        const realTimeWage = betAmount * (payoutRatio / 100);
        
        // 計算綜合佣金
        const commission = calculateCommissionByWeight(weight, betAmount, dailyPL);
        
        // 計算半月分紅
        const biweeklyBonus = calculateBiweeklyBonus(betAmount, validUsers, dailyPL);
        
        // 計算績效工資
        const performancePay = calculatePerformancePay(betAmount, dailyPL);
        
        // 計算排名獎勵
        const rankingBonus = calculateRankingBonus(betAmount, currentRank);

        // 計算總額
        const total = realTimeWage + commission + biweeklyBonus + performancePay + rankingBonus;

        // 更新顯示結果
        document.getElementById('weightResult').textContent = weight;
        document.getElementById('biweeklyBonus').textContent = biweeklyBonus.toFixed(2);
        document.getElementById('totalCommission').textContent = commission.toFixed(2);
        document.getElementById('rankingBonus').textContent = rankingBonus.toFixed(2);
        document.getElementById('performancePay').textContent = performancePay.toFixed(2);
        document.getElementById('totalAmount').textContent = total.toFixed(2);

        console.log({
            input: { betAmount, dailyPL, payoutRatio, validUsers, weightTotal, currentRank },
            results: { weight, realTimeWage, commission, biweeklyBonus, performancePay, rankingBonus, total }
        });

    } catch (error) {
        console.error('計算錯誤:', error);
        alert('計算過程中發生錯誤，請檢查輸入值是否正確');
    }
}

// 移除之前的 DOMContentLoaded 事件監聽器和初始化函數
// 直接使用 onclick 事件處理器 
