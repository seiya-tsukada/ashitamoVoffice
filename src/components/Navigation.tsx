import React from 'react';
import { PageType } from '../types';
import { 
  Building2, 
  Columns2, 
  UserCheck 
} from 'lucide-react';

interface NavigationProps {
  currentPage: PageType;
  onPageChange: (page: PageType) => void;
  onlineCount: number;
  selectedMemberName?: string;
  unreadAutonomousCount?: number;
  isConnected?: boolean;
}

export const Navigation: React.FC<NavigationProps> = ({
  currentPage,
  onPageChange,
  onlineCount,
  selectedMemberName,
  unreadAutonomousCount = 0,
  isConnected = true,
}) => {
  const pages: { id: PageType; title: string; subtitle: string; icon: React.ElementType }[] = [
    {
      id: 'office',
      title: '1. オフィス空間',
      subtitle: 'バーチャル空間・アバター配置',
      icon: Building2,
    },
    {
      id: 'split-chat',
      title: '2. スプリットチャット',
      subtitle: '左アバター × 右自律チャット',
      icon: Columns2,
    },
    {
      id: 'profile-booking',
      title: '3. プロフィール＆予約',
      subtitle: '詳細情報＆カレンダー1on1予約',
      icon: UserCheck,
    },
  ];

  return (
    <header
      id="app-header"
      className="h-16 bg-white/95 backdrop-blur-md border-b border-slate-200/80 px-4 md:px-6 flex items-center justify-between shadow-xs sticky top-0 z-50 select-none"
    >
      {/* 左側：ブランドロゴ＆空間名 */}
      <div className="flex items-center gap-3">
        <div className="flex items-center gap-2">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-blue-600 to-indigo-600 flex items-center justify-center text-white shadow-md shadow-blue-500/20">
            <Building2 className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-1.5">
              <span className="font-extrabold text-base tracking-tight text-slate-900 font-sans">
                ovice Space
              </span>
              <span className="text-[10px] uppercase font-bold bg-blue-100 text-blue-700 px-1.5 py-0.5 rounded tracking-wider">
                Virtual
              </span>
            </div>
            <p className="text-[11px] text-slate-500 hidden sm:block">
              Tokyo Headquarter · Floor 3F (Tech & Design)
            </p>
          </div>
        </div>

        <div className="hidden md:flex items-center gap-2 ml-3 pl-3 border-l border-slate-200 text-xs text-slate-600">
          <span
            className={`inline-block w-2.5 h-2.5 rounded-full ${
              isConnected ? 'bg-emerald-500 animate-pulse' : 'bg-amber-500'
            }`}
          />
          <span className="font-semibold text-slate-800">
            {onlineCount}名 同時接続中
          </span>
        </div>
      </div>

      {/* 中央：3ページのステップ/タブナビゲーション */}
      <nav className="flex items-center gap-1 bg-slate-100/80 p-1 rounded-xl border border-slate-200/60 shadow-inner">
        {pages.map((p, idx) => {
          const Icon = p.icon;
          const isActive = currentPage === p.id;
          return (
            <button
              key={p.id}
              id={`nav-tab-${p.id}`}
              onClick={() => onPageChange(p.id)}
              className={`relative flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all duration-200 cursor-pointer ${
                isActive
                  ? 'bg-white text-blue-700 shadow-sm shadow-slate-200/80 font-bold'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-200/60'
              }`}
              title={p.subtitle}
            >
              <Icon className={`w-3.5 h-3.5 ${isActive ? 'text-blue-600' : 'text-slate-400'}`} />
              <span className="hidden sm:inline">{p.title}</span>
              <span className="sm:hidden">{idx + 1}</span>

              {p.id === 'split-chat' && unreadAutonomousCount > 0 && (
                <span className="w-2 h-2 rounded-full bg-rose-500 ring-2 ring-white animate-pulse" />
              )}
            </button>
          );
        })}
      </nav>

      {/* 右側：コントロール＆現在選択情報 */}
      <div className="flex items-center gap-2">
        <button
          id="btn-copy-share-url"
          onClick={() => {
            navigator.clipboard.writeText(window.location.href);
            alert('📋 空間の招待URLをコピーしました！\n別のブラウザや別タブで開くと、リアルタイムに2人以上で同時操作できます。');
          }}
          className="flex items-center gap-1.5 bg-blue-50 hover:bg-blue-100 text-blue-700 text-xs font-bold px-3 py-1.5 rounded-xl border border-blue-200 transition-colors cursor-pointer"
          title="招待URLをコピー（複数人で同時接続）"
        >
          <span>🔗</span>
          <span className="hidden sm:inline">招待リンクをコピー</span>
        </button>

        {selectedMemberName && (
          <div className="hidden lg:flex items-center gap-1 text-xs bg-slate-50 border border-slate-200 px-2.5 py-1 rounded-lg text-slate-700">
            <span className="text-slate-400">選択中:</span>
            <span className="font-bold text-slate-900">{selectedMemberName}</span>
          </div>
        )}
      </div>
    </header>
  );
};
