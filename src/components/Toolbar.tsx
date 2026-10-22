import React, { useState } from 'react';
import { UserStatus } from '../types';
import { USER_STATUSES } from '../constants/userStatus';
import { REACTION_EMOJIS } from '../constants/chat';
import {
  Mic,
  MicOff,
  Video,
  VideoOff,
  Volume2,
  VolumeX,
  MonitorUp,
  Smile,
  Megaphone,
} from 'lucide-react';

interface ToolbarProps {
  currentStatus: UserStatus;
  onStatusChange: (status: UserStatus) => void;
  onSendReaction: (emoji: string) => void;
  isMicOn: boolean;
  onToggleMic: () => void;
  isCameraOn: boolean;
  onToggleCamera: () => void;
  isSpeakerOn: boolean;
  onToggleSpeaker: () => void;
}

export const Toolbar: React.FC<ToolbarProps> = ({
  currentStatus,
  onStatusChange,
  onSendReaction,
  isMicOn,
  onToggleMic,
  isCameraOn,
  onToggleCamera,
  isSpeakerOn,
  onToggleSpeaker,
}) => {
  const [showStatusPicker, setShowStatusPicker] = useState(false);
  const [showReactionPicker, setShowReactionPicker] = useState(false);
  const [isScreenSharing, setIsScreenSharing] = useState(false);

  return (
    <div className="fixed bottom-4 left-1/2 -translate-x-1/2 z-40 flex items-center gap-2 bg-slate-900/90 backdrop-blur-md text-white px-3 py-2 rounded-2xl shadow-2xl border border-slate-700/70 select-none">
      {/* マイク */}
      <button
        id="toolbar-btn-mic"
        onClick={onToggleMic}
        className={`p-2.5 rounded-xl transition-all duration-150 flex items-center justify-center ${
          isMicOn
            ? 'bg-emerald-600 hover:bg-emerald-500 text-white shadow-md shadow-emerald-700/30'
            : 'bg-slate-800 hover:bg-slate-700 text-slate-300'
        }`}
        title={isMicOn ? 'マイクミュート' : 'マイクをオン'}
      >
        {isMicOn ? <Mic className="w-4 h-4 animate-pulse" /> : <MicOff className="w-4 h-4" />}
      </button>

      {/* カメラ */}
      <button
        id="toolbar-btn-camera"
        onClick={onToggleCamera}
        className={`p-2.5 rounded-xl transition-all duration-150 flex items-center justify-center ${
          isCameraOn
            ? 'bg-emerald-600 hover:bg-emerald-500 text-white shadow-md shadow-emerald-700/30'
            : 'bg-slate-800 hover:bg-slate-700 text-slate-300'
        }`}
        title={isCameraOn ? 'カメラオフ' : 'カメラをオン'}
      >
        {isCameraOn ? <Video className="w-4 h-4" /> : <VideoOff className="w-4 h-4" />}
      </button>

      {/* スピーカー/空間音響 */}
      <button
        id="toolbar-btn-speaker"
        onClick={onToggleSpeaker}
        className={`p-2.5 rounded-xl transition-all duration-150 flex items-center justify-center ${
          isSpeakerOn
            ? 'bg-slate-800 hover:bg-slate-700 text-blue-400'
            : 'bg-slate-800 hover:bg-slate-700 text-rose-400'
        }`}
        title={isSpeakerOn ? '空間音響オン' : '消音中'}
      >
        {isSpeakerOn ? <Volume2 className="w-4 h-4" /> : <VolumeX className="w-4 h-4" />}
      </button>

      {/* 画面共有 */}
      <button
        id="toolbar-btn-screenshare"
        onClick={() => setIsScreenSharing(!isScreenSharing)}
        className={`p-2.5 rounded-xl transition-all duration-150 flex items-center justify-center ${
          isScreenSharing
            ? 'bg-blue-600 hover:bg-blue-500 text-white ring-2 ring-blue-400'
            : 'bg-slate-800 hover:bg-slate-700 text-slate-300'
        }`}
        title="画面を共有"
      >
        <MonitorUp className="w-4 h-4" />
      </button>

      <div className="h-6 w-px bg-slate-700 mx-1" />

      {/* ステータス切り替えメニュー */}
      <div className="relative">
        <button
          id="toolbar-btn-status"
          onClick={() => {
            setShowStatusPicker(!showStatusPicker);
            setShowReactionPicker(false);
          }}
          className="flex items-center gap-2 bg-slate-800 hover:bg-slate-700 text-xs font-semibold px-3 py-2 rounded-xl transition-colors text-slate-200 border border-slate-700"
        >
          <span
            className="w-2.5 h-2.5 rounded-full inline-block"
            style={{ backgroundColor: currentStatus.color }}
          />
          <span className="max-w-[80px] truncate">{currentStatus.label}</span>
        </button>

        {showStatusPicker && (
          <div className="absolute bottom-14 left-0 w-44 bg-slate-800 border border-slate-700 rounded-xl p-1.5 shadow-2xl z-50 flex flex-col gap-1">
            {Object.values(USER_STATUSES).map((status) => (
              <button
                key={status.state}
                onClick={() => {
                  onStatusChange(status);
                  setShowStatusPicker(false);
                }}
                className={`flex items-center justify-between px-2.5 py-1.5 rounded-lg text-xs font-medium text-left transition-colors ${
                  currentStatus.state === status.state
                    ? 'bg-slate-700 text-white font-bold'
                    : 'text-slate-300 hover:bg-slate-700/60'
                }`}
              >
                <div className="flex items-center gap-2">
                  <span
                    className="w-2 h-2 rounded-full inline-block"
                    style={{ backgroundColor: status.color }}
                  />
                  <span>{status.label}</span>
                </div>
                <span>{status.emoji}</span>
              </button>
            ))}
          </div>
        )}
      </div>

      {/* リアクション / スタンプ */}
      <div className="relative">
        <button
          id="toolbar-btn-reaction"
          onClick={() => {
            setShowReactionPicker(!showReactionPicker);
            setShowStatusPicker(false);
          }}
          className="p-2.5 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-xl transition-colors flex items-center justify-center"
          title="絵文字リアクション"
        >
          <Smile className="w-4 h-4" />
        </button>

        {showReactionPicker && (
          <div className="absolute bottom-14 right-0 bg-slate-800 border border-slate-700 rounded-xl p-2 shadow-2xl z-50 grid grid-cols-4 gap-1.5">
            {REACTION_EMOJIS.map((emoji) => (
              <button
                key={emoji}
                onClick={() => {
                  onSendReaction(emoji);
                  setShowReactionPicker(false);
                }}
                className="w-8 h-8 flex items-center justify-center text-lg hover:bg-slate-700 rounded-lg hover:scale-125 transition-transform"
              >
                {emoji}
              </button>
            ))}
          </div>
        )}
      </div>

      {/* メガホン / 全体アナウンス */}
      <button
        id="toolbar-btn-megaphone"
        onClick={() => alert('メガホンモード：オフィス全体にアナウンスを放送します（シミュレーション）')}
        className="p-2.5 bg-slate-800 hover:bg-slate-700 text-amber-400 rounded-xl transition-colors flex items-center justify-center"
        title="メガホン放送 (全体アナウンス)"
      >
        <Megaphone className="w-4 h-4" />
      </button>
    </div>
  );
};
