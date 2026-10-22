import React, { useState, useRef } from 'react';
import { Member, OfficeZone, PageType } from '../types';
import { AvatarItem } from './AvatarItem';
import { RpgOfficeMap } from './RpgOfficeMap';
import { ConferenceSummitMap } from './ConferenceSummitMap';
import { CharacterAvatarPickerModal } from './CharacterAvatarPickerModal';
import { RpgCharacterSprite } from './RpgCharacterSprite';
import { 
  MessageSquare, 
  Calendar, 
  Volume2, 
  MapPin, 
  ZoomIn, 
  ZoomOut, 
  Maximize2, 
  ChevronRight,
  Globe,
  Sword,
  Sparkles,
  Users
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import {
  AVATAR_POPUP_LAYOUT,
  DEFAULT_VOICE_RANGE,
  OFFICE_MAP_HEIGHT,
  OFFICE_MAP_WIDTH,
  PROXIMITY_RANGE_RATIO,
  ZOOM,
} from '../constants/officeMap';
import {
  CONFERENCE_ZONES,
  CONFERENCE_ZONE_BOUNDS,
  DEFAULT_OFFICE_POSITION,
  DEFAULT_OFFICE_ZONE,
  OFFICE_FLOOR,
  OFFICE_ZONE_SELECT_ORDER,
  OfficeFloor,
} from '../constants/zones';

interface OfficeViewProps {
  members: Member[];
  zones: OfficeZone[];
  selfMember: Member;
  onUpdateSelfPosition: (pos: { x: number; y: number }, zoneInfo?: { zoneId: string; zoneName: string }) => void;
  onUpdateMemberPosition?: (memberId: string, pos: { x: number; y: number }, zoneInfo?: { zoneId: string; zoneName: string }) => void;
  onUpdateSelfMember: (updated: Partial<Member>) => void;
  onSelectMember: (member: Member) => void;
  onNavigateTo: (page: PageType, targetMember?: Member) => void;
  reactionEmoji: string | null;
  remoteReactions?: Record<string, string>;
}

export const OfficeView: React.FC<OfficeViewProps> = ({
  members,
  zones,
  selfMember,
  onUpdateSelfPosition,
  onUpdateMemberPosition,
  onUpdateSelfMember,
  onSelectMember,
  onNavigateTo,
  reactionEmoji,
  remoteReactions = {},
}) => {
  const officeRef = useRef<HTMLDivElement>(null);
  const [clickedMember, setClickedMember] = useState<Member | null>(null);
  const [zoomLevel, setZoomLevel] = useState<number>(ZOOM.DEFAULT);
  const [isAvatarModalOpen, setIsAvatarModalOpen] = useState<boolean>(false);
  
  // シチュエーション選択タブ：'rpg_office' (SFC風 RPGオフィス), 'all' (全体 カンファレンス・サミット)
  const [activeFloor, setActiveFloor] = useState<OfficeFloor>(OFFICE_FLOOR.RPG_OFFICE);

  // 座標から居場所ゾーン（プロパティ）を自動判定
  const getZoneFromPosition = (pos: { x: number; y: number }): { zoneId: string; zoneName: string } => {
    if (activeFloor === OFFICE_FLOOR.CONFERENCE) {
      const { sideAreaMaxX, entranceMaxY, arenaMaxX, stageMaxY } = CONFERENCE_ZONE_BOUNDS;
      let zone: { zoneId: string; zoneName: string };
      if (pos.x < sideAreaMaxX && pos.y < entranceMaxY) zone = CONFERENCE_ZONES.parking_lot;
      else if (pos.x < sideAreaMaxX) zone = CONFERENCE_ZONES.timetable_board;
      else if (pos.x <= arenaMaxX && pos.y <= stageMaxY) zone = CONFERENCE_ZONES.main_stage;
      else if (pos.x <= arenaMaxX) zone = CONFERENCE_ZONES.audience_seats;
      else zone = CONFERENCE_ZONES.booth_area;
      return { zoneId: zone.zoneId, zoneName: zone.zoneName };
    }

    for (const z of zones) {
      if (
        pos.x >= z.x &&
        pos.x <= z.x + z.width &&
        pos.y >= z.y &&
        pos.y <= z.y + z.height
      ) {
        return { zoneId: z.id, zoneName: z.rpgName || z.name };
      }
    }
    return { ...DEFAULT_OFFICE_ZONE };
  };

  // ゾーン選択（プロパティ居場所ドロップダウンからのテレポートプロット）
  const handleTeleportToZone = (zoneId: string, zoneName: string, targetPos: { x: number; y: number }) => {
    onUpdateSelfPosition(targetPos, { zoneId, zoneName });
  };

  // ドラッグ＆ドロップでアバターの位置を確定（高精度ピクセル計算完了時）
  const handleMemberDragCommit = (memberId: string, pos: { x: number; y: number }) => {
    const zoneInfo = getZoneFromPosition(pos);

    if (memberId === selfMember.id) {
      onUpdateSelfPosition(pos, zoneInfo);
    } else if (onUpdateMemberPosition) {
      onUpdateMemberPosition(memberId, pos, zoneInfo);
    }
  };

  // 近接判定
  const isNear = (m: Member) => {
    if (m.id === selfMember.id) return false;
    const dx = m.position.x - selfMember.position.x;
    const dy = m.position.y - selfMember.position.y;
    const distance = Math.sqrt(dx * dx + dy * dy);
    const combinedRange = (m.voiceRange || DEFAULT_VOICE_RANGE) + (selfMember.voiceRange || DEFAULT_VOICE_RANGE);
    return distance < combinedRange * PROXIMITY_RANGE_RATIO;
  };

  const nearMembers = members.filter((m) => isNear(m));

  return (
    <div className="relative w-full h-[calc(100vh-4rem)] flex flex-col overflow-hidden select-none bg-[#18120c] font-sans">
      {/* ================= 上部サブバー：居場所プロパティ操作 ＆ シチュエーション選択 ＆ アバター選択 ================= */}
      <div className="bg-[#241a12] border-b-2 border-[#5c3a1e] px-5 py-2 flex items-center justify-between z-30 shadow-xl text-amber-100 flex-wrap gap-2">
        <div className="flex items-center gap-3 flex-wrap">
          {/* 1. 自分の現在地プロパティ（居場所バッジ＆テレポートセレクター） */}
          <div className="flex items-center gap-2 bg-[#17100b] px-3 py-1.5 rounded-xl border border-amber-600/70 shadow-inner">
            <span className="flex items-center gap-1 text-xs font-black text-amber-400 font-mono">
              <MapPin className="w-3.5 h-3.5 text-amber-400 animate-bounce" />
              <span>居場所プロパティ:</span>
            </span>

            {/* 居場所プロパティ選択（選択すると即座にオフィス空間内の対応座標にプロット） */}
            <select
              value={selfMember.currentZoneId || DEFAULT_OFFICE_ZONE.zoneId}
              onChange={(e) => {
                const zId = e.target.value;
                if (activeFloor === OFFICE_FLOOR.RPG_OFFICE) {
                  const foundZone = zones.find(z => z.id === zId);
                  if (foundZone) {
                    const targetPos = {
                      x: foundZone.x + foundZone.width / 2,
                      y: foundZone.y + foundZone.height / 2,
                    };
                    handleTeleportToZone(foundZone.id, foundZone.rpgName, targetPos);
                  }
                } else {
                  // 全体カンファレンス用
                  const conferenceZone = Object.values(CONFERENCE_ZONES).find((z) => z.zoneId === zId);
                  if (conferenceZone) {
                    handleTeleportToZone(conferenceZone.zoneId, conferenceZone.zoneName, { ...conferenceZone.position });
                  }
                }
              }}
              className="bg-[#2e1f14] text-amber-200 text-xs font-black px-2.5 py-1 rounded-lg border border-amber-500 shadow-sm focus:outline-none focus:ring-2 focus:ring-amber-400 cursor-pointer"
            >
              {activeFloor === OFFICE_FLOOR.RPG_OFFICE
                ? OFFICE_ZONE_SELECT_ORDER.map((zoneId) => (
                    <option key={zoneId} value={zoneId}>
                      {zones.find((z) => z.id === zoneId)?.rpgName}
                    </option>
                  ))
                : Object.values(CONFERENCE_ZONES).map((z) => (
                    <option key={z.zoneId} value={z.zoneId}>
                      {z.zoneName}
                    </option>
                  ))}
            </select>
          </div>

          {/* 2. オフィス・シチュエーション選択タブ（SFC風RPGオフィス / 全体 カンファレンス・サミット） */}
          <div className="flex items-center bg-[#17100b] p-1 rounded-xl border border-[#5c3a1e] gap-1 text-xs font-black">
            <button
              id="tab-rpg-office"
              onClick={() => {
                setActiveFloor(OFFICE_FLOOR.RPG_OFFICE);
                handleTeleportToZone(DEFAULT_OFFICE_ZONE.zoneId, DEFAULT_OFFICE_ZONE.zoneName, { ...DEFAULT_OFFICE_POSITION });
              }}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg transition-all cursor-pointer ${
                activeFloor === OFFICE_FLOOR.RPG_OFFICE
                  ? 'bg-amber-500 text-slate-950 font-black shadow-md scale-[1.02]'
                  : 'text-amber-200/80 hover:text-amber-100 hover:bg-[#2b1e15]'
              }`}
            >
              <Sword className="w-3.5 h-3.5 text-slate-950" />
              <span>🏰 SFC風 RPGオフィス</span>
            </button>

            <button
              id="tab-conference-all"
              onClick={() => {
                setActiveFloor(OFFICE_FLOOR.CONFERENCE);
                const { zoneId, zoneName, position } = CONFERENCE_ZONES.main_stage;
                handleTeleportToZone(zoneId, zoneName, { ...position });
              }}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg transition-all cursor-pointer ${
                activeFloor === OFFICE_FLOOR.CONFERENCE
                  ? 'bg-amber-500 text-slate-950 font-black shadow-md scale-[1.02]'
                  : 'text-amber-200/80 hover:text-amber-100 hover:bg-[#2b1e15]'
              }`}
            >
              <Globe className="w-3.5 h-3.5 text-amber-400" />
              <span>🌐 全体 (大型カンファレンス)</span>
            </button>
          </div>

          {/* 3. キャラクター / アバター選択ボタン（オフィス選択箇所に併設） */}
          <button
            id="btn-open-avatar-picker"
            onClick={() => setIsAvatarModalOpen(true)}
            className="flex items-center gap-2 bg-gradient-to-r from-amber-600 to-amber-500 hover:from-amber-500 hover:to-amber-400 text-slate-950 px-3 py-1.5 rounded-xl border border-amber-300 shadow-md font-black text-xs transition-all active:scale-95 cursor-pointer"
            title="キャラクター・アバターを変更"
          >
            {selfMember.avatarMode === 'icon' ? (
              <img
                src={selfMember.avatar}
                alt="self avatar"
                className="w-5 h-5 rounded-full object-cover border border-slate-950"
                referrerPolicy="no-referrer"
              />
            ) : (
              <span className="text-sm">🧙‍♂️</span>
            )}
            <span>
              {selfMember.avatarMode === 'icon' ? '丸型アイコン' : 'SFCキャラ'}: 選択・変更
            </span>
            <Sparkles className="w-3.5 h-3.5" />
          </button>
        </div>

        {/* ズーム操作 */}
        <div className="flex items-center gap-3">
          <div className="flex items-center bg-[#17100b] p-0.5 rounded-xl border border-[#5c3a1e]">
            <button
              onClick={() => setZoomLevel((prev) => Math.max(ZOOM.MIN, prev - ZOOM.STEP))}
              className="p-1.5 text-amber-200 hover:text-white hover:bg-[#2e1f14] rounded-lg transition-colors cursor-pointer"
              title="縮小"
            >
              <ZoomOut className="w-3.5 h-3.5" />
            </button>
            <span className="text-[11px] font-mono font-bold px-1.5 text-amber-300">
              {Math.round(zoomLevel * 100)}%
            </span>
            <button
              onClick={() => setZoomLevel((prev) => Math.min(ZOOM.MAX, prev + ZOOM.STEP))}
              className="p-1.5 text-amber-200 hover:text-white hover:bg-[#2e1f14] rounded-lg transition-colors cursor-pointer"
              title="拡大"
            >
              <ZoomIn className="w-3.5 h-3.5" />
            </button>
            <button
              onClick={() => setZoomLevel(ZOOM.DEFAULT)}
              className="p-1.5 text-amber-200 hover:text-white hover:bg-[#2e1f14] rounded-lg text-[10px] font-medium cursor-pointer"
              title="リセット"
            >
              <Maximize2 className="w-3 h-3" />
            </button>
          </div>
        </div>
      </div>

      {/* ================= メイン空間キャンバス ================= */}
      <div
        className="flex-1 w-full h-full overflow-auto relative flex items-center justify-center p-4 cursor-default z-10"
      >
        <div
          ref={officeRef}
          className="relative rounded-3xl shadow-2xl border-4 border-[#5c3a1e] transition-transform duration-100 ease-out origin-center overflow-hidden"
          style={{
            width: `${OFFICE_MAP_WIDTH}px`,
            height: `${OFFICE_MAP_HEIGHT}px`,
            transform: `scale(${zoomLevel})`,
          }}
        >
          {/* フロア/シチュエーション切り替え表示 */}
          {activeFloor === OFFICE_FLOOR.RPG_OFFICE ? (
            <RpgOfficeMap />
          ) : (
            <ConferenceSummitMap />
          )}

          {/* 近接ライン */}
          {nearMembers.map((m) => (
            <svg
              key={`line-${m.id}`}
              className="absolute inset-0 w-full h-full pointer-events-none z-25"
            >
              <line
                x1={selfMember.position.x}
                y1={selfMember.position.y}
                x2={m.position.x}
                y2={m.position.y}
                stroke="#10B981"
                strokeWidth="3"
                strokeDasharray="6 4"
                className="animate-pulse"
              />
            </svg>
          ))}

          {/* 各メンバーのアバター（SFC全身ドット絵 or 丸型アイコン、高精度ドラッグ＆ドロップ対応） */}
          {members.map((member) => (
            <AvatarItem
              key={member.id}
              member={member}
              zoomLevel={zoomLevel}
              isSelf={member.id === selfMember.id}
              isSelected={clickedMember?.id === member.id}
              isNearSelf={isNear(member)}
              onSelect={(m) => {
                if (m.id !== selfMember.id) {
                  setClickedMember(m);
                  onSelectMember(m);
                }
              }}
              onDragCommit={handleMemberDragCommit}
              customBubble={
                member.id === selfMember.id
                  ? reactionEmoji
                  : remoteReactions[member.id] || null
              }
            />
          ))}

          {/* クイックポップアップ */}
          <AnimatePresence>
            {clickedMember && (
              <motion.div
                id="avatar-popup"
                initial={{ opacity: 0, scale: 0.9, y: 10 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.9 }}
                className="absolute z-50 bg-[#241a12] text-amber-100 rounded-3xl p-4 shadow-2xl border-2 border-amber-500 w-80 backdrop-blur-xl"
                style={{
                  left: Math.min(clickedMember.position.x + AVATAR_POPUP_LAYOUT.offsetX, AVATAR_POPUP_LAYOUT.maxLeft),
                  top: Math.max(clickedMember.position.y - AVATAR_POPUP_LAYOUT.offsetY, AVATAR_POPUP_LAYOUT.minTop),
                }}
              >
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-2xl bg-[#3d2b22] border-2 border-amber-400 p-1 flex items-center justify-center overflow-hidden">
                      {clickedMember.avatarMode === 'icon' ? (
                        <img
                          src={clickedMember.avatar}
                          alt={clickedMember.name}
                          className="w-10 h-10 rounded-xl object-cover"
                          referrerPolicy="no-referrer"
                        />
                      ) : (
                        <RpgCharacterSprite jobClass={clickedMember.rpgClass || 'hero'} scale={0.9} />
                      )}
                    </div>
                    <div>
                      <div className="flex items-center gap-1 font-black text-sm text-amber-200">
                        <span>{clickedMember.status.emoji}</span>
                        <span>{clickedMember.name}</span>
                      </div>
                      <p className="text-[11px] text-amber-400 font-mono">{clickedMember.role}</p>
                    </div>
                  </div>
                  <button
                    onClick={() => setClickedMember(null)}
                    className="text-amber-400 hover:text-white text-xs font-bold px-1.5 py-0.5 bg-[#3d2b22] rounded-lg cursor-pointer"
                  >
                    ✕
                  </button>
                </div>

                <div className="mt-3 bg-[#17100b] p-2.5 rounded-2xl border border-[#5c3a1e]">
                  <div className="text-[10px] text-amber-400 font-black mb-1 flex items-center gap-1">
                    <MapPin className="w-3 h-3 text-amber-400" />
                    <span>現在の居場所プロパティ:</span>
                  </div>
                  <div className="text-xs font-bold text-amber-200">
                    {clickedMember.currentLocationName || DEFAULT_OFFICE_ZONE.zoneName}
                  </div>
                  {clickedMember.customStatusMsg && (
                    <div className="mt-1.5 text-[11px] text-amber-300/90 italic bg-[#241a12] p-1.5 rounded-lg border border-[#4a3424]">
                      "{clickedMember.customStatusMsg}"
                    </div>
                  )}
                </div>

                <div className="mt-3 flex items-center gap-2">
                  <button
                    id="popup-btn-chat"
                    onClick={() => {
                      onSelectMember(clickedMember);
                      onNavigateTo('split-chat', clickedMember);
                    }}
                    className="flex-1 bg-amber-500 hover:bg-amber-400 text-slate-950 py-2 rounded-xl text-xs font-black flex items-center justify-center gap-1 shadow-md transition-transform active:scale-95 cursor-pointer"
                  >
                    <MessageSquare className="w-3.5 h-3.5" />
                    <span>チャットする</span>
                  </button>

                  <button
                    id="popup-btn-profile"
                    onClick={() => {
                      onSelectMember(clickedMember);
                      onNavigateTo('profile-booking', clickedMember);
                    }}
                    className="flex-1 bg-[#3a2517] hover:bg-[#4d321f] text-amber-200 border border-amber-500/50 py-2 rounded-xl text-xs font-bold flex items-center justify-center gap-1 transition-colors cursor-pointer"
                  >
                    <Calendar className="w-3.5 h-3.5" />
                    <span>予定 / 1on1</span>
                  </button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>

      {/* 画面下部のオフィス案内・居場所ステータス */}
      <div className="bg-[#241a12] border-t-2 border-[#5c3a1e] px-6 py-2 flex items-center justify-between text-xs text-amber-100 z-30 shadow-xl">
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-amber-400 animate-ping" />
            <span className="font-black text-amber-400">現在地:</span>
            <span className="bg-[#17100b] px-2.5 py-0.5 rounded-md text-[11px] font-mono text-amber-200 border border-amber-600">
              {selfMember.currentLocationName || DEFAULT_OFFICE_ZONE.zoneName} (X: {Math.round(selfMember.position.x)}, Y: {Math.round(selfMember.position.y)})
            </span>
          </div>

          {nearMembers.length > 0 ? (
            <div className="flex items-center gap-1.5 text-emerald-300 bg-emerald-950/80 border border-emerald-500 px-3 py-1 rounded-xl text-xs font-black shadow-sm animate-pulse">
              <Volume2 className="w-4 h-4 text-emerald-400" />
              <span>{nearMembers.map((m) => m.name).join('、')} と接続中（空間音声オン）</span>
            </div>
          ) : (
            <div className="text-amber-300/60 text-[11px] hidden sm:block">
              メンバー同士が近づくと自動的に空間音声通話が接続されます
            </div>
          )}
        </div>

        <button
          onClick={() => onNavigateTo('split-chat')}
          className="flex items-center gap-1.5 text-xs text-slate-950 bg-amber-400 hover:bg-amber-300 font-black px-3.5 py-1.5 rounded-xl transition-all shadow-md cursor-pointer active:scale-95"
        >
          <span>2枚目：チャット画面へ</span>
          <ChevronRight className="w-3.5 h-3.5 text-slate-950" />
        </button>
      </div>

      {/* キャラクター / アバター選択モーダル */}
      <CharacterAvatarPickerModal
        isOpen={isAvatarModalOpen}
        onClose={() => setIsAvatarModalOpen(false)}
        selfMember={selfMember}
        onUpdateSelfMember={onUpdateSelfMember}
      />
    </div>
  );
};
