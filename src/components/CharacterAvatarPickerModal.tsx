import React, { useState } from 'react';
import { Member, RpgJobClass, AvatarMode } from '../types';
import { CHARACTER_PRESETS, PHOTO_AVATAR_OPTIONS, CharacterPreset } from '../data/characterPresets';
import { RpgCharacterSprite } from './RpgCharacterSprite';
import { Sparkles, User, Image, Check, Shuffle, X } from 'lucide-react';
import { motion } from 'motion/react';

interface CharacterAvatarPickerModalProps {
  isOpen: boolean;
  onClose: () => void;
  selfMember: Member;
  onUpdateSelfMember: (updated: Partial<Member>) => void;
}

export const CharacterAvatarPickerModal: React.FC<CharacterAvatarPickerModalProps> = ({
  isOpen,
  onClose,
  selfMember,
  onUpdateSelfMember,
}) => {
  const [activeTab, setActiveTab] = useState<AvatarMode>(selfMember.avatarMode || 'sprite');
  const [selectedClass, setSelectedClass] = useState<RpgJobClass>(selfMember.rpgClass || 'hero');
  const [selectedAvatarUrl, setSelectedAvatarUrl] = useState<string>(selfMember.avatar);

  if (!isOpen) return null;

  const handleSave = () => {
    onUpdateSelfMember({
      avatarMode: activeTab,
      rpgClass: selectedClass,
      avatar: selectedAvatarUrl,
    });
    onClose();
  };

  const handleRandomize = () => {
    const randomPreset = CHARACTER_PRESETS[Math.floor(Math.random() * CHARACTER_PRESETS.length)];
    setSelectedClass(randomPreset.jobClass);
    if (activeTab === 'icon') {
      const randomPhoto = PHOTO_AVATAR_OPTIONS[Math.floor(Math.random() * PHOTO_AVATAR_OPTIONS.length)];
      setSelectedAvatarUrl(randomPhoto.url);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm select-none">
      <motion.div
        initial={{ opacity: 0, scale: 0.92, y: 15 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.92 }}
        className="bg-[#1f1710] border-3 border-amber-500 rounded-3xl p-6 shadow-2xl max-w-lg w-full text-amber-100 font-sans relative"
      >
        {/* ヘッダー */}
        <div className="flex items-center justify-between border-b-2 border-[#4a3424] pb-3">
          <div className="flex items-center gap-2">
            <span className="p-2 rounded-xl bg-amber-500 text-slate-950 font-black shadow-md">
              <Sparkles className="w-5 h-5" />
            </span>
            <div>
              <h2 className="text-base font-black text-amber-200">アバター＆キャラクター選択</h2>
              <p className="text-xs text-amber-400/80">オフィス空間に表示する外見をカスタマイズ</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-[#2e1f14] hover:bg-[#4a3424] text-amber-300 flex items-center justify-center transition-colors cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* 表示モード切り替えタブ (SFCドット絵キャラクター or 丸型アバターアイコン) */}
        <div className="mt-4 grid grid-cols-2 gap-2 bg-[#120d09] p-1.5 rounded-2xl border border-[#4a3424]">
          <button
            onClick={() => setActiveTab('sprite')}
            className={`flex items-center justify-center gap-2 py-2.5 px-3 rounded-xl font-bold text-xs transition-all cursor-pointer ${
              activeTab === 'sprite'
                ? 'bg-amber-500 text-slate-950 shadow-md font-black'
                : 'text-amber-300/70 hover:text-amber-200 hover:bg-[#2e1f14]'
            }`}
          >
            <span className="text-base">🧙‍♂️</span>
            <span>SFCドット絵キャラクター</span>
          </button>
          <button
            onClick={() => setActiveTab('icon')}
            className={`flex items-center justify-center gap-2 py-2.5 px-3 rounded-xl font-bold text-xs transition-all cursor-pointer ${
              activeTab === 'icon'
                ? 'bg-amber-500 text-slate-950 shadow-md font-black'
                : 'text-amber-300/70 hover:text-amber-200 hover:bg-[#2e1f14]'
            }`}
          >
            <User className="w-4 h-4" />
            <span>丸型アバターアイコン</span>
          </button>
        </div>

        {/* プレビュー表示エリア */}
        <div className="mt-4 bg-[#140e0a] border-2 border-amber-600/70 rounded-2xl p-3.5 flex items-center justify-between">
          <div className="flex items-center gap-3">
            {/* アバタープレビュー */}
            <div className="w-16 h-16 rounded-2xl bg-[#2e1f14] border-2 border-amber-400 flex items-center justify-center overflow-hidden shadow-inner relative">
              {activeTab === 'sprite' ? (
                <RpgCharacterSprite jobClass={selectedClass} scale={1.15} isSelf={true} />
              ) : (
                <img
                  src={selectedAvatarUrl}
                  alt="avatar preview"
                  className="w-14 h-14 rounded-full object-cover border-2 border-amber-300"
                  referrerPolicy="no-referrer"
                />
              )}
            </div>
            <div>
              <span className="text-[10px] bg-amber-950 text-amber-300 font-mono font-bold px-2 py-0.5 rounded border border-amber-700">
                CURRENT SELECTION
              </span>
              <div className="font-black text-sm text-white mt-1">
                {activeTab === 'sprite'
                  ? CHARACTER_PRESETS.find((p) => p.jobClass === selectedClass)?.name
                  : '丸型プロフィール写真'}
              </div>
              <p className="text-[11px] text-amber-300/80">
                {activeTab === 'sprite'
                  ? CHARACTER_PRESETS.find((p) => p.jobClass === selectedClass)?.description
                  : '選択した写真アイコンがオフィス空間にプロットされます'}
              </p>
            </div>
          </div>

          <button
            onClick={handleRandomize}
            className="flex items-center gap-1 bg-[#2e1f14] hover:bg-[#4a3424] text-amber-300 border border-amber-600 text-[11px] font-bold px-2.5 py-1.5 rounded-xl transition-all shadow-sm cursor-pointer"
            title="ランダムに変更"
          >
            <Shuffle className="w-3.5 h-3.5" />
            <span>おまかせ</span>
          </button>
        </div>

        {/* 選択肢リスト */}
        {activeTab === 'sprite' ? (
          <div className="mt-4">
            <label className="text-xs font-bold text-amber-300 mb-2 block">
              職業クラスを選択 (全9種類):
            </label>
            <div className="grid grid-cols-3 gap-2.5 max-h-56 overflow-y-auto pr-1">
              {CHARACTER_PRESETS.map((preset) => {
                const isSelected = selectedClass === preset.jobClass;
                return (
                  <div
                    key={preset.id}
                    onClick={() => setSelectedClass(preset.jobClass)}
                    className={`p-2.5 rounded-2xl border-2 flex flex-col items-center justify-between gap-1.5 cursor-pointer transition-all ${
                      isSelected
                        ? 'bg-amber-500/20 border-amber-400 shadow-lg scale-[1.03]'
                        : 'bg-[#2a1b12] border-[#4a3424] hover:border-amber-600 hover:bg-[#342217]'
                    }`}
                  >
                    <div className="w-12 h-14 flex items-center justify-center">
                      <RpgCharacterSprite jobClass={preset.jobClass} scale={0.9} />
                    </div>
                    <div className="text-center w-full">
                      <div className={`text-[11px] font-black truncate ${isSelected ? 'text-amber-300' : 'text-stone-200'}`}>
                        {preset.name}
                      </div>
                      <div className="text-[9px] text-amber-400/70 font-mono">
                        Lv.{preset.level}
                      </div>
                    </div>
                    {isSelected && (
                      <div className="bg-amber-500 text-slate-950 rounded-full p-0.5 shadow-md">
                        <Check className="w-3 h-3 stroke-[3]" />
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        ) : (
          <div className="mt-4">
            <label className="text-xs font-bold text-amber-300 mb-2 block">
              アバターアイコン写真を選択:
            </label>
            <div className="grid grid-cols-4 gap-2.5 max-h-56 overflow-y-auto pr-1">
              {PHOTO_AVATAR_OPTIONS.map((photo) => {
                const isSelected = selectedAvatarUrl === photo.url;
                return (
                  <div
                    key={photo.id}
                    onClick={() => setSelectedAvatarUrl(photo.url)}
                    className={`p-2 rounded-2xl border-2 flex flex-col items-center gap-1.5 cursor-pointer transition-all ${
                      isSelected
                        ? 'bg-amber-500/20 border-amber-400 shadow-lg scale-[1.03]'
                        : 'bg-[#2a1b12] border-[#4a3424] hover:border-amber-600 hover:bg-[#342217]'
                    }`}
                  >
                    <img
                      src={photo.url}
                      alt={photo.label}
                      className="w-12 h-12 rounded-full object-cover border border-amber-400 shadow-sm"
                      referrerPolicy="no-referrer"
                    />
                    <span className="text-[9.5px] font-bold text-stone-200 text-center truncate w-full">
                      {photo.label}
                    </span>
                    {isSelected && (
                      <div className="bg-amber-500 text-slate-950 rounded-full p-0.5 shadow-md">
                        <Check className="w-3 h-3 stroke-[3]" />
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* フッターアクションボタン */}
        <div className="mt-5 flex items-center justify-end gap-2 border-t-2 border-[#4a3424] pt-4">
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-xl text-xs font-bold text-amber-300 hover:text-white bg-[#2e1f14] hover:bg-[#4a3424] transition-colors cursor-pointer"
          >
            キャンセル
          </button>
          <button
            id="btn-save-character-avatar"
            onClick={handleSave}
            className="px-6 py-2 rounded-xl text-xs font-black text-slate-950 bg-amber-500 hover:bg-amber-400 shadow-lg transition-all active:scale-95 cursor-pointer flex items-center gap-1.5"
          >
            <Check className="w-4 h-4 stroke-[3]" />
            <span>このアバターを適用</span>
          </button>
        </div>
      </motion.div>
    </div>
  );
};
