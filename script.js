document.addEventListener('DOMContentLoaded', () => {
    const wheel = document.getElementById('wheel');
    const spinButton = document.getElementById('spinButton');
    const resultDisplay = document.getElementById('result');
    const optionInput = document.getElementById('optionInput');
    const updateButton = document.getElementById('updateOptionsButton');

    let currentChoices = [];
    let numSegments = 0;
    let segmentAngle = 0;

    // 定義顏色：白、淺黃交替
    const availableColors = [
        "#FFFFFF", // 白色
        "#FFF7E0"  // 淺黃色
    ];

    /**
     * 從輸入框讀取選項並更新轉盤結構
     */
    function updateWheel() {
        const rawInput = optionInput.value;
        currentChoices = rawInput.split('\n')
                                 .map(item => item.trim())
                                 .filter(item => item.length > 0); 

        numSegments = currentChoices.length;
        
        if (numSegments < 2) {
            resultDisplay.textContent = "請至少輸入兩個選項！";
            spinButton.disabled = true;
            wheel.innerHTML = ''; 
            return;
        }

        segmentAngle = 360 / numSegments;
        
        // 清空現有的轉盤
        wheel.innerHTML = ''; 
        
        // 重新建立轉盤扇區
        currentChoices.forEach((label, index) => {
            const segment = document.createElement('div');
            segment.classList.add('segment');
            
            // 根據索引循環使用顏色，實現白/淺黃交替
            const color = availableColors[index % availableColors.length];
            segment.style.backgroundColor = color;

            // 設置旋轉角度和文字
            const rotateAngle = index * segmentAngle;
            segment.style.transform = `rotate(${rotateAngle}deg) skewY(${90 - segmentAngle}deg)`;
            
            segment.setAttribute('data-label', label);
            const textRotateAngle = rotateAngle + segmentAngle / 2;
            segment.style.setProperty('--angle', `${textRotateAngle}deg`);

            wheel.appendChild(segment);
        });
        
        resultDisplay.textContent = `轉盤已更新，共 ${numSegments} 個選項。`;
        spinButton.disabled = false;
        
        // 確保轉盤在更新後重置到 0 度 (視覺上靜止)
        wheel.style.transform = `rotate(0deg)`;
        wheel.style.transition = 'none';
    }


    /**
     * 處理轉動邏輯
     */
    function spinWheel() {
        if (spinButton.disabled || numSegments < 2) return;
        
        spinButton.disabled = true;
        updateButton.disabled = true; 
        resultDisplay.textContent = "轉盤高速旋轉中...";
        
        const winningIndex = Math.floor(Math.random() * numSegments);
        const winningChoice = currentChoices[winningIndex];

        // 計算目標停止角度
        const baseRevolutions = 6; 
        const targetCenterAngle = winningIndex * segmentAngle + segmentAngle / 2;
        const idealStopAngle = 360 - targetCenterAngle;
        const randomOffset = Math.random() * (segmentAngle * 0.8) - (segmentAngle * 0.4);
        const finalRotation = (baseRevolutions * 360) + idealStopAngle + randomOffset;

        // 應用旋轉動畫
        wheel.style.transition = 'transform 5s cubic-bezier(0.25, 0.1, 0, 1)';
        wheel.style.transform = `rotate(${finalRotation}deg)`;

        // 等待旋轉完成 (5 秒後執行)
        setTimeout(() => {
            spinButton.disabled = false;
            updateButton.disabled = false;
            resultDisplay.textContent = `🎯 結果是：${winningChoice}！`;
            
            // 重置以便下次旋轉
            wheel.style.transition = 'none';
            const visualRotation = finalRotation % 360;
            wheel.style.transform = `rotate(${visualRotation}deg)`;
            
        }, 5000); 
    }
    
    // --- 事件監聽器 ---
    spinButton.addEventListener('click', spinWheel);
    updateButton.addEventListener('click', updateWheel);
    
    // 初始化時先調用一次
    updateWheel();
});
