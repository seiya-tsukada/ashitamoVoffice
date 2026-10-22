import React from 'react';
import {
  Sparkles,
  BookOpen,
  Coffee,
  Tv,
  Crown,
  Coins,
} from 'lucide-react';

export const RpgOfficeMap: React.FC = () => {
  return (
    <div 
      className="absolute inset-0 w-full h-full pointer-events-none select-none overflow-hidden rounded-3xl"
      style={{
        backgroundColor: '#2b231c',
        backgroundImage: `
          linear-gradient(45deg, #261f18 25%, transparent 25%), 
          linear-gradient(-45deg, #261f18 25%, transparent 25%), 
          linear-gradient(45deg, transparent 75%, #261f18 75%), 
          linear-gradient(-45deg, transparent 75%, #261f18 75%)
        `,
        backgroundSize: '32px 32px',
        backgroundPosition: '0 0, 0 16px, 16px -16px, -16px 0px',
        imageRendering: 'pixelated',
      }}
    >
      {/* 上部外壁・石造りのダンジョン/城郭ブロック */}
      <div className="absolute top-0 left-0 right-0 h-10 bg-[#3b3127] border-b-4 border-[#1c1611] flex items-center justify-around px-4 shadow-lg">
        {[...Array(18)].map((_, i) => (
          <div key={i} className="w-8 h-7 bg-[#4d4034] border-2 border-[#2b231c] rounded-xs shadow-inner flex items-center justify-center">
            {i % 4 === 1 && <span className="text-[10px]">🛡️</span>}
            {i % 4 === 3 && <span className="text-[10px]">⚔️</span>}
          </div>
        ))}
      </div>

      {/* かがり火・松明 */}
      <div className="absolute top-2 left-6 flex items-center gap-1 bg-[#1a140e] px-2 py-0.5 rounded border border-amber-600 shadow-md">
        <span className="text-xs animate-bounce">🔥</span>
        <span className="text-[9px] font-mono text-amber-300 font-bold">TORCH</span>
      </div>
      <div className="absolute top-2 right-6 flex items-center gap-1 bg-[#1a140e] px-2 py-0.5 rounded border border-amber-600 shadow-md">
        <span className="text-xs animate-bounce">🔥</span>
        <span className="text-[9px] font-mono text-amber-300 font-bold">TORCH</span>
      </div>

      {/* ゾーン 1: カフェスペース & リフレッシュラウンジ (左上) */}
      <div 
        className="absolute left-6 top-14 w-[250px] h-[190px] rounded-2xl bg-[#5c4033] border-4 border-[#3d2b22] shadow-2xl p-2.5 flex flex-col justify-between"
      >
        <div className="flex items-center justify-between border-b-2 border-[#3d2b22] pb-1">
          <span className="text-[11px] font-black text-amber-200 flex items-center gap-1.5 drop-shadow-sm">
            <Coffee className="w-3.5 h-3.5 text-amber-400" />
            ☕ カフェ ＆ リフレッシュラウンジ
          </span>
          <span className="text-[8px] bg-amber-950 text-amber-300 border border-amber-600 px-1.5 py-0.5 rounded font-mono font-bold">
            CAFE & REST
          </span>
        </div>

        {/* カフェカウンター */}
        <div className="relative w-full h-16 bg-[#8B5A2B] border-3 border-[#5C3A1E] rounded-xl shadow-inner flex items-center justify-around px-2">
          <div className="flex items-center gap-1 bg-[#3a2212] text-amber-200 px-2 py-1 rounded text-[9px] font-bold border border-amber-700">
            <span>☕</span>
            <span>カフェドリンク / 軽食</span>
          </div>

          <div className="flex items-center gap-1 text-sm">
            <span>☕</span>
            <span>🧃</span>
            <span>🥐</span>
          </div>

          {/* スツール */}
          <div className="absolute -bottom-3 left-4 w-6 h-6 rounded-full bg-[#D2B48C] border-2 border-[#5C3A1E] shadow-md flex items-center justify-center text-[8px] font-bold text-stone-900">
            🪑
          </div>
          <div className="absolute -bottom-3 left-24 w-6 h-6 rounded-full bg-[#D2B48C] border-2 border-[#5C3A1E] shadow-md flex items-center justify-center text-[8px] font-bold text-stone-900">
            🪑
          </div>
          <div className="absolute -bottom-3 right-4 w-6 h-6 rounded-full bg-[#D2B48C] border-2 border-[#5C3A1E] shadow-md flex items-center justify-center text-[8px] font-bold text-stone-900">
            🪑
          </div>
        </div>

        <div className="flex items-center justify-between px-1 text-[9px] text-amber-200/90 font-medium">
          <div className="flex items-center gap-1">
            <Coins className="w-3 h-3 text-amber-400" />
            <span>雑談・休憩・カジュアルトーク</span>
          </div>
        </div>
      </div>

      {/* ゾーン 2: メイン執務ラウンジ ＆ コラボレーションエリア (中央) */}
      <div 
        className="absolute left-[285px] top-14 w-[380px] h-[265px] rounded-3xl bg-[#6A1A24] border-4 border-[#450A11] shadow-2xl p-3 flex flex-col justify-between"
      >
        <div className="flex items-center justify-between border-b-2 border-[#450A11] pb-1">
          <span className="text-xs font-black text-amber-200 flex items-center gap-1.5 drop-shadow-md">
            <Crown className="w-4 h-4 text-amber-400" />
            💼 メイン執務 ＆ コラボレーション
          </span>
          <span className="text-[9px] bg-red-950 text-amber-300 border border-amber-600 px-2 py-0.5 rounded-full font-mono font-bold">
            LIVE COLLAB
          </span>
        </div>

        {/* センターステージ：深紅の魔法陣カーペット＆円卓＆ソファー */}
        <div className="relative w-full h-[180px] rounded-2xl bg-[#851C2B] border-2 border-[#A72B3E] shadow-inner flex items-center justify-center overflow-hidden">
          <div 
            className="w-[290px] h-[145px] rounded-2xl bg-[#9E2A3B] border-3 border-amber-400 shadow-md flex items-center justify-center relative"
            style={{
              backgroundImage: 'radial-gradient(#F59E0B 1.5px, transparent 1.5px)',
              backgroundSize: '16px 16px',
            }}
          >
            <div className="w-28 h-14 rounded-2xl bg-[#5C3A1E] border-3 border-amber-500 shadow-xl flex flex-col items-center justify-center">
              <span className="text-[10px] font-black text-amber-200">ミーティング円卓</span>
              <div className="flex items-center gap-1 text-xs mt-0.5">
                <span>💻</span>
                <span>📋</span>
                <span>☕</span>
              </div>
            </div>
          </div>

          {/* 北側ロングソファー */}
          <div className="absolute top-1.5 left-1/2 -translate-x-1/2 w-48 h-6 rounded-xl bg-[#2D1518] border-2 border-amber-600 shadow-md flex items-center justify-center text-amber-200 text-[8px] font-black">
            🛋️ Lounge Sofa (North)
          </div>

          {/* 南側ロングソファー */}
          <div className="absolute bottom-1.5 left-1/2 -translate-x-1/2 w-48 h-6 rounded-xl bg-[#2D1518] border-2 border-amber-600 shadow-md flex items-center justify-center text-amber-200 text-[8px] font-black">
            🛋️ Lounge Sofa (South)
          </div>

          {/* 東西アームチェア */}
          <div className="absolute left-2 top-1/2 -translate-y-1/2 w-6 h-18 rounded-lg bg-[#3F1D22] border border-amber-600 shadow-md flex items-center justify-center text-amber-200 text-[8px] font-bold">
            🪑
          </div>
          <div className="absolute right-2 top-1/2 -translate-y-1/2 w-6 h-18 rounded-lg bg-[#3F1D22] border border-amber-600 shadow-md flex items-center justify-center text-amber-200 text-[8px] font-bold">
            🪑
          </div>
        </div>

        <div className="text-[10px] text-amber-200/90 flex items-center justify-between px-1 font-medium">
          <span>アバターを近づけると空間音声で即座にミーティング開始</span>
        </div>
      </div>

      {/* ゾーン 3: 集中作業ブース ＆ サイレントスペース (右上) */}
      <div 
        className="absolute right-6 top-14 w-[245px] h-[200px] rounded-2xl bg-[#1E1B4B] border-4 border-[#0F0E2A] shadow-2xl p-2.5 flex flex-col justify-between"
      >
        <div className="flex items-center justify-between border-b-2 border-[#0F0E2A] pb-1">
          <span className="text-[11px] font-black text-purple-200 flex items-center gap-1.5 drop-shadow-sm">
            <BookOpen className="w-3.5 h-3.5 text-purple-400" />
            🎧 集中ブース ＆ サイレント
          </span>
          <span className="text-[8px] bg-purple-950 text-purple-300 border border-purple-600 px-1.5 py-0.5 rounded font-mono font-bold">
            SILENT
          </span>
        </div>

        {/* 3つの集中デスク */}
        <div className="grid grid-cols-3 gap-1.5 my-1">
          {[1, 2, 3].map((num) => (
            <div
              key={num}
              className="h-24 rounded-xl bg-[#2E286E] border-2 border-purple-400 shadow-sm p-1 flex flex-col justify-between items-center"
            >
              <div className="text-[8px] font-bold text-purple-200">Pod 0{num}</div>
              <div className="w-full h-8 bg-[#1B1745] rounded border border-purple-500 flex flex-col items-center justify-center text-[7px] text-purple-200">
                <span>💻 Monitor</span>
                <span>🎧 Mute</span>
              </div>
              <div className="w-5 h-5 rounded-full bg-purple-600 border border-purple-300 text-white text-[7px] flex items-center justify-center font-bold shadow-xs">
                🪑
              </div>
            </div>
          ))}
        </div>

        <div className="text-[8.5px] text-purple-300 font-bold text-center bg-purple-950/80 py-0.5 rounded border border-purple-800 flex items-center justify-between px-2">
          <span>🤫 深い集中・コーディング・作業空間</span>
        </div>
      </div>

      {/* ゾーン 4: プロジェクトルーム ＆ クリエイティブラボ (左下) */}
      <div 
        className="absolute left-6 bottom-3 w-[290px] h-[190px] rounded-2xl bg-[#312E81] border-4 border-[#1E1B4B] shadow-2xl p-2.5 flex flex-col justify-between"
      >
        <div className="flex items-center justify-between border-b-2 border-[#1E1B4B] pb-1">
          <span className="text-[11px] font-black text-cyan-200 flex items-center gap-1.5">
            <Sparkles className="w-3.5 h-3.5 text-cyan-400" />
            💡 プロジェクト ＆ デザインラボ
          </span>
          <span className="text-[8px] bg-indigo-950 text-cyan-300 border border-cyan-500 px-1.5 py-0.5 rounded font-mono font-bold">
            DESIGN LAB
          </span>
        </div>

        <div className="relative w-full h-[115px] rounded-xl bg-[#1E1B4B] border-2 border-indigo-500 p-2 shadow-inner flex flex-col justify-between">
          <div className="flex items-center justify-between text-[8.5px] text-cyan-300 font-bold border-b border-indigo-700 pb-0.5">
            <span>プロトタイプ・UIデザイン</span>
            <div className="flex gap-1">
              <span className="w-2 h-2 rounded-full bg-cyan-400 animate-ping" />
              <span className="w-2 h-2 rounded-full bg-pink-400" />
              <span className="w-2 h-2 rounded-full bg-amber-400" />
            </div>
          </div>

          <div className="flex items-center justify-center gap-2">
            <div className="bg-[#0F172A] border border-cyan-400 text-cyan-200 text-[8px] px-2 py-1 rounded font-mono shadow-xs">
              ⚡ Figma / UI Lab
            </div>
            <div className="bg-[#0F172A] border border-pink-400 text-pink-200 text-[8px] px-2 py-1 rounded font-mono shadow-xs">
              🎨 Design System
            </div>
          </div>

          <div className="flex justify-around">
            <div className="w-5 h-5 rounded-full bg-cyan-600 border border-cyan-300 text-white text-[7px] flex items-center justify-center shadow-xs">🪑</div>
            <div className="w-5 h-5 rounded-full bg-cyan-600 border border-cyan-300 text-white text-[7px] flex items-center justify-center shadow-xs">🪑</div>
          </div>
        </div>

        <div className="text-[8.5px] text-cyan-300 font-medium flex items-center justify-between">
          <span>企画・要件定義・UI/UXデザイン検討</span>
        </div>
      </div>

      {/* ゾーン 5: メインカンファレンスルーム (大会議室) (右下) */}
      <div 
        className="absolute right-6 bottom-3 w-[330px] h-[190px] rounded-2xl bg-[#064E3B] border-4 border-[#022C22] shadow-2xl p-2.5 flex flex-col justify-between"
      >
        <div className="flex items-center justify-between border-b-2 border-[#022C22] pb-1">
          <span className="text-[11px] font-black text-emerald-200 flex items-center gap-1.5">
            <Tv className="w-3.5 h-3.5 text-emerald-400" />
            🏛️ メインカンファレンス (大会議室)
          </span>
          <span className="text-[8px] bg-emerald-950 text-emerald-300 border border-emerald-500 px-1.5 py-0.5 rounded font-mono font-bold">
            CONFERENCE
          </span>
        </div>

        <div className="relative w-full h-[115px] rounded-xl bg-[#022C22] border-2 border-emerald-500 shadow-inner p-1.5 flex flex-col items-center justify-between">
          <div className="w-4/5 h-5 bg-[#064E3B] border border-emerald-400 text-emerald-100 rounded flex items-center justify-center text-[8.5px] font-mono tracking-wider shadow-sm">
            ✨ PRESENTATION SCREEN · 画面共有 READY
          </div>

          <div className="relative w-40 h-10 rounded-full bg-[#1B4332] border-2 border-emerald-400 shadow-md flex items-center justify-center text-[8.5px] font-bold text-emerald-200">
            ミーティング大円卓
            <div className="absolute -top-2.5 left-4 w-4.5 h-4.5 rounded-full bg-emerald-600 text-white text-[7px] flex items-center justify-center shadow-xs">🪑</div>
            <div className="absolute -top-2.5 right-4 w-4.5 h-4.5 rounded-full bg-emerald-600 text-white text-[7px] flex items-center justify-center shadow-xs">🪑</div>
            <div className="absolute -bottom-2.5 left-4 w-4.5 h-4.5 rounded-full bg-emerald-600 text-white text-[7px] flex items-center justify-center shadow-xs">🪑</div>
            <div className="absolute -bottom-2.5 right-4 w-4.5 h-4.5 rounded-full bg-emerald-600 text-white text-[7px] flex items-center justify-center shadow-xs">🪑</div>
          </div>
        </div>

        <div className="text-[8.5px] text-emerald-300 font-semibold flex items-center justify-between">
          <span>全社定例・クライアント商談・プレゼンテーション</span>
        </div>
      </div>

      {/* 装飾：宝箱、クリスタル、薬草の鉢植え */}
      <div className="absolute left-[262px] top-[245px] w-8 h-8 rounded-lg bg-[#5C3A1E] border-2 border-amber-500 shadow-lg flex items-center justify-center text-xs" title="金の宝箱">
        🎁
      </div>
      <div className="absolute right-[280px] top-[245px] w-8 h-8 rounded-lg bg-[#1E1B4B] border-2 border-purple-400 shadow-lg flex items-center justify-center text-xs animate-pulse" title="魔導クリスタル">
        💎
      </div>
      <div className="absolute left-[305px] bottom-[20px] w-7 h-7 rounded-full bg-emerald-900 border border-emerald-400 shadow-md flex items-center justify-center text-xs" title="回復薬草の鉢植え">
        🌿
      </div>
      <div className="absolute right-[350px] bottom-[20px] w-7 h-7 rounded-full bg-emerald-900 border border-emerald-400 shadow-md flex items-center justify-center text-xs" title="世界樹の苗木">
        🪴
      </div>
    </div>
  );
};
