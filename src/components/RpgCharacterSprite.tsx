import React from 'react';
import { RpgJobClass } from '../types';

interface RpgCharacterSpriteProps {
  jobClass?: RpgJobClass;
  isSelf?: boolean;
  isSpeaking?: boolean;
  scale?: number;
}

export const RpgCharacterSprite: React.FC<RpgCharacterSpriteProps> = ({
  jobClass = 'hero',
  isSelf = false,
  isSpeaking = false,
  scale = 1,
}) => {
  // SFC風 16-bit ドット絵キャラクター全身スプライト（SVGピクセルアート）
  const renderJobSprite = () => {
    switch (jobClass) {
      case 'hero': // 勇者
        return (
          <svg viewBox="0 0 32 40" className="w-full h-full drop-shadow-md" style={{ imageRendering: 'pixelated' }}>
            {/* 影 */}
            <ellipse cx="16" cy="38" rx="10" ry="3" fill="rgba(0,0,0,0.35)" />
            {/* 赤マント */}
            <rect x="8" y="16" width="16" height="18" rx="2" fill="#DC2626" />
            <rect x="7" y="18" width="18" height="15" fill="#B91C1C" />
            {/* 足・ブーツ */}
            <rect x="10" y="31" width="5" height="7" fill="#78350F" />
            <rect x="17" y="31" width="5" height="7" fill="#78350F" />
            <rect x="9" y="35" width="6" height="3" fill="#451A03" />
            <rect x="17" y="35" width="6" height="3" fill="#451A03" />
            {/* 鎧・胴体 */}
            <rect x="10" y="18" width="12" height="13" fill="#2563EB" />
            <rect x="12" y="19" width="8" height="10" fill="#3B82F6" />
            {/* 胸のエンブレム（金） */}
            <rect x="14" y="21" width="4" height="4" fill="#FBBF24" />
            {/* ベルト */}
            <rect x="10" y="28" width="12" height="3" fill="#92400E" />
            <rect x="15" y="28" width="2" height="3" fill="#F59E0B" />
            {/* 両腕 */}
            <rect x="7" y="19" width="4" height="9" fill="#1D4ED8" />
            <rect x="21" y="19" width="4" height="9" fill="#1D4ED8" />
            <rect x="7" y="26" width="4" height="3" fill="#FCD34D" />
            <rect x="21" y="26" width="4" height="3" fill="#FCD34D" />
            {/* 剣（右手に装備） */}
            <rect x="24" y="14" width="3" height="16" fill="#E2E8F0" />
            <rect x="23" y="24" width="5" height="2" fill="#D97706" />
            <rect x="24" y="26" width="3" height="4" fill="#78350F" />
            {/* 顔・肌 */}
            <rect x="10" y="8" width="12" height="11" fill="#FDE68A" />
            <rect x="11" y="9" width="10" height="9" fill="#FEF3C7" />
            {/* 目 */}
            <rect x="12" y="12" width="2" height="3" fill="#1E293B" />
            <rect x="18" y="12" width="2" height="3" fill="#1E293B" />
            <rect x="12" y="12" width="1" height="1" fill="#FFFFFF" />
            <rect x="18" y="12" width="1" height="1" fill="#FFFFFF" />
            {/* ほっぺ */}
            <rect x="11" y="15" width="2" height="1" fill="#FCA5A5" />
            <rect x="19" y="15" width="2" height="1" fill="#FCA5A5" />
            {/* 髪（金髪・ツンツンヘア） */}
            <rect x="9" y="3" width="14" height="7" fill="#F59E0B" />
            <rect x="10" y="2" width="12" height="3" fill="#FBBF24" />
            <rect x="8" y="6" width="3" height="7" fill="#D97706" />
            <rect x="21" y="6" width="3" height="7" fill="#D97706" />
            <rect x="11" y="7" width="3" height="3" fill="#FBBF24" />
            <rect x="18" y="7" width="3" height="3" fill="#FBBF24" />
            {/* 額のサークレット */}
            <rect x="9" y="7" width="14" height="2" fill="#3B82F6" />
            <rect x="15" y="6" width="2" height="3" fill="#EF4444" />
          </svg>
        );

      case 'mage': // 魔法使い
        return (
          <svg viewBox="0 0 32 40" className="w-full h-full drop-shadow-md" style={{ imageRendering: 'pixelated' }}>
            <ellipse cx="16" cy="38" rx="10" ry="3" fill="rgba(0,0,0,0.35)" />
            {/* 紫のロングローブ */}
            <path d="M7 20 L25 20 L27 37 L5 37 Z" fill="#6B21A8" />
            <rect x="8" y="20" width="16" height="16" fill="#7E22CE" />
            <rect x="14" y="20" width="4" height="17" fill="#A855F7" />
            {/* 靴 */}
            <rect x="10" y="36" width="4" height="2" fill="#3B0764" />
            <rect x="18" y="36" width="4" height="2" fill="#3B0764" />
            {/* 杖（左手に装備・先端に光るクリスタル） */}
            <rect x="5" y="10" width="2" height="26" fill="#78350F" />
            <circle cx="6" cy="9" r="4" fill="#38BDF8" className="animate-pulse" />
            <circle cx="6" cy="9" r="2" fill="#E0F2FE" />
            {/* 顔 */}
            <rect x="10" y="10" width="12" height="10" fill="#FEF3C7" />
            {/* 目 */}
            <rect x="12" y="13" width="2" height="2" fill="#4C1D95" />
            <rect x="18" y="13" width="2" height="2" fill="#4C1D95" />
            <rect x="12" y="13" width="1" height="1" fill="#FFFFFF" />
            <rect x="18" y="13" width="1" height="1" fill="#FFFFFF" />
            {/* 髪（銀髪） */}
            <rect x="9" y="8" width="14" height="5" fill="#E2E8F0" />
            <rect x="8" y="11" width="3" height="8" fill="#CBD5E1" />
            <rect x="21" y="11" width="3" height="8" fill="#CBD5E1" />
            {/* 魔術師のとんがり帽子 */}
            <polygon points="16,0 25,10 7,10" fill="#581C87" />
            <ellipse cx="16" cy="10" rx="10" ry="3" fill="#6B21A8" />
            <ellipse cx="16" cy="10" rx="8" ry="2" fill="#7E22CE" />
            {/* 帽子リボン（金） */}
            <rect x="10" y="8" width="12" height="2" fill="#FBBF24" />
          </svg>
        );

      case 'knight': // 聖騎士
        return (
          <svg viewBox="0 0 32 40" className="w-full h-full drop-shadow-md" style={{ imageRendering: 'pixelated' }}>
            <ellipse cx="16" cy="38" rx="10" ry="3" fill="rgba(0,0,0,0.35)" />
            {/* 白銀のフルプレートメイル */}
            <rect x="8" y="16" width="16" height="16" rx="2" fill="#94A3B8" />
            <rect x="10" y="17" width="12" height="14" fill="#CBD5E1" />
            <rect x="12" y="19" width="8" height="9" fill="#F1F5F9" />
            {/* 足・鉄甲 */}
            <rect x="10" y="32" width="5" height="6" fill="#64748B" />
            <rect x="17" y="32" width="5" height="6" fill="#64748B" />
            <rect x="9" y="35" width="6" height="3" fill="#475569" />
            <rect x="17" y="35" width="6" height="3" fill="#475569" />
            {/* 大盾（左手） */}
            <path d="M4 18 L10 18 L10 29 L7 33 L4 29 Z" fill="#DC2626" />
            <path d="M5 19 L9 19 L9 28 L7 31 L5 28 Z" fill="#EF4444" />
            <rect x="6" y="23" width="2" height="4" fill="#FBBF24" />
            {/* 兜 */}
            <rect x="9" y="4" width="14" height="13" fill="#64748B" />
            <rect x="10" y="5" width="12" height="11" fill="#94A3B8" />
            <rect x="11" y="6" width="10" height="9" fill="#E2E8F0" />
            {/* バイザー */}
            <rect x="11" y="10" width="10" height="4" fill="#1E293B" />
            <rect x="13" y="11" width="2" height="2" fill="#60A5FA" />
            <rect x="17" y="11" width="2" height="2" fill="#60A5FA" />
            {/* 兜の赤羽飾り */}
            <path d="M14 0 L18 0 L18 6 L14 6 Z" fill="#DC2626" />
          </svg>
        );

      case 'cleric': // 僧侶・ヒーラー
        return (
          <svg viewBox="0 0 32 40" className="w-full h-full drop-shadow-md" style={{ imageRendering: 'pixelated' }}>
            <ellipse cx="16" cy="38" rx="10" ry="3" fill="rgba(0,0,0,0.35)" />
            {/* 白とエメラルドの聖職者服 */}
            <path d="M7 18 L25 18 L26 37 L6 37 Z" fill="#F8FAFC" />
            <rect x="9" y="18" width="14" height="18" fill="#FFFFFF" />
            <rect x="13" y="18" width="6" height="19" fill="#059669" />
            {/* 聖十字 */}
            <rect x="15" y="21" width="2" height="6" fill="#FBBF24" />
            <rect x="13" y="23" width="6" height="2" fill="#FBBF24" />
            {/* 顔 */}
            <rect x="10" y="8" width="12" height="10" fill="#FEF3C7" />
            {/* 目 */}
            <rect x="12" y="12" width="2" height="2" fill="#065F46" />
            <rect x="18" y="12" width="2" height="2" fill="#065F46" />
            <rect x="12" y="12" width="1" height="1" fill="#FFFFFF" />
            <rect x="18" y="12" width="1" height="1" fill="#FFFFFF" />
            {/* シスターフード */}
            <path d="M7 4 L25 4 L26 14 L6 14 Z" fill="#047857" opacity="0.9" />
            <rect x="9" y="3" width="14" height="3" fill="#10B981" />
            {/* ホーリーロッド */}
            <rect x="24" y="8" width="2" height="28" fill="#D97706" />
            <circle cx="25" cy="8" r="3.5" fill="#34D399" className="animate-pulse" />
          </svg>
        );

      case 'scholar': // 学者・エンジニア
        return (
          <svg viewBox="0 0 32 40" className="w-full h-full drop-shadow-md" style={{ imageRendering: 'pixelated' }}>
            <ellipse cx="16" cy="38" rx="10" ry="3" fill="rgba(0,0,0,0.35)" />
            <rect x="8" y="17" width="16" height="16" rx="2" fill="#1E293B" />
            <rect x="10" y="18" width="12" height="14" fill="#334155" />
            <rect x="14" y="18" width="4" height="14" fill="#FFFFFF" />
            <rect x="15" y="19" width="2" height="7" fill="#DC2626" />
            <rect x="10" y="31" width="5" height="7" fill="#1E293B" />
            <rect x="17" y="31" width="5" height="7" fill="#1E293B" />
            {/* 魔導書 */}
            <rect x="5" y="21" width="6" height="9" rx="1" fill="#7C2D12" />
            <rect x="6" y="22" width="4" height="7" fill="#FDE68A" />
            <rect x="7" y="24" width="2" height="3" fill="#38BDF8" className="animate-pulse" />
            {/* 顔 */}
            <rect x="10" y="8" width="12" height="10" fill="#FEF3C7" />
            {/* メガネ */}
            <rect x="11" y="11" width="4" height="4" fill="none" stroke="#0284C7" strokeWidth="1" />
            <rect x="17" y="11" width="4" height="4" fill="none" stroke="#0284C7" strokeWidth="1" />
            <rect x="15" y="12" width="2" height="1" fill="#0284C7" />
            <rect x="12" y="12" width="2" height="2" fill="#0F172A" />
            <rect x="18" y="12" width="2" height="2" fill="#0F172A" />
            <rect x="9" y="4" width="14" height="6" fill="#1E293B" />
          </svg>
        );

      case 'bard': // 吟遊詩人・デザイナー
        return (
          <svg viewBox="0 0 32 40" className="w-full h-full drop-shadow-md" style={{ imageRendering: 'pixelated' }}>
            <ellipse cx="16" cy="38" rx="10" ry="3" fill="rgba(0,0,0,0.35)" />
            <rect x="8" y="17" width="16" height="15" rx="2" fill="#DB2777" />
            <rect x="10" y="18" width="12" height="13" fill="#EC4899" />
            <rect x="10" y="30" width="5" height="7" fill="#047857" />
            <rect x="17" y="30" width="5" height="7" fill="#047857" />
            {/* パレット */}
            <ellipse cx="6" cy="25" rx="4" ry="5" fill="#D97706" />
            <circle cx="5" cy="24" r="1" fill="#EF4444" />
            <circle cx="7" cy="24" r="1" fill="#3B82F6" />
            <circle cx="6" cy="26" r="1" fill="#10B981" />
            {/* 顔 */}
            <rect x="10" y="8" width="12" height="10" fill="#FEF3C7" />
            <rect x="12" y="12" width="2" height="2" fill="#831843" />
            <rect x="18" y="12" width="2" height="2" fill="#831843" />
            <rect x="9" y="6" width="14" height="6" fill="#EA580C" />
            {/* 羽根付きベレー帽 */}
            <ellipse cx="16" cy="5" rx="8" ry="4" fill="#BE185D" />
            <polygon points="12,0 15,4 10,4" fill="#FDE047" />
          </svg>
        );

      case 'robot': // 魔導ロボット
        return (
          <svg viewBox="0 0 32 40" className="w-full h-full drop-shadow-md" style={{ imageRendering: 'pixelated' }}>
            <ellipse cx="16" cy="38" rx="10" ry="3" fill="rgba(0,0,0,0.35)" />
            <rect x="8" y="16" width="16" height="16" rx="3" fill="#334155" />
            <rect x="9" y="17" width="14" height="14" fill="#475569" />
            <circle cx="16" cy="24" r="3" fill="#38BDF8" className="animate-pulse" />
            <rect x="9" y="32" width="6" height="6" fill="#1E293B" />
            <rect x="17" y="32" width="6" height="6" fill="#1E293B" />
            <rect x="5" y="18" width="3" height="10" fill="#64748B" />
            <rect x="24" y="18" width="3" height="10" fill="#64748B" />
            <rect x="8" y="4" width="16" height="12" rx="2" fill="#334155" />
            <rect x="9" y="5" width="14" height="10" fill="#64748B" />
            <rect x="10" y="7" width="12" height="5" rx="1" fill="#0284C7" />
            <rect x="11" y="8" width="3" height="3" fill="#38BDF8" className="animate-ping" />
            <rect x="18" y="8" width="3" height="3" fill="#38BDF8" className="animate-ping" />
            <rect x="15" y="0" width="2" height="4" fill="#94A3B8" />
            <circle cx="16" cy="1" r="2" fill="#EF4444" className="animate-bounce" />
          </svg>
        );

      case 'rogue': // 盗賊
        return (
          <svg viewBox="0 0 32 40" className="w-full h-full drop-shadow-md" style={{ imageRendering: 'pixelated' }}>
            <ellipse cx="16" cy="38" rx="10" ry="3" fill="rgba(0,0,0,0.35)" />
            <rect x="9" y="18" width="14" height="14" fill="#064E3B" />
            <rect x="11" y="19" width="10" height="12" fill="#047857" />
            <rect x="10" y="32" width="5" height="6" fill="#1C1917" />
            <rect x="17" y="32" width="5" height="6" fill="#1C1917" />
            <rect x="5" y="24" width="2" height="8" fill="#E2E8F0" />
            <rect x="25" y="24" width="2" height="8" fill="#E2E8F0" />
            <rect x="8" y="4" width="16" height="14" rx="3" fill="#065F46" />
            <rect x="9" y="5" width="14" height="12" fill="#047857" />
            <rect x="11" y="10" width="10" height="3" fill="#064E3B" />
            <rect x="12" y="10" width="2" height="2" fill="#FDE047" />
            <rect x="18" y="10" width="2" height="2" fill="#FDE047" />
          </svg>
        );

      case 'king': // ギルド長・王様
      default:
        return (
          <svg viewBox="0 0 32 40" className="w-full h-full drop-shadow-md" style={{ imageRendering: 'pixelated' }}>
            <ellipse cx="16" cy="38" rx="10" ry="3" fill="rgba(0,0,0,0.35)" />
            <path d="M6 18 L26 18 L28 37 L4 37 Z" fill="#991B1B" />
            <rect x="8" y="18" width="16" height="17" fill="#B91C1C" />
            <rect x="6" y="18" width="2" height="19" fill="#F8FAFC" />
            <rect x="24" y="18" width="2" height="19" fill="#F8FAFC" />
            <circle cx="16" cy="22" r="2.5" fill="#FBBF24" />
            <rect x="10" y="8" width="12" height="10" fill="#FEF3C7" />
            <rect x="12" y="11" width="2" height="2" fill="#1E293B" />
            <rect x="18" y="11" width="2" height="2" fill="#1E293B" />
            <rect x="11" y="14" width="10" height="4" fill="#F1F5F9" />
            <polygon points="8,7 10,2 13,6 16,0 19,6 22,2 24,7" fill="#F59E0B" />
            <polygon points="9,7 11,3 13,6 16,1 19,6 21,3 23,7" fill="#FBBF24" />
            <circle cx="16" cy="4" r="1.5" fill="#EF4444" />
          </svg>
        );
    }
  };

  return (
    <div 
      className="relative w-12 h-14 select-none flex items-center justify-center"
      style={{
        transform: `scale(${scale})`,
        imageRendering: 'pixelated',
      }}
    >
      {/* 自分が操作しているキャラの場合の足元レトロカーソル */}
      {isSelf && (
        <div className="absolute -bottom-1 w-11 h-4 bg-amber-400/40 rounded-full border border-amber-400 animate-pulse pointer-events-none" />
      )}

      {/* 発言中の波紋 */}
      {isSpeaking && (
        <div className="absolute -inset-1 rounded-full border-2 border-emerald-400 animate-ping opacity-75 pointer-events-none" />
      )}

      <div className="w-12 h-14">
        {renderJobSprite()}
      </div>
    </div>
  );
};
