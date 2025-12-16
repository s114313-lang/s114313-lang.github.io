document.addEventListener('DOMContentLoaded', () => {
    const wheel = document.getElementById('wheel');
    const spinButton = document.getElementById('spinButton');
    const resultDisplay = document.getElementById('result');
    const optionInput = document.getElementById('optionInput');
    const updateButton = document.getElementById('updateOptionsButton');

    let currentChoices = [];
    let numSegments = 0;
    let segmentAngle = 0;

    // **【重要修改】定義新的顏色列表：白、淺黃交替**
    const availableColors = [
        "#FFFFFF", // 白色
        "#FFF7E0"  // 淺黃色 (可選：#FFECB3 或 #FFE0B2 獲得更深的淺黃色)
    ];

    /**
     * 從輸入框讀取選項並更新轉盤結構
     */
    function updateWheel() {
        // 1. 讀取輸入並分割成陣列，移除空行和首尾空格
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
        
        // 2. 清空現有的轉盤
        wheel.innerHTML = ''; 
        
        // 3. 重新建立轉盤扇區
        currentChoices.forEach((label, index) => {
            const segment = document.createElement('div');
            segment.classList.add('segment');
            
            // 根據索引循環使用顏色，實現白/淺黃交替
            const color = availableColors[index % availableColors.length];
            segment.style.backgroundColor = color;

            // 設置旋轉角度
            const rotateAngle = index * segmentAngle;
            segment.style.transform = `rotate(${rotateAngle}deg) skewY(${90 - segmentAngle}deg)`;
            
            // 設置文字內容
            segment.setAttribute('data-label', label);
            
            // 設置 CSS 變量，確保文字正確居中
            const textRotateAngle = rotateAngle + segmentAngle / 2;
            segment.style.setProperty('--angle', `${textRotateAngle}deg`);

            wheel.appendChild(segment);
        });
        
        resultDisplay.textContent = `轉盤已更新，共 ${numSegments} 個選項。`;
        spinButton.disabled = false;
    }


    /**
     * 處理轉動邏輯 (此部分保持不變)
     */
    function spinWheel() {
        if (spinButton.disabled || numSegments < 2) return;
        
        spinButton.disabled = true;
        updateButton.disabled = true; 
        resultDisplay.textContent = "轉盤高速旋轉中...";
        
        const winningIndex = Math.floor(Math.random() * numSegments);
        const winningChoice = currentChoices[winningIndex];

        const baseRevolutions = 6; 
        const targetCenterAngle = winningIndex * segmentAngle + segmentAngle / 2;
        const idealStopAngle = 360 - targetCenterAngle;
        const randomOffset = Math.random() * (segmentAngle * 0.8) - (segmentAngle * 0.4);
        const finalRotation = (baseRevolutions * 360) + idealStopAngle + randomOffset;

        wheel.style.transition = 'transform 5s cubic-bezier(0.25, 0.1, 0, 1)';
        wheel.style.transform = `rotate(${finalRotation}deg)`;

        setTimeout(() => {
            spinButton.disabled = false;
            updateButton.disabled = false;
            resultDisplay.textContent = `🎯 結果是：${winningChoice}！`;
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
