const wheel = document.getElementById('wheel');
const optionInput = document.getElementById('optionInput');
const labelsContainer = document.getElementById('labelsContainer');
const resultText = document.getElementById('resultText');
const spinBtn = document.getElementById('spinBtn');

let currentRotation = 0;
let options = [];

/**
 * 更新轉盤外觀與文字
 */
function updateWheel() {
    const text = optionInput.value.trim();
    options = text.split('\n').filter(opt => opt.trim() !== '');

    if (options.length < 2) {
        alert("請輸入至少兩個選項！");
        return;
    }

    const n = options.length;
    const step = 100 / n;
    const angleStep = 360 / n;

    // 1. 生成背景 conic-gradient (採用鵝黃色與白色交替)
    let gradientString = "";
    for (let i = 0; i < n; i++) {
        const color = (i % 2 === 0) ? 'var(--pale-yellow)' : 'var(--white)';
        const start = i * step;
        const end = (i + 1) * step;
        gradientString += `${color} ${start}% ${end}%${i === n - 1 ? '' : ','}`;
    }
    wheel.style.background = `conic-gradient(${gradientString})`;

    // 2. 生成文字標籤
    labelsContainer.innerHTML = '';
    options.forEach((opt, i) => {
        const labelDiv = document.createElement('div');
        labelDiv.className = 'wheel-label';
        // 旋轉文字到扇形中央：旋轉角度為 (i * angleStep) + (半個扇區)
        // 注意：CSS 座標系中 0度在右側，而我們要配合指針在上方，所以減去 90 度
        const rotation = (i * angleStep) + (angleStep / 2) - 90;
        labelDiv.style.transform = `translate(-0%, -50%) rotate(${rotation}deg)`;
        labelDiv.innerText = opt;
        labelsContainer.appendChild(labelDiv);
    });

    resultText.innerText = "轉盤已更新！";
    // 更新時重置旋轉，避免位置跑掉
    currentRotation = 0;
    wheel.style.transform = `rotate(0deg)`;
}

/**
 * 旋轉邏輯與結果判定
 */
function spinWheel() {
    if (options.length < 2) return;

    spinBtn.disabled = true;
    resultText.innerText = "旋轉中...";

    // 隨機增加 5 到 10 圈的旋轉角度 (1800~3600度)
    const randomExtra = Math.floor(Math.random() * 360);
    const totalSpin = 1800 + randomExtra; 
    currentRotation += totalSpin;

    // 執行旋轉動畫
    wheel.style.transform = `rotate(${currentRotation}deg)`;

    // 動畫時間為 4 秒 (與 CSS transition 一致)
    setTimeout(() => {
        spinBtn.disabled = false;

        // 計算中獎結果
        // 由於我們是旋轉圓盤，指針在上方(固定 270度位置)
        // 最終停下的角度相對於初始狀態的偏移為：
        const finalAngle = currentRotation % 360;
        
        // 計算指針指向哪個扇區：
        // 邏輯：(360 - (finalAngle % 360)) 得到相對於指針的偏移
        const actualPointerAngle = (360 - finalAngle) % 360;
        const sectorAngle = 360 / options.length;
        const winningIndex = Math.floor(actualPointerAngle / sectorAngle);

        resultText.innerText = `🎉 結果是：${options[winningIndex]}！`;
    }, 4000);
}

// 初始載入
updateWheel();
