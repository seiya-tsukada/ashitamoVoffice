import React, { useState, useEffect, useRef } from 'react';
import { Member, ChatMessage, PageType } from '../types';
import { 
  Send, 
  Smile, 
  Sparkles, 
  Bot, 
  Mic, 
  MicOff, 
  Volume2, 
  Radio, 
  Calendar, 
  User, 
  MessageSquare, 
  CheckCheck, 
  Clock,
  Play,
  RotateCcw,
  PlusCircle,
  HelpCircle,
  Video,
  Monitor
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { AUTO_REPLY_DELAY_MS, QUICK_MESSAGE_TEMPLATES, buildAutoReplies } from '../constants/chat';

interface SplitChatViewProps {
  members: Member[];
  selfMember: Member;
  chatMessages: ChatMessage[];
  onSendMessage: (content: string, isAutonomous?: boolean, targetSenderId?: string) => void;
  selectedMember: Member;
  onSelectMember: (member: Member) => void;
  onNavigateTo: (page: PageType, member?: Member) => void;
  onTriggerAutonomousPing: () => void;
  isAutoPingActive: boolean;
  onToggleAutoPing: () => void;
}

export const SplitChatView: React.FC<SplitChatViewProps> = ({
  members,
  selfMember,
  chatMessages,
  onSendMessage,
  selectedMember,
  onSelectMember,
  onNavigateTo,
  onTriggerAutonomousPing,
  isAutoPingActive,
  onToggleAutoPing,
}) => {
  const [inputMessage, setInputMessage] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // 自動スクロール
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [chatMessages, isTyping]);

  const handleSend = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!inputMessage.trim()) return;

    const userText = inputMessage;
    setInputMessage('');
    onSendMessage(userText, false);

    // 相手が自律的に返信するシミュレーション（1.2秒後）
    setIsTyping(true);
    setTimeout(() => {
      setIsTyping(false);
      const replies = buildAutoReplies(userText);
      const randomReply = replies[Math.floor(Math.random() * replies.length)];
      onSendMessage(randomReply, false, selectedMember.id);
    }, AUTO_REPLY_DELAY_MS);
  };

  return (
    <div className="w-full h-[calc(100vh-4rem)] flex flex-col md:flex-row bg-slate-100 overflow-hidden select-none">
      {/* ===================== 【左半分：アバター空間ビュー】 ===================== */}
      <div className="w-full md:w-1/2 h-1/2 md:h-full bg-slate-900 border-b md:border-b-0 md:border-r border-slate-800 flex flex-col relative overflow-hidden">
        {/* 左側ヘッダー */}
        <div className="bg-slate-800/90 backdrop-blur-md px-5 py-3 border-b border-slate-700/80 flex items-center justify-between z-20">
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse" />
            <span className="text-xs font-bold text-white uppercase tracking-wider">
              アバター対面・空間ビュー
            </span>
            <span className="text-[10px] bg-slate-700 text-slate-300 px-2 py-0.5 rounded-full">
              ovice Live Space
            </span>
          </div>

          {/* 会話相手のセレクター */}
          <div className="flex items-center gap-1.5 text-xs text-slate-300">
            <span className="text-[11px] text-slate-400">対面中:</span>
            <select
              value={selectedMember.id}
              onChange={(e) => {
                const found = members.find((m) => m.id === e.target.value);
                if (found) onSelectMember(found);
              }}
              className="bg-slate-700 text-white text-xs font-semibold py-1 px-2.5 rounded-lg border border-slate-600 focus:outline-hidden focus:ring-1 focus:ring-blue-400"
            >
              {members
                .filter((m) => m.id !== selfMember.id)
                .map((m) => (
                  <option key={m.id} value={m.id}>
                    {m.name} ({m.role.split(' ')[0]})
                  </option>
                ))}
            </select>
          </div>
        </div>

        {/* アバター対面ステージ (スタイリッシュなバーチャルブース) */}
        <div className="flex-1 relative flex flex-col items-center justify-center p-6 bg-radial from-slate-800 via-slate-900 to-slate-950 overflow-hidden">
          {/* 背景のグリッド＆音響ウェーブ */}
          <div 
            className="absolute inset-0 opacity-20 pointer-events-none"
            style={{
              backgroundImage: 'radial-gradient(#38BDF8 1px, transparent 1px)',
              backgroundSize: '28px 28px',
            }}
          />

          {/* 中央の空間オーディオ通信サークル */}
          <motion.div
            className="absolute rounded-full border-2 border-emerald-500/30 bg-emerald-500/5 pointer-events-none"
            style={{ width: '380px', height: '380px' }}
            animate={{ scale: [1, 1.05, 1], opacity: [0.3, 0.6, 0.3] }}
            transition={{ repeat: Infinity, duration: 3, ease: 'easeInOut' }}
          />

          {/* 対面アバターペア（左：自分 / 右：選択相手） */}
          <div className="relative z-10 flex items-center justify-center gap-12 sm:gap-20">
            {/* あなた (You) */}
            <div className="flex flex-col items-center">
              <div className="relative">
                <motion.div
                  className="w-24 h-24 sm:w-28 sm:h-28 rounded-full p-1 ring-4 ring-blue-500/80 shadow-2xl shadow-blue-500/30 bg-linear-to-tr from-blue-600 to-indigo-600 flex items-center justify-center"
                  whileHover={{ scale: 1.05 }}
                >
                  <img
                    src={selfMember.avatar}
                    alt={selfMember.name}
                    className="w-full h-full rounded-full object-cover"
                    referrerPolicy="no-referrer"
                  />
                </motion.div>
                <span
                  className="absolute bottom-1 right-1 w-5 h-5 rounded-full border-2 border-slate-900 flex items-center justify-center text-[10px] text-white font-bold"
                  style={{ backgroundColor: selfMember.status.color }}
                >
                  ★
                </span>
              </div>
              <div className="mt-3 text-center">
                <span className="bg-blue-600 text-white font-bold text-xs px-2.5 py-0.5 rounded-full shadow-md">
                  {selfMember.name}
                </span>
                <p className="text-[11px] text-slate-400 mt-0.5 font-medium">{selfMember.role}</p>
              </div>
            </div>

            {/* 中央のインタラクション・ステータスリンク */}
            <div className="flex flex-col items-center gap-2">
              <div className="flex items-center gap-1 text-emerald-400 font-mono text-xs bg-emerald-950/80 border border-emerald-500/40 px-3 py-1 rounded-full shadow-lg">
                <Volume2 className="w-3.5 h-3.5 animate-pulse" />
                <span>近接通信中</span>
              </div>
              <div className="w-16 sm:w-24 h-0.5 bg-linear-to-r from-blue-500 via-emerald-400 to-indigo-500 rounded-full" />
              <span className="text-[10px] text-slate-400">距離 1.2m</span>
            </div>

            {/* 会話相手のアバター */}
            <div className="flex flex-col items-center">
              <div className="relative">
                <motion.div
                  className="w-24 h-24 sm:w-28 sm:h-28 rounded-full p-1 ring-4 ring-indigo-500/80 shadow-2xl shadow-indigo-500/30 bg-linear-to-tr from-indigo-600 to-purple-600 flex items-center justify-center"
                  whileHover={{ scale: 1.05 }}
                >
                  <img
                    src={selectedMember.avatar}
                    alt={selectedMember.name}
                    className="w-full h-full rounded-full object-cover"
                    referrerPolicy="no-referrer"
                  />
                </motion.div>
                <span
                  className="absolute bottom-1 right-1 w-5 h-5 rounded-full border-2 border-slate-900"
                  style={{ backgroundColor: selectedMember.status.color }}
                  title={selectedMember.status.label}
                />
              </div>
              <div className="mt-3 text-center">
                <span className="bg-slate-700 text-white font-bold text-xs px-2.5 py-0.5 rounded-full shadow-md border border-slate-600">
                  {selectedMember.name}
                </span>
                <p className="text-[11px] text-slate-400 mt-0.5 font-medium">{selectedMember.role}</p>
              </div>
            </div>
          </div>

          {/* 相手のステータスメッセージ吹き出し */}
          {selectedMember.customStatusMsg && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="mt-6 bg-slate-800/90 border border-slate-700 text-slate-200 text-xs px-4 py-2 rounded-2xl max-w-sm text-center shadow-lg backdrop-blur-md flex items-center gap-2"
            >
              <span>{selectedMember.status.emoji}</span>
              <span className="truncate">{selectedMember.customStatusMsg}</span>
            </motion.div>
          )}

          {/* 画面3（プロフィール＆予約）への誘導クイックボタン */}
          <div className="mt-6 flex items-center gap-3">
            <button
              id="btn-split-to-profile"
              onClick={() => onNavigateTo('profile-booking', selectedMember)}
              className="flex items-center gap-1.5 bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold px-4 py-2 rounded-xl shadow-lg shadow-indigo-600/30 transition-all active:scale-95"
            >
              <Calendar className="w-3.5 h-3.5" />
              <span>{selectedMember.name} のカレンダー1on1予約を見る ▶</span>
            </button>
          </div>
        </div>

        {/* 左側フッター：オフィス全体アバターミニトレイ */}
        <div className="bg-slate-950/80 px-4 py-2.5 border-t border-slate-800 flex items-center justify-between text-xs text-slate-400">
          <span className="text-[11px]">他のメンバーに切り替え:</span>
          <div className="flex items-center gap-2">
            {members
              .filter((m) => m.id !== selfMember.id)
              .map((m) => (
                <button
                  key={m.id}
                  onClick={() => onSelectMember(m)}
                  className={`relative p-0.5 rounded-full transition-transform hover:scale-115 ${
                    selectedMember.id === m.id ? 'ring-2 ring-blue-400 scale-110' : 'opacity-70'
                  }`}
                  title={`${m.name} (${m.role})`}
                >
                  <img
                    src={m.avatar}
                    alt={m.name}
                    className="w-7 h-7 rounded-full object-cover"
                  />
                  <span
                    className="absolute bottom-0 right-0 w-2 h-2 rounded-full border border-slate-900"
                    style={{ backgroundColor: m.status.color }}
                  />
                </button>
              ))}
          </div>
        </div>
      </div>

      {/* ===================== 【右半分：チャット画面 (自律通知＋チャット欄)】 ===================== */}
      <div className="w-full md:w-1/2 h-1/2 md:h-full bg-white flex flex-col relative">
        {/* チャット上部ヘッダー */}
        <div className="px-5 py-3 bg-white border-b border-slate-200 flex items-center justify-between shadow-2xs z-10">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-full bg-indigo-50 border border-indigo-200 flex items-center justify-center text-indigo-600">
              <MessageSquare className="w-4 h-4" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-bold text-sm text-slate-900">
                  {selectedMember.name} とのチャット
                </span>
                <span className="text-[10px] bg-emerald-100 text-emerald-800 font-semibold px-2 py-0.5 rounded-full">
                  リアルタイム連携
                </span>
              </div>
              <p className="text-[11px] text-slate-500">
                ovice近接チャット ＆ 自律的コミュニケーション
              </p>
            </div>
          </div>

          {/* 自律コミュニケーション設定トグル＆シミュレートボタン */}
          <div className="flex items-center gap-2">
            <button
              id="btn-trigger-autonomous"
              onClick={onTriggerAutonomousPing}
              className="flex items-center gap-1 text-[11px] bg-indigo-50 hover:bg-indigo-100 text-indigo-700 font-bold px-2.5 py-1.5 rounded-lg border border-indigo-200 shadow-2xs transition-colors"
              title="チームメンバーからの自律的な話しかけを1件受信します"
            >
              <Bot className="w-3.5 h-3.5" />
              <span>自律発話を受信</span>
            </button>

            <button
              id="btn-toggle-autoping"
              onClick={onToggleAutoPing}
              className={`flex items-center gap-1 text-[11px] px-2 py-1.5 rounded-lg font-semibold border transition-colors ${
                isAutoPingActive
                  ? 'bg-emerald-50 text-emerald-700 border-emerald-300'
                  : 'bg-slate-100 text-slate-500 border-slate-200'
              }`}
              title={isAutoPingActive ? '自律受信: 自動ON' : '自律受信: 手動のみ'}
            >
              <Radio className={`w-3 h-3 ${isAutoPingActive ? 'animate-pulse text-emerald-600' : ''}`} />
              <span className="hidden sm:inline">{isAutoPingActive ? '自動ON' : '自動OFF'}</span>
            </button>
          </div>
        </div>

        {/* チャットメッセージ履歴エリア */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-5 space-y-4 bg-slate-50/50">
          {/* 自律機能の案内バナー */}
          <div className="bg-linear-to-r from-blue-50 to-indigo-50 border border-blue-200/80 rounded-xl p-3 text-xs text-blue-900 flex items-start gap-2 shadow-2xs">
            <Sparkles className="w-4 h-4 text-blue-600 shrink-0 mt-0.5" />
            <div>
              <span className="font-bold">自律コミュニケーション稼働中:</span>
              <p className="text-[11px] text-blue-700 mt-0.5">
                チームメンバーやAIボットが状況に応じて自律的に話しかけてきます。下の入力欄から自由に返信できます。
              </p>
            </div>
          </div>

          {/* メッセージリスト */}
          {chatMessages.map((msg) => {
            const isMsgSelf = msg.isSelf || msg.senderId === selfMember.id;
            return (
              <motion.div
                key={msg.id}
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                className={`flex gap-3 ${isMsgSelf ? 'flex-row-reverse' : 'flex-row'}`}
              >
                {/* 送信者アバター */}
                <img
                  src={msg.senderAvatar}
                  alt={msg.senderName}
                  className="w-8 h-8 rounded-full object-cover shrink-0 shadow-xs border border-slate-200"
                  referrerPolicy="no-referrer"
                />

                <div className={`max-w-[78%] flex flex-col ${isMsgSelf ? 'items-end' : 'items-start'}`}>
                  {/* 送信者名 ＆ 自律バッジ ＆ 時間 */}
                  <div className="flex items-center gap-1.5 mb-1 px-1">
                    <span className="text-[11px] font-bold text-slate-700">{msg.senderName}</span>
                    {msg.isAutonomous && (
                      <span className="text-[9px] bg-purple-100 text-purple-700 font-bold px-1.5 py-0.2 rounded border border-purple-200 flex items-center gap-0.5">
                        <Bot className="w-2.5 h-2.5" />
                        自律メッセージ
                      </span>
                    )}
                    <span className="text-[10px] text-slate-400">{msg.timestamp}</span>
                  </div>

                  {/* メッセージ吹き出し */}
                  <div
                    className={`px-4 py-2.5 rounded-2xl text-xs sm:text-sm leading-relaxed shadow-xs ${
                      isMsgSelf
                        ? 'bg-blue-600 text-white rounded-tr-none'
                        : msg.isAutonomous
                        ? 'bg-purple-50 text-purple-950 border border-purple-200 rounded-tl-none font-medium'
                        : 'bg-white text-slate-800 border border-slate-200/80 rounded-tl-none'
                    }`}
                  >
                    {msg.content}
                  </div>

                {/* リアクション */}
                {msg.reactions && msg.reactions.length > 0 && (
                  <div className="flex items-center gap-1 mt-1">
                    {msg.reactions.map((r, i) => (
                      <span
                        key={i}
                        className={`text-[10px] px-1.5 py-0.5 rounded-full border ${
                          r.userReacted
                            ? 'bg-blue-50 border-blue-200 text-blue-700 font-bold'
                            : 'bg-white border-slate-200 text-slate-600'
                        }`}
                      >
                        {r.emoji} {r.count}
                      </span>
                    ))}
                  </div>
                )}
              </div>
            </motion.div>
          );
        })}

          {/* タイピング中アニメーション */}
          {isTyping && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="flex items-center gap-2 text-xs text-slate-500 px-2 py-1"
            >
              <img
                src={selectedMember.avatar}
                alt=""
                className="w-6 h-6 rounded-full object-cover"
              />
              <div className="bg-white border border-slate-200 px-3 py-1.5 rounded-2xl flex items-center gap-1 shadow-2xs">
                <span className="text-[11px] text-slate-600 font-medium">{selectedMember.name} が入力中</span>
                <span className="inline-block w-1.5 h-1.5 rounded-full bg-slate-400 animate-bounce" />
                <span className="inline-block w-1.5 h-1.5 rounded-full bg-slate-400 animate-bounce delay-100" />
                <span className="inline-block w-1.5 h-1.5 rounded-full bg-slate-400 animate-bounce delay-200" />
              </div>
            </motion.div>
          )}

          <div ref={messagesEndRef} />
        </div>

        {/* クイック定型文チップ */}
        <div className="px-4 py-1.5 bg-white border-t border-slate-100 flex items-center gap-1.5 overflow-x-auto text-[11px]">
          <span className="text-slate-400 text-[10px] shrink-0 font-medium">クイック送信:</span>
          {QUICK_MESSAGE_TEMPLATES.map((tmpl, idx) => (
            <button
              key={idx}
              onClick={() => onSendMessage(tmpl, false)}
              className="shrink-0 bg-slate-100 hover:bg-slate-200 text-slate-700 px-2.5 py-1 rounded-full border border-slate-200/80 transition-colors font-medium"
            >
              {tmpl}
            </button>
          ))}
        </div>

        {/* チャット入力欄 (ユーザー発信) */}
        <form
          onSubmit={handleSend}
          className="p-3 sm:p-4 bg-white border-t border-slate-200 flex items-center gap-2 select-text"
        >
          <input
            type="text"
            id="chat-input-field"
            value={inputMessage}
            onChange={(e) => setInputMessage(e.target.value)}
            placeholder={`${selectedMember.name} にメッセージを送信... (Enterで送信)`}
            className="flex-1 bg-slate-50 border border-slate-200 focus:border-blue-500 focus:bg-white text-xs sm:text-sm rounded-xl px-4 py-2.5 text-slate-900 focus:outline-hidden focus:ring-2 focus:ring-blue-100 transition-all"
          />

          <button
            type="submit"
            id="btn-send-message"
            disabled={!inputMessage.trim()}
            className={`p-2.5 rounded-xl font-bold text-xs transition-all flex items-center justify-center shrink-0 ${
              inputMessage.trim()
                ? 'bg-blue-600 hover:bg-blue-700 text-white shadow-md shadow-blue-500/20 active:scale-95 cursor-pointer'
                : 'bg-slate-100 text-slate-300 cursor-not-allowed'
            }`}
            title="メッセージを送信"
          >
            <Send className="w-4 h-4" />
          </button>
        </form>
      </div>
    </div>
  );
};
