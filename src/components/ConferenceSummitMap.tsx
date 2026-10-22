import React from 'react';
import {
  Building2,
  Radio,
  Presentation,
  Calendar,
  Car,
} from 'lucide-react';

export const ConferenceSummitMap: React.FC = () => {
  return (
    <div 
      className="absolute inset-0 w-full h-full pointer-events-none select-none overflow-hidden rounded-3xl"
      style={{
        backgroundColor: '#4d7c0f', // 芝生グリーン
        backgroundImage: `
          radial-gradient(#65a30d 15%, transparent 16%),
          radial-gradient(#3f6212 15%, transparent 16%)
        `,
        backgroundSize: '24px 24px',
        backgroundPosition: '0 0, 12px 12px',
      }}
    >
      {/* =========================================================================
          左上エリア：駐車場 ＆ TIMETABLE大看板
      ========================================================================= */}
      {/* 1. 駐車場 (PARKING AREA) */}
      <div 
        className="absolute left-5 top-5 w-[200px] h-[95px] rounded-2xl bg-[#334155] border-3 border-[#1e293b] shadow-xl p-2 flex flex-col justify-between"
      >
        <div className="flex items-center justify-between border-b border-slate-600 pb-0.5">
          <span className="text-[10px] font-black text-amber-300 flex items-center gap-1 font-mono">
            <Car className="w-3 h-3 text-amber-400" />
            PARKING AREA
          </span>
          <span className="text-[8px] bg-slate-800 text-slate-300 px-1.5 py-0.2 rounded font-mono">
            Entrance
          </span>
        </div>

        {/* 駐車スロット & ミニカー */}
        <div className="grid grid-cols-4 gap-1 items-center justify-center my-0.5">
          <div className="h-10 rounded border border-dashed border-amber-300/60 bg-slate-700/60 flex flex-col items-center justify-center text-xs">
            🚗
          </div>
          <div className="h-10 rounded border border-dashed border-amber-300/60 bg-slate-700/60 flex flex-col items-center justify-center text-xs">
            🚙
          </div>
          <div className="h-10 rounded border border-dashed border-amber-300/60 bg-slate-700/60 flex flex-col items-center justify-center text-xs">
            🚕
          </div>
          <div className="h-10 rounded border border-dashed border-amber-300/60 bg-slate-800/80 flex flex-col items-center justify-center text-[8px] text-amber-200 font-mono">
            空き
          </div>
        </div>

        <div className="text-[8px] text-slate-300 font-bold flex items-center justify-between">
          <span>受付・到着スポット</span>
        </div>
      </div>

      {/* 2. TIMETABLE 大看板 (TIME TABLE) */}
      <div 
        className="absolute left-5 top-[110px] w-[200px] h-[190px] rounded-2xl bg-[#0f172a] border-3 border-amber-500 shadow-2xl p-2.5 flex flex-col justify-between"
      >
        <div className="flex items-center justify-between border-b border-amber-600/70 pb-1">
          <span className="text-[11px] font-black text-amber-300 flex items-center gap-1">
            <Calendar className="w-3.5 h-3.5 text-amber-400" />
            TIMETABLE 2026
          </span>
          <span className="text-[8px] bg-red-600 text-white font-bold px-1.5 py-0.2 rounded animate-pulse">
            LIVE NOW
          </span>
        </div>

        {/* スケジュール一覧 */}
        <div className="space-y-1 my-1">
          <div className="bg-[#1e293b] p-1 rounded border border-slate-700 text-[8px]">
            <div className="flex justify-between text-amber-400 font-mono font-bold">
              <span>10:00 - 11:30</span>
              <span className="text-emerald-400">進行中</span>
            </div>
            <p className="text-white font-black truncate">Keynote: 次世代オフィスの未来</p>
          </div>
          <div className="bg-[#1e293b] p-1 rounded border border-slate-700 text-[8px]">
            <div className="flex justify-between text-amber-400 font-mono font-bold">
              <span>13:00 - 14:30</span>
              <span className="text-slate-400">予定</span>
            </div>
            <p className="text-slate-200 truncate">Tech Session: 分散同期アーキテクチャ</p>
          </div>
          <div className="bg-[#1e293b] p-1 rounded border border-slate-700 text-[8px]">
            <div className="flex justify-between text-amber-400 font-mono font-bold">
              <span>15:00 - 16:30</span>
              <span className="text-slate-400">予定</span>
            </div>
            <p className="text-slate-200 truncate">Sponsor Pitch & Networking</p>
          </div>
        </div>

        <div className="text-[8px] text-amber-300/90 font-mono text-center bg-amber-950/60 py-0.5 rounded border border-amber-800">
          📍 会場インフォメーションデスク
        </div>
      </div>

      {/* =========================================================================
          中央エリア：メインステージ (YELLOWS 2023 サミット) ＆ 観客席グリッド
      ========================================================================= */}
      {/* 砂地グラウンドベース */}
      <div 
        className="absolute left-[225px] top-5 w-[460px] h-[585px] rounded-3xl bg-[#d4a373] border-4 border-[#b07d50] shadow-2xl p-3 flex flex-col items-center justify-between"
        style={{
          backgroundImage: 'radial-gradient(#b07d50 1px, transparent 1px)',
          backgroundSize: '12px 12px',
        }}
      >
        {/* メインステージ（YELLOWS SUMMIT STAGE） */}
        <div 
          className="w-full h-[140px] rounded-2xl bg-[#1e1b4b] border-3 border-amber-400 shadow-2xl p-2.5 flex flex-col justify-between relative overflow-hidden"
        >
          {/* ステージバックドロップ・バナー */}
          <div className="flex items-center justify-between border-b border-indigo-700 pb-1">
            <span className="text-xs font-black text-amber-300 flex items-center gap-1.5">
              <Presentation className="w-4 h-4 text-amber-400" />
              ⚡️ YELLOWS SUMMIT 2026 MAIN STAGE
            </span>
            <span className="text-[9px] bg-red-600 text-white font-mono font-black px-2 py-0.5 rounded-full flex items-center gap-1 shadow-md">
              <Radio className="w-2.5 h-2.5 animate-ping" />
              ON AIR · 4K LIVE
            </span>
          </div>

          {/* 演台・大型スクリーン・登壇スピーカー */}
          <div className="flex items-center justify-between px-3">
            <div className="bg-[#0f172a] border border-amber-400/80 rounded-xl p-1.5 w-44 text-center shadow-lg">
              <div className="text-[8px] font-mono text-amber-400">Now Presenting</div>
              <div className="text-[10px] font-black text-white truncate">「空間UXが生み出す偶発的イノベーション」</div>
            </div>

            <div className="flex items-center gap-2 bg-[#312e81] px-3 py-1.5 rounded-xl border border-indigo-400 shadow-md">
              <span className="text-base">🎙️</span>
              <div className="text-left">
                <div className="text-[8px] text-indigo-200">Keynote Speaker</div>
                <div className="text-[10px] font-black text-amber-300">代表取締役 & Tech Lead</div>
              </div>
            </div>
          </div>

          <div className="flex items-center justify-between text-[9px] text-indigo-200 font-mono border-t border-indigo-800 pt-0.5">
            <span>🔴 空間配信中（オーディオ全館ブロードキャスト）</span>
          </div>
        </div>

        {/* 観客席グリッド (大量のパイプ椅子グリッド 8列 x 12席) */}
        <div 
          className="w-full flex-1 mt-2.5 rounded-2xl bg-[#c59263] border-2 border-[#9d6d42] p-2 flex flex-col justify-between"
        >
          <div className="flex items-center justify-between text-[9px] font-bold text-amber-950 border-b border-[#a8754b] pb-0.5">
            <span>🪑 AUDIENCE SEATING (自由席エリア)</span>
            <span className="text-[8px] bg-amber-900 text-amber-100 px-2 py-0.2 rounded font-mono">120 Seats</span>
          </div>

          {/* 椅子グリッド描画 */}
          <div className="grid grid-cols-10 gap-1.5 my-auto px-1">
            {[...Array(50)].map((_, i) => (
              <div 
                key={i} 
                className="h-6 rounded bg-[#475569] border border-[#1e293b] shadow-xs flex items-center justify-center text-[9px] text-white"
                title={`Seat #${i + 1}`}
              >
                🪑
              </div>
            ))}
          </div>

          <div className="text-[8.5px] text-amber-950 text-center font-bold">
            着席するとステージのプレゼンテーション音声をクリアに視聴できます
          </div>
        </div>
      </div>

      {/* =========================================================================
          右側エリア：企業展示ブース (EXHIBITION BOOTHS)
      ========================================================================= */}
      <div className="absolute right-5 top-5 w-[255px] h-[585px] rounded-3xl bg-[#1e293b] border-4 border-[#0f172a] shadow-2xl p-3 flex flex-col justify-between">
        <div className="flex items-center justify-between border-b-2 border-slate-700 pb-1">
          <span className="text-xs font-black text-amber-300 flex items-center gap-1.5">
            <Building2 className="w-4 h-4 text-amber-400" />
            EXHIBITION BOOTHS (展示ブース)
          </span>
          <span className="text-[8px] bg-amber-950 text-amber-300 border border-amber-600 px-1.5 py-0.5 rounded font-mono font-bold">
            4 BOOTHS
          </span>
        </div>

        {/* 4つの協賛・展示ブース（RICOH、シマンテック等のイメージ） */}
        <div className="space-y-2.5 my-1">
          {/* ブース 1 */}
          <div 
            className="rounded-xl bg-[#0f172a] border-2 border-cyan-500 p-2 shadow-md"
          >
            <div className="flex items-center justify-between text-[9.5px] font-black text-cyan-300">
              <span>🏢 RICOH · Smart Workplaces</span>
              <span className="text-[8px] bg-cyan-950 text-cyan-200 px-1 rounded">Booth 01</span>
            </div>
            <p className="text-[8.5px] text-slate-300 mt-1">
              インタラクティブホワイトボード＆最新オフィスソリューション展示
            </p>
            <div className="mt-1 flex items-center justify-between text-[8px] text-cyan-400 font-bold">
              <span>担当者 2名常駐中</span>
            </div>
          </div>

          {/* ブース 2 */}
          <div 
            className="rounded-xl bg-[#0f172a] border-2 border-yellow-500 p-2 shadow-md"
          >
            <div className="flex items-center justify-between text-[9.5px] font-black text-yellow-300">
              <span>🛡️ Symantec · Zero Trust Cloud</span>
              <span className="text-[8px] bg-yellow-950 text-yellow-200 px-1 rounded">Booth 02</span>
            </div>
            <p className="text-[8.5px] text-slate-300 mt-1">
              エンタープライズ向けゼロトラスト・リモートアクセスセキュリティ
            </p>
            <div className="mt-1 flex items-center justify-between text-[8px] text-yellow-400 font-bold">
              <span>ホワイトペーパー配布中</span>
            </div>
          </div>

          {/* ブース 3 */}
          <div 
            className="rounded-xl bg-[#0f172a] border-2 border-emerald-500 p-2 shadow-md"
          >
            <div className="flex items-center justify-between text-[9.5px] font-black text-emerald-300">
              <span>☁️ NextGen Cloud & AI Lab</span>
              <span className="text-[8px] bg-emerald-950 text-emerald-200 px-1 rounded">Booth 03</span>
            </div>
            <p className="text-[8.5px] text-slate-300 mt-1">
              リアルタイム空間同期＆生成AI自動議事録デモ体験コーナー
            </p>
            <div className="mt-1 flex items-center justify-between text-[8px] text-emerald-400 font-bold">
              <span>デモ体験受付中</span>
            </div>
          </div>

          {/* ブース 4 */}
          <div 
            className="rounded-xl bg-[#0f172a] border-2 border-pink-500 p-2 shadow-md"
          >
            <div className="flex items-center justify-between text-[9.5px] font-black text-pink-300">
              <span>☕️ Sponsor Networking Cafe</span>
              <span className="text-[8px] bg-pink-950 text-pink-200 px-1 rounded">Booth 04</span>
            </div>
            <p className="text-[8.5px] text-slate-300 mt-1">
              参加者と登壇者・スポンサーが名刺交換や個別相談できる交流サロン
            </p>
            <div className="mt-1 flex items-center justify-between text-[8px] text-pink-400 font-bold">
              <span>カジュアル相談OK</span>
            </div>
          </div>
        </div>

        <div className="text-[8.5px] text-slate-400 text-center font-mono bg-slate-900/80 py-1 rounded border border-slate-700">
          ブースに近づくと担当者と直接空間音声で会話できます
        </div>
      </div>
    </div>
  );
};

