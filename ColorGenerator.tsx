import { useState, useEffect, useRef } from 'react';

export default function ColorGenerator() {
  // Reactの状態管理（データが変わると自動で画面が更新されます）
  const [text, setText] = useState('こんにちは');
  const [fillStyle, setFillStyle] = useState<'gradient' | 'half'>('gradient');
  const [colorLeft, setColorLeft] = useState('#3B82F6');
  const [colorRight, setColorRight] = useState('#8B5CF6');
  
  // Canvasを操作するための準備
  const canvasRef = useRef<HTMLCanvasElement>(null);

  // ランダムな色を生成する関数
  const getRandomColor = () => {
    const letters = '0123456789ABCDEF';
    let color = '#';
    for (let i = 0; i < 6; i++) {
      color += letters[Math.floor(Math.random() * 16)];
    }
    return color;
  };

  const setRandomColorsAndDraw = () => {
    setColorLeft(getRandomColor());
    setColorRight(getRandomColor());
  };

  // 描画処理
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const draw = () => {
      const dpr = window.devicePixelRatio || 1;
      const rect = canvas.getBoundingClientRect();
      
      // Canvasの解像度を高画質に設定
      canvas.width = rect.width * dpr;
      canvas.height = rect.height * dpr;
      ctx.scale(dpr, dpr);

      const centerX = rect.width / 2;
      const centerY = rect.height / 2;

      // 一度リセット
      ctx.clearRect(0, 0, rect.width, rect.height);
      // 背景色
      ctx.fillStyle = '#f0f4f8';
      ctx.fillRect(0, 0, rect.width, rect.height);

      if (!text) return;

      const size = Math.min(centerX, centerY) * 0.9 * 2;
      const startX = centerX - size / 2;
      const startY = centerY - size / 2;

      // スタイルに合わせて図形を描画
      if (fillStyle === 'gradient') {
        const gradient = ctx.createLinearGradient(startX, centerY, startX + size, centerY);
        gradient.addColorStop(0, colorLeft);
        gradient.addColorStop(1, colorRight);
        ctx.fillStyle = gradient;
        ctx.fillRect(startX, startY, size, size);
      } else if (fillStyle === 'half') {
        ctx.fillStyle = colorLeft;
        ctx.fillRect(startX, startY, size / 2, size);
        ctx.fillStyle = colorRight;
        ctx.fillRect(startX + size / 2, startY, size / 2, size);
      }

      // 文字を描画
      ctx.fillStyle = 'white';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';

      let fontSize = Math.min(centerX, centerY) * 0.7;
      ctx.font = `${fontSize}px "Hiragino Kaku Gothic ProN", "ヒラギノ角ゴ ProN W3", "メイリオ", Meiryo, "ＭＳ Ｐゴシック", sans-serif`;

      // テキストがはみ出さないようにサイズ調整
      while (ctx.measureText(text).width > size * 0.85 && fontSize > 10) {
        fontSize -= 2;
        ctx.font = `${fontSize}px "Hiragino Kaku Gothic ProN", "ヒラギノ角ゴ ProN W3", "メイリオ", Meiryo, "ＭＳ Ｐゴシック", sans-serif`;
      }

      ctx.fillText(text, centerX, centerY);
    };

    draw();

    // 画面サイズが変わった時に再描画する設定
    window.addEventListener('resize', draw);
    return () => window.removeEventListener('resize', draw);
  }, [text, fillStyle, colorLeft, colorRight]); // これらのデータが変わるたびに自動でdraw()が走ります

  // 初回表示時にランダム色をセット
  useEffect(() => {
    setRandomColorsAndDraw();
  }, []);

  return (
    <section className="py-20 bg-gray-100 flex flex-col items-center justify-center">
      {/* 独自のCSSをReact内で適用 */}
      <style>{`
        .custom-color-picker {
          -webkit-appearance: none;
          -moz-appearance: none;
          appearance: none;
          width: 50px;
          height: 50px;
          border: none;
          cursor: pointer;
          background-color: transparent;
          border-radius: 50%;
          overflow: hidden;
        }
        .custom-color-picker::-webkit-color-swatch-wrapper {
          padding: 0;
        }
        .custom-color-picker::-webkit-color-swatch {
          border: 2px solid #e2e8f0;
          border-radius: 50%;
        }
      `}</style>

      <div className="w-full max-w-md text-center px-4">
        <h2 className="text-3xl font-bold text-gray-800 mb-2 font-sans">黒木のランダムカラーシェイプ</h2>
        <p className="text-gray-600 mb-6">好きな文字を入力してください。</p>

        {/* 文字入力フィールド */}
        <input
          type="text"
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder="ここに文字を入力"
          className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg text-lg text-center focus:ring-2 focus:ring-blue-500 focus:outline-none shadow-sm mb-4"
        />

        {/* スタイル選択ボタン */}
        <div className="mb-4">
          <div className="inline-flex rounded-md shadow-sm" role="group">
            <button
              onClick={() => setFillStyle('gradient')}
              className={`px-4 py-2 text-sm font-medium border rounded-l-lg focus:z-10 focus:ring-2 focus:ring-blue-700 transition-colors ${
                fillStyle === 'gradient'
                  ? 'bg-blue-700 text-white border-blue-700'
                  : 'bg-white text-gray-900 border-gray-200 hover:bg-gray-100'
              }`}
            >
              グラデーション
            </button>
            <button
              onClick={() => setFillStyle('half')}
              className={`px-4 py-2 text-sm font-medium border rounded-r-lg focus:z-10 focus:ring-2 focus:ring-blue-700 transition-colors ${
                fillStyle === 'half'
                  ? 'bg-blue-700 text-white border-blue-700'
                  : 'bg-white text-gray-900 border-gray-200 hover:bg-gray-100'
              }`}
            >
              半分
            </button>
          </div>
        </div>

        {/* 色選択コントロールエリア */}
        <div className="flex items-center justify-center gap-4">
          <input
            type="color"
            value={colorLeft}
            onChange={(e) => setColorLeft(e.target.value)}
            className="custom-color-picker shadow-sm"
          />
          <button
            onClick={setRandomColorsAndDraw}
            className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded-lg shadow-sm transition-colors"
          >
            ランダムに色を変更
          </button>
          <input
            type="color"
            value={colorRight}
            onChange={(e) => setColorRight(e.target.value)}
            className="custom-color-picker shadow-sm"
          />
        </div>
      </div>

      {/* 描画エリア */}
      <div className="w-full max-w-md aspect-square mt-6 px-4">
        <canvas
          ref={canvasRef}
          className="w-full h-full rounded-xl shadow-lg"
        ></canvas>
      </div>
    </section>
  );
}
