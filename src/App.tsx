import React, { useState, useEffect } from 'react';
import { PageType, Member, ChatMessage, Booking, UserStatus } from './types';
import { INITIAL_MEMBERS, INITIAL_BOOKINGS, AUTONOMOUS_MESSAGES_POOL } from './data/mockData';
import { OFFICE_ZONES } from './constants/zones';
import { USER_STATUSES } from './constants/userStatus';
import { NPC_AUTO_BOT_PREFIX } from './constants/chat';
import { LOCAL_REACTION_DURATION_MS } from './constants/realtime';
import { Navigation } from './components/Navigation';
import { OfficeView } from './components/OfficeView';
import { SplitChatView } from './components/SplitChatView';
import { ProfileCalendarView } from './components/ProfileCalendarView';
import { Toolbar } from './components/Toolbar';
import { useRealtimeOffice } from './hooks/useRealtimeOffice';
import { AnimatePresence, motion } from 'motion/react';

export default function App() {
  // 現在のページ
  const [currentPage, setCurrentPage] = useState<PageType>('office');

  // 自律Ping / カレンダー予約
  const [isAutoPingActive, setIsAutoPingActive] = useState<boolean>(true);
  const [unreadAutonomousCount, setUnreadAutonomousCount] = useState<number>(0);
  const [bookings, setBookings] = useState<Booking[]>(INITIAL_BOOKINGS);

  // ツールバーステート
  const [currentStatus, setCurrentStatus] = useState<UserStatus>(USER_STATUSES.online);
  const [isMicOn, setIsMicOn] = useState<boolean>(false);
  const [isCameraOn, setIsCameraOn] = useState<boolean>(false);
  const [isSpeakerOn, setIsSpeakerOn] = useState<boolean>(true);
  const [localReactionEmoji, setLocalReactionEmoji] = useState<string | null>(null);

  // WebSocket リアルタイム同期フック
  const {
    selfMember,
    members,
    chats,
    isConnected,
    onlineCount,
    remoteReactions,
    sendPosition,
    updateSelfProfile,
    sendChat,
    sendReaction,
    setMembers,
  } = useRealtimeOffice({
    initialSelf: INITIAL_MEMBERS[0],
    onReceiveMessage: (msg) => {
      if (msg.senderId !== selfMember.id && currentPage !== 'split-chat') {
        setUnreadAutonomousCount((prev) => prev + 1);
      }
    },
  });

  // 選択中のメンバー (デフォルトは自分以外の最初のメンバー)
  const [selectedMember, setSelectedMember] = useState<Member>(INITIAL_MEMBERS[1]);

  useEffect(() => {
    // メンバーリストが更新されたとき、選択中メンバーの情報を同期
    if (selectedMember) {
      const updated = members.find((m) => m.id === selectedMember.id);
      if (updated) {
        setSelectedMember(updated);
      }
    }
  }, [members]);

  // 自分の位置・居場所プロパティ変更ハンドラ
  const handleUpdateSelfPosition = (
    pos: { x: number; y: number },
    zoneInfo?: { zoneId: string; zoneName: string }
  ) => {
    sendPosition(pos, zoneInfo);
  };

  // 任意メンバーの位置変更ハンドラ (ドラッグ＆ドロップ対応)
  const handleUpdateMemberPosition = (
    memberId: string,
    pos: { x: number; y: number },
    zoneInfo?: { zoneId: string; zoneName: string }
  ) => {
    if (memberId === selfMember.id) {
      sendPosition(pos, zoneInfo);
    } else {
      setMembers((prev) =>
        prev.map((m) => {
          if (m.id === memberId) {
            const updatedZoneId = zoneInfo ? zoneInfo.zoneId : m.currentZoneId;
            const updatedLocationName = zoneInfo ? zoneInfo.zoneName : m.currentLocationName;
            return {
              ...m,
              position: pos,
              currentZoneId: updatedZoneId,
              currentLocationName: updatedLocationName,
            };
          }
          return m;
        })
      );
    }
  };

  // 自分自身のアバターやステータス情報更新ハンドラ
  const handleUpdateSelfMember = (updated: Partial<Member>) => {
    updateSelfProfile(updated);
  };

  // メンバー選択＆ページ遷移ハンドラ
  const handleSelectMember = (member: Member) => {
    setSelectedMember(member);
  };

  const handleNavigateTo = (page: PageType, targetMember?: Member) => {
    if (targetMember) {
      setSelectedMember(targetMember);
    }
    setCurrentPage(page);
    if (page === 'split-chat') {
      setUnreadAutonomousCount(0);
    }
  };

  // チャット送信
  const handleSendMessage = (content: string, isAutonomous = false, targetSenderId?: string) => {
    sendChat(content);
  };

  // 自律発話の手動トリガー
  const handleTriggerAutonomousPing = () => {
    const randomMsg = AUTONOMOUS_MESSAGES_POOL[Math.floor(Math.random() * AUTONOMOUS_MESSAGES_POOL.length)];
    sendChat(`${NPC_AUTO_BOT_PREFIX}${randomMsg.content}`);
  };

  // リアクション送信
  const handleSendReaction = (emoji: string) => {
    setLocalReactionEmoji(emoji);
    sendReaction(emoji);
    setTimeout(() => {
      setLocalReactionEmoji(null);
    }, LOCAL_REACTION_DURATION_MS);
  };

  // ステータス変更
  const handleStatusChange = (status: UserStatus) => {
    setCurrentStatus(status);
    updateSelfProfile({ status });
  };

  // カレンダー予約追加
  const handleCreateBooking = (newBookingData: Omit<Booking, 'id' | 'createdAt'>) => {
    const now = new Date();
    const createdStr = `${now.getFullYear()}-${(now.getMonth() + 1).toString().padStart(2, '0')}-${now.getDate().toString().padStart(2, '0')} ${now.getHours().toString().padStart(2, '0')}:${now.getMinutes().toString().padStart(2, '0')}`;
    
    const newBooking: Booking = {
      ...newBookingData,
      id: `booking-${Date.now()}`,
      createdAt: createdStr,
    };

    setBookings((prev) => [newBooking, ...prev]);

    // 予約した相手の該当スロットを非空きに更新
    setMembers((prev) =>
      prev.map((m) => {
        if (m.id === newBookingData.memberId) {
          return {
            ...m,
            availableSlots: m.availableSlots?.map((s) =>
              s.date === newBookingData.date && s.time === newBookingData.time
                ? { ...s, available: false }
                : s
            ) || [],
          };
        }
        return m;
      })
    );

    // チャットにも予約通知メッセージを自動投下
    sendChat(
      `📅 【カレンダー予約】${newBookingData.date} ${newBookingData.time} に「${newBookingData.title}」を予約しました！`
    );
  };

  // カレンダー予約キャンセル
  const handleCancelBooking = (bookingId: string) => {
    setBookings((prev) => prev.filter((b) => b.id !== bookingId));
  };

  return (
    <div className="w-full h-screen flex flex-col bg-slate-100 font-sans antialiased text-slate-900 overflow-hidden select-none">
      {/* ナビゲーションバー (上部ヘッダー ＆ タブナビゲーション) */}
      <Navigation
        currentPage={currentPage}
        onPageChange={(page) => {
          setCurrentPage(page);
          if (page === 'split-chat') {
            setUnreadAutonomousCount(0);
          }
        }}
        onlineCount={onlineCount}
        selectedMemberName={selectedMember?.name}
        unreadAutonomousCount={unreadAutonomousCount}
        isConnected={isConnected}
      />

      {/* メインコンテンツ（3ページの切り替え表示） */}
      <main className="flex-1 w-full relative overflow-hidden">
        <AnimatePresence mode="wait">
          {currentPage === 'office' && (
            <motion.div
              key="office-view"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 20 }}
              transition={{ duration: 0.2 }}
              className="w-full h-full"
            >
              <OfficeView
                members={members}
                zones={OFFICE_ZONES}
                selfMember={selfMember}
                onUpdateSelfPosition={handleUpdateSelfPosition}
                onUpdateMemberPosition={handleUpdateMemberPosition}
                onUpdateSelfMember={handleUpdateSelfMember}
                onSelectMember={handleSelectMember}
                onNavigateTo={handleNavigateTo}
                reactionEmoji={localReactionEmoji}
                remoteReactions={remoteReactions}
              />
            </motion.div>
          )}

          {currentPage === 'split-chat' && (
            <motion.div
              key="split-chat-view"
              initial={{ opacity: 0, scale: 0.98 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.98 }}
              transition={{ duration: 0.2 }}
              className="w-full h-full"
            >
              <SplitChatView
                members={members}
                selfMember={selfMember}
                chatMessages={chats}
                onSendMessage={handleSendMessage}
                selectedMember={selectedMember}
                onSelectMember={handleSelectMember}
                onNavigateTo={handleNavigateTo}
                onTriggerAutonomousPing={handleTriggerAutonomousPing}
                isAutoPingActive={isAutoPingActive}
                onToggleAutoPing={() => setIsAutoPingActive(!isAutoPingActive)}
              />
            </motion.div>
          )}

          {currentPage === 'profile-booking' && (
            <motion.div
              key="profile-booking-view"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.2 }}
              className="w-full h-full"
            >
              <ProfileCalendarView
                members={members}
                selfMember={selfMember}
                selectedMember={selectedMember}
                onSelectMember={handleSelectMember}
                bookings={bookings}
                onCreateBooking={handleCreateBooking}
                onCancelBooking={handleCancelBooking}
                onNavigateTo={handleNavigateTo}
              />
            </motion.div>
          )}
        </AnimatePresence>
      </main>

      {/* oviceライクな下部アクションツールバー (マイク/カメラ/ステータス/リアクション等) */}
      <Toolbar
        currentStatus={currentStatus}
        onStatusChange={handleStatusChange}
        onSendReaction={handleSendReaction}
        isMicOn={isMicOn}
        onToggleMic={() => setIsMicOn(!isMicOn)}
        isCameraOn={isCameraOn}
        onToggleCamera={() => setIsCameraOn(!isCameraOn)}
        isSpeakerOn={isSpeakerOn}
        onToggleSpeaker={() => setIsSpeakerOn(!isSpeakerOn)}
      />
    </div>
  );
}
