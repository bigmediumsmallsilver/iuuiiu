// DOM要素の取得
const textInput = document.getElementById('textInput');
const canvas = document.getElementById('mainCanvas');
const ctx = canvas.getContext('2d');
const regenerateColorBtn = document.getElementById('regenerateColorBtn');
const colorPickerLeft = document.getElementById('colorPickerLeft');
const colorPickerRight = document.getElementById('colorPickerRight');
const gradientBtn = document.getElementById('gradientBtn');
const halfBtn = document.getElementById('halfBtn');

let fillStyle = 'gradient'; // 'gradient' または 'half'

// ランダムな色を生成する関数
const getRandomColor = () => {
    const letters = '0123456789ABCDEF';
    let color = '#';
    for (let i = 0; i < 6; i++) {
        color += letters[Math.floor(Math.random() * 16)];
    }
    return color;
};

// 描画処理を行うメインの関数
const draw = () => {
    const dpr = window.devicePixelRatio || 1;
    const rect = canvas.getBoundingClientRect();
    canvas.width = rect.width * dpr;
    canvas.height = rect.height * dpr;
    ctx.scale(dpr, dpr);

    const text = textInput.value;
    const centerX = canvas.width / (2 * dpr);
    const centerY = canvas.height / (2 * dpr);

    ctx.clearRect(0, 0, canvas.width, canvas.height);

    if (!text) return;

    const size = Math.min(centerX, centerY) * 0.9 * 2;
    const startX = centerX - size / 2;
    const startY = centerY - size / 2;
    
    // 背景の描画（グラデーション or 半分）
    if (fillStyle === 'gradient') {
        const gradient = ctx.createLinearGradient(startX, centerY, startX + size, centerY);
        gradient.addColorStop(0, colorPickerLeft.value);
        gradient.addColorStop(1, colorPickerRight.value);
        ctx.fillStyle = gradient;
        ctx.fillRect(startX, startY, size, size);
    } else if (fillStyle === 'half') {
        ctx.fillStyle = colorPickerLeft.value;
        ctx.fillRect(startX, startY, size / 2, size);
        ctx.fillStyle = colorPickerRight.value;
        ctx.fillRect(startX + size / 2, startY, size / 2, size);
    }

    // 文字の描画設定
    ctx.fillStyle = 'white';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';

    let fontSize = Math.min(centerX, centerY) * 0.7; // 開始フォントサイズ
    ctx.font = `${fontSize}px "Hiragino Kaku Gothic ProN", "ヒラギノ角ゴ ProN W3", "メイリオ", Meiryo, "ＭＳ Ｐゴシック", sans-serif`;

    // テキストが枠からはみ出ないようにフォントサイズを調整
    while (ctx.measureText(text).width > size * 0.85 && fontSize > 10) {
        fontSize -= 2;
        ctx.font = `${fontSize}px "Hiragino Kaku Gothic ProN", "ヒラギノ角ゴ ProN W3", "メイリオ", Meiryo, "ＭＳ Ｐゴシック", sans-serif`;
    }
    
    ctx.fillText(text, centerX, centerY);
};

// ランダム色設定＆描画
const setRandomColorsAndDraw = () => {
    colorPickerLeft.value = getRandomColor();
    colorPickerRight.value = getRandomColor();
    draw();
};

// スタイルボタンの見た目を更新する関数
const updateStyleButtons = () => {
    if (fillStyle === 'gradient') {
        gradientBtn.classList.add('active-style-btn');
        gradientBtn.classList.remove('bg-white', 'text-gray-900');
        halfBtn.classList.remove('active-style-btn');
        halfBtn.classList.add('bg-white', 'text-gray-900');
    } else {
        halfBtn.classList.add('active-style-btn');
        halfBtn.classList.remove('bg-white', 'text-gray-900');
        gradientBtn.classList.remove('active-style-btn');
        gradientBtn.classList.add('bg-white', 'text-gray-900');
    }
};

// イベントリスナーの登録
textInput.addEventListener('input', draw);
window.addEventListener('resize', draw);
regenerateColorBtn.addEventListener('click', setRandomColorsAndDraw);
colorPickerLeft.addEventListener('input', draw);
colorPickerRight.addEventListener('input', draw);

gradientBtn.addEventListener('click', () => {
    fillStyle = 'gradient';
    updateStyleButtons();
    draw();
});

halfBtn.addEventListener('click', () => {
    fillStyle = 'half';
    updateStyleButtons();
    draw();
});

// 初期化処理
document.addEventListener('DOMContentLoaded', () => {
    textInput.value = "こんにちは";
    updateStyleButtons();
    setRandomColorsAndDraw();
});
