import { useEffect, useRef, useState, useCallback } from 'react';
import { Member, ChatMessage, RpgJobClass, AvatarMode } from '../types';
import { USER_STATUSES } from '../data/mockData';

interface UseRealtimeOfficeProps {
  initialSelf: Member;
  onReceiveMessage?: (msg: ChatMessage) => void;
  onUserReaction?: (userId: string, emoji: string) => void;
}

export function useRealtimeOffice({
  initialSelf,
  onReceiveMessage,
  onUserReaction,
}: UseRealtimeOfficeProps) {
  const [selfMember, setSelfMember] = useState<Member>(() => {
    // セッションストレージから自分の識別情報を取得（タブ再読み込み時も同一IDを維持、別タブなら別ID）
    const storedId = sessionStorage.getItem('virtual_office_user_id');
    const storedName = sessionStorage.getItem('virtual_office_user_name');
    const storedRole = sessionStorage.getItem('virtual_office_user_role');
    const storedJob = sessionStorage.getItem('virtual_office_user_job') as RpgJobClass | null;
    const storedAvatarMode = sessionStorage.getItem('virtual_office_user_avatar_mode') as AvatarMode | null;
    const storedAvatar = sessionStorage.getItem('virtual_office_user_avatar');

    const myId = storedId || `user-${Date.now().toString(36)}-${Math.random().toString(36).substring(2, 6)}`;
    sessionStorage.setItem('virtual_office_user_id', myId);

    return {
      ...initialSelf,
      id: myId,
      name: storedName || initialSelf.name,
      role: storedRole || initialSelf.role,
      rpgClass: storedJob || initialSelf.rpgClass,
      avatarMode: storedAvatarMode || initialSelf.avatarMode || 'sprite',
      avatar: storedAvatar || initialSelf.avatar,
    };
  });

  const [members, setMembers] = useState<Member[]>([]);
  const [chats, setChats] = useState<ChatMessage[]>([]);
  const [isConnected, setIsConnected] = useState<boolean>(false);
  const [onlineCount, setOnlineCount] = useState<number>(1);
  const [remoteReactions, setRemoteReactions] = useState<Record<string, string>>({});

  const wsRef = useRef<WebSocket | null>(null);
  const reconnectTimerRef = useRef<any>(null);
  const selfMemberRef = useRef<Member>(selfMember);

  useEffect(() => {
    selfMemberRef.current = selfMember;
  }, [selfMember]);

  // WebSocket 接続・管理
  useEffect(() => {
    let isUnmounted = false;

    const connectWebSocket = () => {
      if (wsRef.current?.readyState === WebSocket.OPEN) return;

      const protocol = window.location.protocol === 'https:' ? 'wss:' : 'ws:';
      const wsUrl = `${protocol}//${window.location.host}/ws`;

      const ws = new WebSocket(wsUrl);
      wsRef.current = ws;

      ws.onopen = () => {
        if (isUnmounted) return;
        setIsConnected(true);
        console.log('🔗 WebSocket Connected to Virtual Office Server');

        // サーバーへ参加 (join) 送信
        const currentSelf = selfMemberRef.current;
        ws.send(
          JSON.stringify({
            type: 'join',
            payload: currentSelf,
          })
        );
      };

      ws.onmessage = (event) => {
        if (isUnmounted) return;
        try {
          const data = JSON.parse(event.data);
          const { type, payload } = data;

          switch (type) {
            case 'init-state': {
              // サーバーから初期状態を受信
              const remoteUsers: Member[] = payload.users || [];
              const myId = selfMemberRef.current.id;

              // 他者メンバーリスト
              setMembers(remoteUsers);
              if (payload.chats) setChats(payload.chats);
              if (payload.activeConnectionCount) setOnlineCount(payload.activeConnectionCount);
              break;
            }

            case 'user-joined': {
              const newUser: Member = payload.user;
              setMembers((prev) => {
                const exists = prev.some((m) => m.id === newUser.id);
                if (exists) {
                  return prev.map((m) => (m.id === newUser.id ? newUser : m));
                }
                return [...prev, newUser];
              });
              if (payload.activeConnectionCount) {
                setOnlineCount(payload.activeConnectionCount);
              }
              break;
            }

            case 'user-moved': {
              const { userId, position, zoneId, zoneName } = payload;
              setMembers((prev) =>
                prev.map((m) => {
                  if (m.id === userId) {
                    return {
                      ...m,
                      position,
                      currentZoneId: zoneId || m.currentZoneId,
                      currentLocationName: zoneName || m.currentLocationName,
                    };
                  }
                  return m;
                })
              );
              break;
            }

            case 'user-updated': {
              const updatedUser: Member = payload.user;
              setMembers((prev) =>
                prev.map((m) => (m.id === updatedUser.id ? { ...m, ...updatedUser } : m))
              );
              if (updatedUser.id === selfMemberRef.current.id) {
                setSelfMember((prev) => ({ ...prev, ...updatedUser }));
              }
              break;
            }

            case 'user-left': {
              const { userId, activeConnectionCount } = payload;
              setMembers((prev) => prev.filter((m) => m.id !== userId));
              if (activeConnectionCount) {
                setOnlineCount(activeConnectionCount);
              }
              break;
            }

            case 'new-chat': {
              const newChat: ChatMessage = payload;
              setChats((prev) => [...prev, newChat]);
              if (onReceiveMessage) onReceiveMessage(newChat);
              break;
            }

            case 'user-reaction': {
              const { userId, emoji } = payload;
              setRemoteReactions((prev) => ({ ...prev, [userId]: emoji }));
              if (onUserReaction) onUserReaction(userId, emoji);

              // 3.5秒後にエモート消去
              setTimeout(() => {
                setRemoteReactions((prev) => {
                  const updated = { ...prev };
                  delete updated[userId];
                  return updated;
                });
              }, 3500);
              break;
            }
          }
        } catch (err) {
          console.error('Error handling WS message:', err);
        }
      };

      ws.onclose = () => {
        if (isUnmounted) return;
        setIsConnected(false);
        // 再接続トライ
        reconnectTimerRef.current = setTimeout(connectWebSocket, 2000);
      };

      ws.onerror = () => {
        ws.close();
      };
    };

    connectWebSocket();

    // 定期 Ping (30s)
    const pingInterval = setInterval(() => {
      if (wsRef.current?.readyState === WebSocket.OPEN) {
        wsRef.current.send(JSON.stringify({ type: 'ping' }));
      }
    }, 30000);

    return () => {
      isUnmounted = true;
      clearInterval(pingInterval);
      if (reconnectTimerRef.current) clearTimeout(reconnectTimerRef.current);
      if (wsRef.current) {
        wsRef.current.close();
      }
    };
  }, []);

  // 1. 位置送信
  const sendPosition = useCallback((pos: { x: number; y: number }, zoneInfo?: { zoneId: string; zoneName: string }) => {
    const updatedZoneId = zoneInfo ? zoneInfo.zoneId : selfMemberRef.current.currentZoneId;
    const updatedZoneName = zoneInfo ? zoneInfo.zoneName : selfMemberRef.current.currentLocationName;

    setSelfMember((prev) => ({
      ...prev,
      position: pos,
      currentZoneId: updatedZoneId,
      currentLocationName: updatedZoneName,
    }));

    setMembers((prev) =>
      prev.map((m) =>
        m.id === selfMemberRef.current.id
          ? {
              ...m,
              position: pos,
              currentZoneId: updatedZoneId,
              currentLocationName: updatedZoneName,
            }
          : m
      )
    );

    if (wsRef.current?.readyState === WebSocket.OPEN) {
      wsRef.current.send(
        JSON.stringify({
          type: 'move',
          payload: {
            position: pos,
            zoneId: updatedZoneId,
            zoneName: updatedZoneName,
          },
        })
      );
    }
  }, []);

  // 2. プロフィール / アバター / ステータス変更送信
  const updateSelfProfile = useCallback((updated: Partial<Member>) => {
    setSelfMember((prev) => {
      const next = { ...prev, ...updated };
      if (updated.name) sessionStorage.setItem('virtual_office_user_name', updated.name);
      if (updated.role) sessionStorage.setItem('virtual_office_user_role', updated.role);
      if (updated.rpgClass) sessionStorage.setItem('virtual_office_user_job', updated.rpgClass);
      if (updated.avatarMode) sessionStorage.setItem('virtual_office_user_avatar_mode', updated.avatarMode);
      if (updated.avatar) sessionStorage.setItem('virtual_office_user_avatar', updated.avatar);
      return next;
    });

    setMembers((prev) =>
      prev.map((m) => (m.id === selfMemberRef.current.id ? { ...m, ...updated } : m))
    );

    if (wsRef.current?.readyState === WebSocket.OPEN) {
      wsRef.current.send(
        JSON.stringify({
          type: 'update-profile',
          payload: updated,
        })
      );
    }
  }, []);

  // 3. チャット送信
  const sendChat = useCallback((content: string, channelId?: string) => {
    if (!content.trim()) return;
    const current = selfMemberRef.current;
    if (wsRef.current?.readyState === WebSocket.OPEN) {
      wsRef.current.send(
        JSON.stringify({
          type: 'send-chat',
          payload: {
            senderId: current.id,
            senderName: current.name,
            senderAvatar: current.avatar,
            content,
            channelId,
          },
        })
      );
    } else {
      // フォールバック（オフライン時）
      const localMsg: ChatMessage = {
        id: `local-${Date.now()}`,
        senderId: current.id,
        senderName: current.name,
        senderAvatar: current.avatar,
        isSelf: true,
        content,
        timestamp: new Date().toLocaleTimeString('ja-JP', { hour: '2-digit', minute: '2-digit' }),
        type: 'text',
        channelId,
      };
      setChats((prev) => [...prev, localMsg]);
    }
  }, []);

  // 4. リアクション送信
  const sendReaction = useCallback((emoji: string) => {
    if (wsRef.current?.readyState === WebSocket.OPEN) {
      wsRef.current.send(
        JSON.stringify({
          type: 'reaction',
          payload: { emoji },
        })
      );
    }
  }, []);

  return {
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
  };
}
