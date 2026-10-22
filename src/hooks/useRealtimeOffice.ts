import { useEffect, useRef, useState, useCallback } from 'react';
import { Member, ChatMessage, RpgJobClass, AvatarMode } from '../types';
import { SESSION_STORAGE_KEYS } from '../constants/storage';
import { REMOTE_REACTION_DURATION_MS, WS_PING_INTERVAL_MS, WS_RECONNECT_DELAY_MS } from '../constants/realtime';
import { CLIENT_MESSAGE, SERVER_MESSAGE, WS_PATH } from '../../shared/realtime';
import { formatChatTimestamp } from '../../shared/time';

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
    const storedId = sessionStorage.getItem(SESSION_STORAGE_KEYS.USER_ID);
    const storedName = sessionStorage.getItem(SESSION_STORAGE_KEYS.USER_NAME);
    const storedRole = sessionStorage.getItem(SESSION_STORAGE_KEYS.USER_ROLE);
    const storedJob = sessionStorage.getItem(SESSION_STORAGE_KEYS.USER_JOB) as RpgJobClass | null;
    const storedAvatarMode = sessionStorage.getItem(SESSION_STORAGE_KEYS.USER_AVATAR_MODE) as AvatarMode | null;
    const storedAvatar = sessionStorage.getItem(SESSION_STORAGE_KEYS.USER_AVATAR);

    const myId = storedId || `user-${Date.now().toString(36)}-${Math.random().toString(36).substring(2, 6)}`;
    sessionStorage.setItem(SESSION_STORAGE_KEYS.USER_ID, myId);

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
      const wsUrl = `${protocol}//${window.location.host}${WS_PATH}`;

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
            type: CLIENT_MESSAGE.JOIN,
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
            case SERVER_MESSAGE.INIT_STATE: {
              // サーバーから初期状態を受信
              const remoteUsers: Member[] = payload.users || [];
              const myId = selfMemberRef.current.id;

              // 他者メンバーリスト
              setMembers(remoteUsers);
              if (payload.chats) setChats(payload.chats);
              if (payload.activeConnectionCount) setOnlineCount(payload.activeConnectionCount);
              break;
            }

            case SERVER_MESSAGE.USER_JOINED: {
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

            case SERVER_MESSAGE.USER_MOVED: {
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

            case SERVER_MESSAGE.USER_UPDATED: {
              const updatedUser: Member = payload.user;
              setMembers((prev) =>
                prev.map((m) => (m.id === updatedUser.id ? { ...m, ...updatedUser } : m))
              );
              if (updatedUser.id === selfMemberRef.current.id) {
                setSelfMember((prev) => ({ ...prev, ...updatedUser }));
              }
              break;
            }

            case SERVER_MESSAGE.USER_LEFT: {
              const { userId, activeConnectionCount } = payload;
              setMembers((prev) => prev.filter((m) => m.id !== userId));
              if (activeConnectionCount) {
                setOnlineCount(activeConnectionCount);
              }
              break;
            }

            case SERVER_MESSAGE.NEW_CHAT: {
              const newChat: ChatMessage = payload;
              setChats((prev) => [...prev, newChat]);
              if (onReceiveMessage) onReceiveMessage(newChat);
              break;
            }

            case SERVER_MESSAGE.USER_REACTION: {
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
              }, REMOTE_REACTION_DURATION_MS);
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
        reconnectTimerRef.current = setTimeout(connectWebSocket, WS_RECONNECT_DELAY_MS);
      };

      ws.onerror = () => {
        ws.close();
      };
    };

    connectWebSocket();

    // 定期 Ping (30s)
    const pingInterval = setInterval(() => {
      if (wsRef.current?.readyState === WebSocket.OPEN) {
        wsRef.current.send(JSON.stringify({ type: CLIENT_MESSAGE.PING }));
      }
    }, WS_PING_INTERVAL_MS);

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
          type: CLIENT_MESSAGE.MOVE,
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
      if (updated.name) sessionStorage.setItem(SESSION_STORAGE_KEYS.USER_NAME, updated.name);
      if (updated.role) sessionStorage.setItem(SESSION_STORAGE_KEYS.USER_ROLE, updated.role);
      if (updated.rpgClass) sessionStorage.setItem(SESSION_STORAGE_KEYS.USER_JOB, updated.rpgClass);
      if (updated.avatarMode) sessionStorage.setItem(SESSION_STORAGE_KEYS.USER_AVATAR_MODE, updated.avatarMode);
      if (updated.avatar) sessionStorage.setItem(SESSION_STORAGE_KEYS.USER_AVATAR, updated.avatar);
      return next;
    });

    setMembers((prev) =>
      prev.map((m) => (m.id === selfMemberRef.current.id ? { ...m, ...updated } : m))
    );

    if (wsRef.current?.readyState === WebSocket.OPEN) {
      wsRef.current.send(
        JSON.stringify({
          type: CLIENT_MESSAGE.UPDATE_PROFILE,
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
          type: CLIENT_MESSAGE.SEND_CHAT,
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
        timestamp: formatChatTimestamp(),
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
          type: CLIENT_MESSAGE.REACTION,
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
