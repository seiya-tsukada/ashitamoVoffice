import React, { useState, useRef } from 'react';
import { motion } from 'motion/react';
import { Member } from '../types';
import { RpgCharacterSprite } from './RpgCharacterSprite';
import { Volume2, Move } from 'lucide-react';
import { AVATAR_POSITION_BOUNDS, DEFAULT_VOICE_RANGE, DRAG_START_THRESHOLD_PX } from '../constants/officeMap';
import { RPG_JOB_LABELS } from '../constants/rpgJob';

const clampToMap = (value: number, min: number, max: number) => Math.round(Math.max(min, Math.min(max, value)));

// 職業名の日本語ラベル（例: "Lv.5 勇者"）
const formatJobLabel = (member: Member) => {
  const job = RPG_JOB_LABELS[member.rpgClass || 'hero'];
  return job && `Lv.${member.rpgLevel || job.defaultLevel} ${job.label}`;
};

interface AvatarItemProps {
  member: Member;
  zoomLevel: number;
  isSelf?: boolean;
  isSelected?: boolean;
  onSelect?: (member: Member) => void;
  onLiveDrag?: (memberId: string, pos: { x: number; y: number }) => void;
  onDragCommit?: (memberId: string, pos: { x: number; y: number }) => void;
  isNearSelf?: boolean;
  customBubble?: string | null;
}

export const AvatarItem: React.FC<AvatarItemProps> = ({
  member,
  zoomLevel,
  isSelf = false,
  isSelected = false,
  onSelect,
  onLiveDrag,
  onDragCommit,
  isNearSelf = false,
  customBubble,
}) => {
  const voiceRadius = member.voiceRange || DEFAULT_VOICE_RANGE;
  const isIconMode = member.avatarMode === 'icon';

  const [isDragging, setIsDragging] = useState<boolean>(false);
  const [dragOffset, setDragOffset] = useState<{ x: number; y: number }>({ x: 0, y: 0 });

  const dragStartRef = useRef<{
    pointerX: number;
    pointerY: number;
    startX: number;
    startY: number;
    hasMoved: boolean;
  } | null>(null);

  // 高精度ポインタドラッグ開始
  const handlePointerDown = (e: React.PointerEvent<HTMLDivElement>) => {
    if (e.button !== 0 && e.pointerType === 'mouse') return;
    e.stopPropagation();
    try {
      e.currentTarget.setPointerCapture(e.pointerId);
    } catch {}

    dragStartRef.current = {
      pointerX: e.clientX,
      pointerY: e.clientY,
      startX: member.position.x,
      startY: member.position.y,
      hasMoved: false,
    };
    setDragOffset({ x: 0, y: 0 });
  };

  // ドラッグ中：マウス移動量をズーム率で除算して完全な1:1ピクセル追従
  const handlePointerMove = (e: React.PointerEvent<HTMLDivElement>) => {
    if (!dragStartRef.current) return;
    const dx = (e.clientX - dragStartRef.current.pointerX) / zoomLevel;
    const dy = (e.clientY - dragStartRef.current.pointerY) / zoomLevel;

    if (!dragStartRef.current.hasMoved && Math.hypot(dx, dy) >= DRAG_START_THRESHOLD_PX) {
      dragStartRef.current.hasMoved = true;
      setIsDragging(true);
    }

    if (dragStartRef.current.hasMoved) {
      const rawX = dragStartRef.current.startX + dx;
      const rawY = dragStartRef.current.startY + dy;
      const clampedX = clampToMap(rawX, AVATAR_POSITION_BOUNDS.minX, AVATAR_POSITION_BOUNDS.maxX);
      const clampedY = clampToMap(rawY, AVATAR_POSITION_BOUNDS.minY, AVATAR_POSITION_BOUNDS.maxY);

      const currentOffset = {
        x: clampedX - dragStartRef.current.startX,
        y: clampedY - dragStartRef.current.startY,
      };
      setDragOffset(currentOffset);

      if (onLiveDrag) {
        onLiveDrag(member.id, { x: clampedX, y: clampedY });
      }
    }
  };

  // ドロップ時：位置を確定
  const handlePointerUp = (e: React.PointerEvent<HTMLDivElement>) => {
    if (!dragStartRef.current) return;
    try {
      e.currentTarget.releasePointerCapture(e.pointerId);
    } catch {}

    const { hasMoved, startX, startY } = dragStartRef.current;
    const finalX = clampToMap(startX + dragOffset.x, AVATAR_POSITION_BOUNDS.minX, AVATAR_POSITION_BOUNDS.maxX);
    const finalY = clampToMap(startY + dragOffset.y, AVATAR_POSITION_BOUNDS.minY, AVATAR_POSITION_BOUNDS.maxY);

    dragStartRef.current = null;
    setIsDragging(false);
    setDragOffset({ x: 0, y: 0 });

    if (hasMoved) {
      if (onDragCommit) {
        onDragCommit(member.id, { x: finalX, y: finalY });
      }
    } else {
      if (onSelect) {
        onSelect(member);
      }
    }
  };

  // 表示座標（ドラッグ中はオフセット分をリアルタイム加算）
  const displayX = member.position.x + dragOffset.x;
  const displayY = member.position.y + dragOffset.y;

  return (
    <div
      id={`avatar-${member.id}`}
      onPointerDown={handlePointerDown}
      onPointerMove={handlePointerMove}
      onPointerUp={handlePointerUp}
      onPointerCancel={handlePointerUp}
      className={`absolute select-none group flex flex-col items-center touch-none ${
        isDragging ? 'cursor-grabbing z-50 scale-110' : 'cursor-grab hover:scale-105'
      }`}
      style={{
        left: `${displayX}px`,
        top: `${displayY}px`,
        transform: 'translate(-50%, -50%)',
        zIndex: isDragging ? 60 : isSelf ? 35 : isSelected ? 30 : 20,
        transition: isDragging ? 'none' : 'transform 0.15s ease-out',
      }}
    >
      {/* 空間オーディオ・近接音声範囲（レトロドット調サークル） */}
      <motion.div
        className="absolute rounded-full pointer-events-none -translate-x-1/2 -translate-y-1/2 left-1/2 top-1/2"
        style={{
          width: voiceRadius * 2,
          height: voiceRadius * 2,
          border: isSelf
            ? '2px dashed rgba(251, 191, 36, 0.6)'
            : isNearSelf
            ? '2px solid rgba(16, 185, 129, 0.7)'
            : '1px dashed rgba(251, 191, 36, 0.25)',
          backgroundColor: isSelf
            ? 'rgba(251, 191, 36, 0.08)'
            : isNearSelf
            ? 'rgba(16, 185, 129, 0.15)'
            : 'rgba(251, 191, 36, 0.02)',
        }}
        animate={{
          scale: member.isSpeaking ? [1, 1.08, 1] : 1,
          opacity: member.isSpeaking ? [0.7, 1, 0.7] : 0.8,
        }}
        transition={{
          repeat: member.isSpeaking ? Infinity : 0,
          duration: 1.8,
          ease: 'easeInOut',
        }}
      />

      {/* 近接通信中のインジケーター */}
      {isNearSelf && !isSelf && (
        <motion.div
          className="absolute -top-4 -right-4 bg-emerald-600 text-white rounded-full px-2 py-0.5 shadow-lg text-[9px] font-black flex items-center gap-1 z-40 border border-emerald-300"
          animate={{ scale: [1, 1.1, 1] }}
          transition={{ repeat: Infinity, duration: 1.5 }}
        >
          <Volume2 className="w-3 h-3" />
          <span>接続中</span>
        </motion.div>
      )}

      {/* 吹き出し (ステータスやつぶやき) */}
      {(customBubble || member.customStatusMsg) && (
        <div
          className="absolute -top-12 left-1/2 -translate-x-1/2 whitespace-nowrap bg-[#1e1b4b] text-amber-200 text-[10px] font-bold px-3 py-1 rounded-xl shadow-2xl border-2 border-amber-400 flex items-center gap-1.5 z-40 pointer-events-none font-mono animate-in fade-in zoom-in duration-150"
        >
          <span className="text-[10px]">{member.status.emoji}</span>
          <span className="max-w-[150px] truncate">{customBubble || member.customStatusMsg}</span>
          <div className="absolute -bottom-1.5 left-1/2 -translate-x-1/2 w-2.5 h-2.5 bg-[#1e1b4b] border-r-2 border-b-2 border-amber-400 transform rotate-45" />
        </div>
      )}

      {/* ================= アバター表示：SFC 全身ドット絵 or 丸型アイコン ================= */}
      <div className="relative group flex flex-col items-center">
        {/* 自分の場合のカーソル（YOU ▼） */}
        {isSelf && (
          <div className="absolute -top-6 text-amber-400 text-xs font-black animate-bounce flex flex-col items-center">
            <span className="bg-amber-400 text-slate-950 px-1.5 py-0.2 rounded text-[8px] font-extrabold shadow-md">YOU</span>
            <span>▼</span>
          </div>
        )}

        {/* 選択中のターゲットリング */}
        {isSelected && (
          <div className="absolute -inset-2 rounded-full border-2 border-amber-400 animate-ping opacity-80 pointer-events-none" />
        )}

        {/* アイコンモード or ドット絵スプライトモード */}
        {isIconMode ? (
          <div className="relative w-11 h-11 rounded-full p-0.5 bg-gradient-to-tr from-amber-600 to-amber-300 shadow-xl">
            <img
              src={member.avatar}
              alt={member.name}
              className="w-full h-full rounded-full object-cover border border-amber-950"
              referrerPolicy="no-referrer"
            />
            {/* ステータスドット */}
            <span
              className="absolute bottom-0 right-0 w-3.5 h-3.5 rounded-full border-2 border-slate-900 shadow-sm"
              style={{ backgroundColor: member.status.color }}
            />
          </div>
        ) : (
          <RpgCharacterSprite
            jobClass={member.rpgClass || 'hero'}
            isSelf={isSelf}
            isSpeaking={member.isSpeaking}
          />
        )}
      </div>

      {/* ドット絵風ネームプレート ＆ 職業・居場所バッジ */}
      <div className="mt-0.5 flex flex-col items-center">
        <div className={`px-2 py-0.5 rounded-md shadow-lg border text-[10px] font-black flex items-center gap-1 whitespace-nowrap ${
          isSelf 
            ? 'bg-amber-400 text-slate-950 border-amber-300 ring-1 ring-amber-500' 
            : isNearSelf
            ? 'bg-emerald-600 text-white border-emerald-300'
            : 'bg-[#1c1611]/90 text-amber-100 border-[#5c3a1e]'
        }`}>
          <span className="text-[8px]">{member.status.emoji}</span>
          <span>{member.name}</span>
          {isSelf && <span className="text-[8px] font-mono">(You)</span>}
        </div>

        {/* 職業クラス/役割バッジ */}
        <div className="text-[8px] font-mono bg-black/80 text-amber-300 px-1.5 py-0.2 rounded border border-amber-800 shadow-xs mt-0.5 flex items-center gap-0.5">
          <span>{isIconMode ? member.role.slice(0, 10) : formatJobLabel(member)}</span>
        </div>
      </div>
    </div>
  );
};


