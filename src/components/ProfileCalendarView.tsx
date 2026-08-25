import React, { useState } from 'react';
import { Member, Booking, TimeSlot, PageType } from '../types';
import { 
  Calendar, 
  Clock, 
  User, 
  Briefcase, 
  MapPin, 
  Mail, 
  Slack, 
  Sparkles, 
  CheckCircle, 
  Check, 
  CalendarCheck, 
  Video, 
  MessageSquare, 
  ChevronLeft, 
  ChevronRight, 
  Plus, 
  Tag, 
  Coffee, 
  Heart, 
  Layers,
  Building,
  Trash2,
  ExternalLink
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

interface ProfileCalendarViewProps {
  members: Member[];
  selfMember: Member;
  selectedMember: Member;
  onSelectMember: (member: Member) => void;
  bookings: Booking[];
  onCreateBooking: (newBooking: Omit<Booking, 'id' | 'createdAt'>) => void;
  onCancelBooking: (bookingId: string) => void;
  onNavigateTo: (page: PageType, targetMember?: Member) => void;
}

export const ProfileCalendarView: React.FC<ProfileCalendarViewProps> = ({
  members,
  selfMember,
  selectedMember,
  onSelectMember,
  bookings,
  onCreateBooking,
  onCancelBooking,
  onNavigateTo,
}) => {
  // カレンダー予約用ステート
  const [selectedDate, setSelectedDate] = useState<string>('2026-08-24');
  const [selectedSlot, setSelectedSlot] = useState<string | null>(null);
  const [meetingType, setMeetingType] = useState<'casual' | '1on1' | 'review' | 'deep'>('1on1');
  const [meetingTitle, setMeetingTitle] = useState<string>('ovice 1on1 ミーティング');
  const [meetingNotes, setMeetingNotes] = useState<string>('');
  const [showSuccessModal, setShowSuccessModal] = useState<boolean>(false);
  const [activeTab, setActiveTab] = useState<'booking' | 'scheduled'>('booking');

  // 選択中メンバーの該当日のスロット
  const availableSlots = selectedMember.availableSlots.filter((slot) => slot.date === selectedDate);

  // 予約作成ハンドラ
  const handleConfirmBooking = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedSlot) return;

    onCreateBooking({
      memberId: selectedMember.id,
      memberName: selectedMember.name,
      memberAvatar: selectedMember.avatar,
      date: selectedDate,
      time: selectedSlot,
      title: meetingTitle || `${selectedMember.name} との1on1`,
      meetingType,
      location: `ovice バーチャル空間 (ラウンジ・個別ブース)`,
      notes: meetingNotes,
    });

    setShowSuccessModal(true);
    setSelectedSlot(null);
    setMeetingNotes('');
  };

  // 選択中メンバーとの既存予約
  const memberBookings = bookings.filter((b) => b.memberId === selectedMember.id);

  const meetingTypesConfig = [
    { id: 'casual' as const, label: '15分 雑談・クイック相談', badge: '15min', icon: Coffee, color: 'bg-amber-50 text-amber-700 border-amber-200' },
    { id: '1on1' as const, label: '30分 定期1on1 / 相談', badge: '30min', icon: User, color: 'bg-blue-50 text-blue-700 border-blue-200' },
    { id: 'review' as const, label: '45分 デザイン・仕様レビュー', badge: '45min', icon: Layers, color: 'bg-purple-50 text-purple-700 border-purple-200' },
    { id: 'deep' as const, label: '60分 戦略ディスカッション', badge: '60min', icon: Sparkles, color: 'bg-emerald-50 text-emerald-700 border-emerald-200' },
  ];

  return (
    <div className="w-full h-[calc(100vh-4rem)] bg-slate-100 flex flex-col overflow-y-auto select-none">
      {/* 上部：メンバー切り替えカルーセルバー */}
      <div className="bg-white border-b border-slate-200 px-6 py-3 shrink-0 shadow-2xs">
        <div className="max-w-6xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">メンバーを選択:</span>
            <div className="flex items-center gap-2 overflow-x-auto py-1">
              {members
                .filter((m) => m.id !== selfMember.id)
                .map((m) => {
                  const isSelected = m.id === selectedMember.id;
                  return (
                    <button
                      key={m.id}
                      onClick={() => onSelectMember(m)}
                      className={`flex items-center gap-2 px-3 py-1.5 rounded-xl border text-xs font-semibold transition-all duration-150 ${
                        isSelected
                          ? 'bg-indigo-50 border-indigo-500 text-indigo-900 ring-2 ring-indigo-300 shadow-xs'
                          : 'bg-slate-50 border-slate-200 text-slate-700 hover:bg-slate-100'
                      }`}
                    >
                      <img
                        src={m.avatar}
                        alt={m.name}
                        className="w-5 h-5 rounded-full object-cover"
                      />
                      <span>{m.name}</span>
                      <span className="text-[10px]">{m.status.emoji}</span>
                    </button>
                  );
                })}
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => onNavigateTo('split-chat', selectedMember)}
              className="flex items-center gap-1 text-xs text-blue-600 bg-blue-50 hover:bg-blue-100 font-bold px-3 py-1.5 rounded-lg border border-blue-200 transition-colors"
            >
              <MessageSquare className="w-3.5 h-3.5" />
              <span>{selectedMember.name} とチャットする</span>
            </button>
          </div>
        </div>
      </div>

      {/* メインエリア：左（プロフィール） × 右（カレンダー予約） */}
      <div className="max-w-6xl mx-auto w-full p-4 sm:p-6 grid grid-cols-1 lg:grid-cols-12 gap-6 flex-1">
        {/* ===================== 【左カラム：相手のプロフィール詳細】 ===================== */}
        <div className="lg:col-span-5 flex flex-col gap-5">
          {/* プロフィールメインカード */}
          <div className="bg-white rounded-3xl p-6 border border-slate-200/90 shadow-sm relative overflow-hidden">
            {/* 上部グラデーションバナー */}
            <div className="absolute top-0 left-0 right-0 h-24 bg-linear-to-r from-blue-600 via-indigo-600 to-purple-600" />

            <div className="relative pt-8 flex flex-col items-center text-center">
              {/* アバター */}
              <div className="relative">
                <img
                  src={selectedMember.avatar}
                  alt={selectedMember.name}
                  className="w-24 h-24 rounded-full object-cover ring-4 ring-white shadow-xl bg-white"
                  referrerPolicy="no-referrer"
                />
                <span
                  className="absolute bottom-1 right-1 w-5 h-5 rounded-full border-2 border-white flex items-center justify-center shadow-sm"
                  style={{ backgroundColor: selectedMember.status.color }}
                  title={selectedMember.status.label}
                />
              </div>

              {/* 氏名 ＆ 役職 */}
              <h2 className="text-xl font-extrabold text-slate-900 mt-3 flex items-center gap-1.5">
                {selectedMember.name}
                <span className="text-sm font-normal text-slate-400">({selectedMember.nameEn})</span>
              </h2>
              <p className="text-xs font-bold text-indigo-600 mt-0.5">{selectedMember.role}</p>
              <p className="text-xs text-slate-500 font-medium">{selectedMember.department}</p>

              {/* ステータスバッジ */}
              <div className="mt-3 flex items-center gap-1.5 bg-slate-50 border border-slate-200 px-3 py-1 rounded-full text-xs font-semibold text-slate-700">
                <span>{selectedMember.status.emoji}</span>
                <span>{selectedMember.status.label}</span>
                {selectedMember.customStatusMsg && (
                  <span className="text-slate-500 font-normal text-[11px] truncate max-w-[180px]">
                    · {selectedMember.customStatusMsg}
                  </span>
                )}
              </div>
            </div>

            {/* 自己紹介 (Bio) */}
            <div className="mt-6 pt-5 border-t border-slate-100">
              <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2 flex items-center gap-1">
                <User className="w-3.5 h-3.5 text-slate-400" />
                プロフィール & 自己紹介
              </h3>
              <p className="text-xs sm:text-sm text-slate-700 leading-relaxed font-medium">
                {selectedMember.bio}
              </p>
            </div>

            {/* スキル・専門領域 */}
            <div className="mt-5 pt-5 border-t border-slate-100">
              <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2 flex items-center gap-1">
                <Tag className="w-3.5 h-3.5 text-slate-400" />
                専門スキル & 得意領域
              </h3>
              <div className="flex flex-wrap gap-1.5">
                {selectedMember.skills.map((skill, idx) => (
                  <span
                    key={idx}
                    className="text-[11px] font-semibold bg-indigo-50 text-indigo-700 border border-indigo-100 px-2.5 py-1 rounded-lg"
                  >
                    {skill}
                  </span>
                ))}
              </div>
            </div>

            {/* 趣味・関心 */}
            <div className="mt-5 pt-5 border-t border-slate-100">
              <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2 flex items-center gap-1">
                <Heart className="w-3.5 h-3.5 text-rose-400" />
                趣味 & 関心事
              </h3>
              <div className="flex flex-wrap gap-1.5">
                {selectedMember.hobbies.map((hobby, idx) => (
                  <span
                    key={idx}
                    className="text-[11px] font-semibold bg-slate-100 text-slate-700 px-2.5 py-1 rounded-lg"
                  >
                    {hobby}
                  </span>
                ))}
              </div>
            </div>

            {/* 稼働時間・タイムゾーン・連絡先 */}
            <div className="mt-5 pt-5 border-t border-slate-100 space-y-2 text-xs text-slate-600">
              <div className="flex items-center justify-between">
                <span className="flex items-center gap-1.5 text-slate-500">
                  <Clock className="w-3.5 h-3.5 text-slate-400" />
                  稼働時間:
                </span>
                <span className="font-semibold text-slate-800">{selectedMember.workingHours}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="flex items-center gap-1.5 text-slate-500">
                  <Slack className="w-3.5 h-3.5 text-slate-400" />
                  Slack Handle:
                </span>
                <span className="font-mono text-indigo-600 font-bold">{selectedMember.slackHandle}</span>
              </div>
            </div>
          </div>
        </div>

        {/* ===================== 【右カラム：カレンダー予約 ＆ 確定済みリスト】 ===================== */}
        <div className="lg:col-span-7 flex flex-col gap-5">
          {/* タブ切り替えバー */}
          <div className="bg-white p-1.5 rounded-2xl border border-slate-200 shadow-2xs flex items-center justify-between">
            <div className="flex items-center gap-1">
              <button
                id="tab-booking-form"
                onClick={() => setActiveTab('booking')}
                className={`flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold transition-all ${
                  activeTab === 'booking'
                    ? 'bg-indigo-600 text-white shadow-md shadow-indigo-600/30'
                    : 'text-slate-600 hover:bg-slate-100'
                }`}
              >
                <Calendar className="w-3.5 h-3.5" />
                <span>新規カレンダー予約</span>
              </button>

              <button
                id="tab-scheduled-list"
                onClick={() => setActiveTab('scheduled')}
                className={`flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold transition-all ${
                  activeTab === 'scheduled'
                    ? 'bg-indigo-600 text-white shadow-md shadow-indigo-600/30'
                    : 'text-slate-600 hover:bg-slate-100'
                }`}
              >
                <CalendarCheck className="w-3.5 h-3.5" />
                <span>確定済みミーティング ({memberBookings.length})</span>
              </button>
            </div>

            <span className="text-[11px] text-slate-400 pr-2">
              Timezone: JST (Tokyo)
            </span>
          </div>

          {/* タブ1：予約フォーム */}
          {activeTab === 'booking' ? (
            <div className="bg-white rounded-3xl p-6 border border-slate-200/90 shadow-sm flex flex-col gap-6">
              <div>
                <div className="flex items-center gap-2">
                  <h3 className="text-base font-bold text-slate-900">
                    {selectedMember.name} とのミーティング・1on1予約
                  </h3>
                  <span className="text-[10px] bg-blue-100 text-blue-700 font-bold px-2 py-0.5 rounded-full">
                    ovice連携
                  </span>
                </div>
                <p className="text-xs text-slate-500 mt-1">
                  空いている時間枠を選択し、ミーティングの予約を完了してください。
                </p>
              </div>

              {/* 日付セレクター */}
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-2">
                  1. 日付を選択してください
                </label>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                  {[
                    { date: '2026-08-24', label: '8/24 (月)', subtitle: '明日' },
                    { date: '2026-08-25', label: '8/25 (火)', subtitle: '明後日' },
                    { date: '2026-08-26', label: '8/26 (水)', subtitle: '水曜日' },
                    { date: '2026-08-27', label: '8/27 (木)', subtitle: '木曜日' },
                  ].map((d) => (
                    <button
                      key={d.date}
                      type="button"
                      onClick={() => {
                        setSelectedDate(d.date);
                        setSelectedSlot(null);
                      }}
                      className={`p-3 rounded-2xl border text-left transition-all ${
                        selectedDate === d.date
                          ? 'border-indigo-600 bg-indigo-50/70 ring-2 ring-indigo-200'
                          : 'border-slate-200 bg-slate-50 hover:bg-slate-100 text-slate-700'
                      }`}
                    >
                      <div className="text-xs font-extrabold text-slate-900">{d.label}</div>
                      <div className="text-[10px] text-slate-500 font-medium">{d.subtitle}</div>
                    </button>
                  ))}
                </div>
              </div>

              {/* ミーティング種別 */}
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-2">
                  2. ミーティング種別
                </label>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  {meetingTypesConfig.map((item) => {
                    const Icon = item.icon;
                    const isSelected = meetingType === item.id;
                    return (
                      <button
                        key={item.id}
                        type="button"
                        onClick={() => setMeetingType(item.id)}
                        className={`flex items-center justify-between p-3 rounded-2xl border text-xs font-semibold transition-all ${
                          isSelected
                            ? 'border-indigo-600 bg-indigo-50 ring-2 ring-indigo-200 text-indigo-950 font-bold'
                            : 'border-slate-200 bg-white hover:bg-slate-50 text-slate-700'
                        }`}
                      >
                        <div className="flex items-center gap-2">
                          <Icon className={`w-4 h-4 ${isSelected ? 'text-indigo-600' : 'text-slate-400'}`} />
                          <span>{item.label}</span>
                        </div>
                        <span className={`text-[10px] px-2 py-0.5 rounded-full font-bold border ${item.color}`}>
                          {item.badge}
                        </span>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* 空き時間枠 (Time Slots) */}
              <div>
                <div className="flex items-center justify-between mb-2">
                  <label className="text-xs font-bold text-slate-700">
                    3. 空き時間枠を選択 ({selectedDate})
                  </label>
                  <span className="text-[11px] text-emerald-600 font-bold flex items-center gap-1">
                    <span className="w-2 h-2 rounded-full bg-emerald-500" />
                    選択可能枠: {availableSlots.filter((s) => s.available).length}件
                  </span>
                </div>

                {availableSlots.length > 0 ? (
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                    {availableSlots.map((slot) => (
                      <button
                        key={slot.id}
                        type="button"
                        disabled={!slot.available}
                        onClick={() => setSelectedSlot(slot.time)}
                        className={`py-2.5 px-3 rounded-xl border text-xs font-bold transition-all flex items-center justify-between ${
                          !slot.available
                            ? 'bg-slate-100 border-slate-200 text-slate-400 cursor-not-allowed line-through'
                            : selectedSlot === slot.time
                            ? 'bg-indigo-600 text-white border-indigo-600 shadow-md shadow-indigo-600/30 ring-2 ring-indigo-300'
                            : 'bg-white hover:bg-indigo-50 hover:border-indigo-300 text-slate-800 border-slate-200'
                        }`}
                      >
                        <span className="flex items-center gap-1.5">
                          <Clock className="w-3.5 h-3.5" />
                          {slot.time}
                        </span>
                        {selectedSlot === slot.time && <Check className="w-3.5 h-3.5" />}
                      </button>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-6 bg-slate-50 rounded-2xl border border-slate-200 text-xs text-slate-500">
                    この日の空きスロットはありません。別の日付を選択してください。
                  </div>
                )}
              </div>

              {/* ミーティングタイトル＆メモ */}
              <div className="space-y-3 pt-2">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    4. ミーティングタイトル
                  </label>
                  <input
                    type="text"
                    id="input-meeting-title"
                    value={meetingTitle}
                    onChange={(e) => setMeetingTitle(e.target.value)}
                    placeholder="例: Q3 ロードマップ方針 1on1"
                    className="w-full bg-slate-50 border border-slate-200 focus:border-indigo-500 focus:bg-white text-xs rounded-xl px-3.5 py-2.5 text-slate-900 focus:outline-hidden"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    相談内容・共有アジェンダ (任意)
                  </label>
                  <textarea
                    id="input-meeting-notes"
                    value={meetingNotes}
                    onChange={(e) => setMeetingNotes(e.target.value)}
                    rows={2}
                    placeholder="事前に共有しておきたい資料URLやディスカッショントピックを入力..."
                    className="w-full bg-slate-50 border border-slate-200 focus:border-indigo-500 focus:bg-white text-xs rounded-xl p-3 text-slate-900 focus:outline-hidden resize-none"
                  />
                </div>
              </div>

              {/* 予約確定ボタン */}
              <button
                type="button"
                id="btn-submit-booking"
                disabled={!selectedSlot}
                onClick={handleConfirmBooking}
                className={`w-full py-3.5 rounded-2xl font-extrabold text-sm transition-all flex items-center justify-center gap-2 shadow-md ${
                  selectedSlot
                    ? 'bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white shadow-indigo-500/25 active:scale-98 cursor-pointer'
                    : 'bg-slate-200 text-slate-400 cursor-not-allowed'
                }`}
              >
                <CalendarCheck className="w-4 h-4" />
                <span>
                  {selectedSlot
                    ? `${selectedDate} ${selectedSlot} で予約を確定する`
                    : '時間枠を選択してください'}
                </span>
              </button>
            </div>
          ) : (
            /* タブ2：確定済みミーティング一覧 */
            <div className="bg-white rounded-3xl p-6 border border-slate-200/90 shadow-sm flex flex-col gap-4">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-base font-bold text-slate-900">
                    {selectedMember.name} との確定済みミーティング
                  </h3>
                  <p className="text-xs text-slate-500 mt-0.5">
                    ovice空間内の指定ロケーションで実施されます
                  </p>
                </div>
                <button
                  onClick={() => setActiveTab('booking')}
                  className="flex items-center gap-1 text-xs bg-indigo-50 text-indigo-700 font-bold px-3 py-1.5 rounded-xl border border-indigo-200"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>新規枠を予約</span>
                </button>
              </div>

              {memberBookings.length > 0 ? (
                <div className="space-y-3">
                  {memberBookings.map((b) => (
                    <div
                      key={b.id}
                      className="p-4 rounded-2xl border border-indigo-100 bg-linear-to-r from-indigo-50/50 to-white shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-3"
                    >
                      <div className="space-y-1">
                        <div className="flex items-center gap-2">
                          <span className="font-extrabold text-sm text-slate-900">{b.title}</span>
                          <span className="text-[10px] bg-indigo-100 text-indigo-800 font-bold px-2 py-0.5 rounded-full">
                            {b.meetingType}
                          </span>
                        </div>
                        <div className="flex items-center gap-3 text-xs text-slate-600">
                          <span className="flex items-center gap-1 font-semibold text-indigo-700">
                            <Calendar className="w-3.5 h-3.5" />
                            {b.date} {b.time}
                          </span>
                          <span className="text-slate-400">·</span>
                          <span className="flex items-center gap-1 text-slate-500">
                            <Building className="w-3.5 h-3.5" />
                            {b.location}
                          </span>
                        </div>
                        {b.notes && (
                          <p className="text-[11px] text-slate-500 mt-1 bg-white p-2 rounded-lg border border-slate-100">
                            メモ: {b.notes}
                          </p>
                        )}
                      </div>

                      <div className="flex items-center gap-2 shrink-0">
                        <button
                          onClick={() => onNavigateTo('office', selectedMember)}
                          className="flex items-center gap-1 bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold px-3 py-1.5 rounded-xl shadow-xs transition-colors"
                        >
                          <span>ovice空間へ行く</span>
                          <ExternalLink className="w-3 h-3" />
                        </button>

                        <button
                          onClick={() => onCancelBooking(b.id)}
                          className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors"
                          title="予約をキャンセル"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-12 bg-slate-50 rounded-2xl border border-slate-200">
                  <Calendar className="w-8 h-8 text-slate-300 mx-auto mb-2" />
                  <p className="text-xs font-bold text-slate-600">現在、確定済みのミーティングはありません</p>
                  <p className="text-[11px] text-slate-400 mt-0.5">
                    「新規カレンダー予約」タブから空き枠を選んで予約できます。
                  </p>
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      {/* 予約完了モーダル */}
      <AnimatePresence>
        {showSuccessModal && (
          <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 z-50">
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-white rounded-3xl p-6 max-w-md w-full shadow-2xl border border-slate-200 text-center"
            >
              <div className="w-14 h-14 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto mb-4">
                <CheckCircle className="w-8 h-8" />
              </div>

              <h3 className="text-lg font-bold text-slate-900">
                カレンダー予約が完了しました！
              </h3>
              <p className="text-xs text-slate-500 mt-1">
                {selectedMember.name} さんのoviceカレンダーに1on1が追加されました。
              </p>

              <div className="mt-4 p-3 bg-slate-50 rounded-2xl border border-slate-200 text-xs text-left space-y-1.5">
                <div className="flex justify-between">
                  <span className="text-slate-500">参加者:</span>
                  <span className="font-bold text-slate-800">{selectedMember.name} & あなた</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">日時:</span>
                  <span className="font-bold text-indigo-600">{selectedDate}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">場所:</span>
                  <span className="font-semibold text-slate-800">ovice バーチャルオフィス空間</span>
                </div>
              </div>

              <div className="mt-6 flex items-center gap-2">
                <button
                  onClick={() => {
                    setShowSuccessModal(false);
                    setActiveTab('scheduled');
                  }}
                  className="flex-1 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold py-2.5 rounded-xl transition-colors"
                >
                  予約一覧を見る
                </button>
                <button
                  onClick={() => {
                    setShowSuccessModal(false);
                    onNavigateTo('office');
                  }}
                  className="flex-1 bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold py-2.5 rounded-xl transition-colors shadow-md shadow-indigo-600/30"
                >
                  オフィス空間へ戻る
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};
