import express from "express";
import http from "http";
import path from "path";
import { WebSocketServer, WebSocket } from "ws";
import { createServer as createViteServer } from "vite";

interface UserPosition {
  x: number;
  y: number;
}

interface UserSessionData {
  id: string;
  name: string;
  nameEn?: string;
  role: string;
  department: string;
  avatar: string;
  avatarMode?: "sprite" | "icon";
  rpgClass: string;
  rpgLevel: number;
  status: {
    state: string;
    label: string;
    emoji: string;
    color: string;
  };
  customStatusMsg?: string;
  position: UserPosition;
  currentZoneId: string;
  currentLocationName: string;
  isSpeaking: boolean;
  voiceRange: number;
  lastActive: number;
  isRealUser?: boolean;
}

interface ChatMessageData {
  id: string;
  senderId: string;
  senderName: string;
  senderAvatar: string;
  content: string;
  timestamp: string;
  type: "text" | "zone_announcement" | "system";
  channelId?: string;
}

// In-Memory User Session & Room State (揮発性メモリ)
const activeUsers = new Map<string, UserSessionData>();
const chatHistory: ChatMessageData[] = [];
const clientSockets = new Map<string, WebSocket>();

// 初期NPC/常駐メンバーデータ（一人だけで接続しても空間が寂しくないよう配置、他者が接続するとリアルユーザーとして追加）
const DEFAULT_RESIDENTS: UserSessionData[] = [
  {
    id: "npc-tanaka",
    name: "田中 健一",
    nameEn: "Kenichi Tanaka",
    role: "エンジニアリングマネージャー",
    department: "Engineering Unit",
    avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80",
    rpgClass: "knight",
    rpgLevel: 6,
    status: { state: "online", label: "オンライン (Online)", emoji: "🟢", color: "#10B981" },
    customStatusMsg: "Q3ロードマップ策定中 📋",
    position: { x: 370, y: 190 },
    currentZoneId: "throne_lounge",
    currentLocationName: "メイン執務ラウンジ ＆ コラボレーションエリア",
    isSpeaking: true,
    voiceRange: 120,
    lastActive: Date.now(),
    isRealUser: false,
  },
  {
    id: "npc-sato",
    name: "佐藤 美咲",
    nameEn: "Misaki Sato",
    role: "シニアUI/UXデザイナー",
    department: "Design System Squad",
    avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&auto=format&fit=crop&q=80",
    rpgClass: "bard",
    rpgLevel: 5,
    status: { state: "focus", label: "集中作業中 (Focus)", emoji: "🟣", color: "#A855F7" },
    customStatusMsg: "デザインシステム改修中 🎨",
    position: { x: 740, y: 460 },
    currentZoneId: "forge_lab",
    currentLocationName: "プロジェクトルーム ＆ クリエイティブラボ",
    isSpeaking: false,
    voiceRange: 100,
    lastActive: Date.now(),
    isRealUser: false,
  },
  {
    id: "npc-watanabe",
    name: "渡辺 翔太",
    nameEn: "Shota Watanabe",
    role: "フロントエンドリード",
    department: "Core Web Squad",
    avatar: "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150&auto=format&fit=crop&q=80",
    rpgClass: "scholar",
    rpgLevel: 8,
    status: { state: "online", label: "オンライン (Online)", emoji: "🟢", color: "#10B981" },
    customStatusMsg: "TypeScript v5移行検証中 💻",
    position: { x: 190, y: 460 },
    currentZoneId: "magic_library",
    currentLocationName: "集中作業ブース ＆ サイレントスペース",
    isSpeaking: false,
    voiceRange: 110,
    lastActive: Date.now(),
    isRealUser: false,
  },
  {
    id: "npc-kobayashi",
    name: "小林 誠",
    nameEn: "Makoto Kobayashi",
    role: "プロダクトマネージャー",
    department: "Product Division",
    avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&auto=format&fit=crop&q=80",
    rpgClass: "mage",
    rpgLevel: 7,
    status: { state: "break", label: "休憩中 (Break)", emoji: "☕️", color: "#3B82F6" },
    customStatusMsg: "コーヒーブレイク中 ☕️",
    position: { x: 190, y: 190 },
    currentZoneId: "guild_tavern",
    currentLocationName: "カフェスペース ＆ リフレッシュラウンジ",
    isSpeaking: false,
    voiceRange: 110,
    lastActive: Date.now(),
    isRealUser: false,
  }
];

// 初期ユーザーをメモリに投入
DEFAULT_RESIDENTS.forEach((user) => {
  activeUsers.set(user.id, user);
});

async function startServer() {
  const app = express();
  const server = http.createServer(app);
  const PORT = 3000;

  app.use(express.json());

  // ================= 1. REST API (セッション＆ルーム情報) =================
  app.get("/api/health", (_req, res) => {
    res.json({
      status: "ok",
      activeConnections: clientSockets.size,
      totalUsers: activeUsers.size,
      uptime: process.uptime(),
    });
  });

  app.get("/api/session/users", (_req, res) => {
    res.json({
      users: Array.from(activeUsers.values()),
      onlineCount: clientSockets.size,
    });
  });

  app.get("/api/session/chats", (_req, res) => {
    res.json({
      messages: chatHistory.slice(-50),
    });
  });

  // ================= 2. WebSocket リアルタイム同時接続管理 =================
  const wss = new WebSocketServer({ server, path: "/ws" });

  // 全クライアントへのブロードキャスト関数
  const broadcast = (data: any, excludeUserId?: string) => {
    const payload = JSON.stringify(data);
    clientSockets.forEach((ws, userId) => {
      if (userId !== excludeUserId && ws.readyState === WebSocket.OPEN) {
        ws.send(payload);
      }
    });
  };

  wss.on("connection", (ws: WebSocket) => {
    let currentUserId: string | null = null;

    ws.on("message", (rawMessage: string) => {
      try {
        const message = JSON.parse(rawMessage.toString());
        const { type, payload } = message;

        switch (type) {
          // 1. ユーザー入室（セッション開始 / 参加）
          case "join": {
            const userData: UserSessionData = {
              ...payload,
              lastActive: Date.now(),
              isRealUser: true,
            };
            currentUserId = userData.id;
            activeUsers.set(userData.id, userData);
            clientSockets.set(userData.id, ws);

            // 送信者に現在の全ユーザー＆チャット履歴を同期
            ws.send(
              JSON.stringify({
                type: "init-state",
                payload: {
                  users: Array.from(activeUsers.values()),
                  chats: chatHistory.slice(-30),
                  activeConnectionCount: clientSockets.size,
                },
              })
            );

            // 他の全員に入室をブロードキャスト
            broadcast(
              {
                type: "user-joined",
                payload: {
                  user: userData,
                  activeConnectionCount: clientSockets.size,
                },
              },
              userData.id
            );

            // システムチャット通知
            const sysMsg: ChatMessageData = {
              id: `sys-${Date.now()}-${Math.random().toString(36).substring(2, 5)}`,
              senderId: "system",
              senderName: "システム通知",
              senderAvatar: "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=150&auto=format&fit=crop&q=80",
              content: `🏰 ${userData.name} さんがオフィスに入室しました。(${userData.currentLocationName})`,
              timestamp: new Date().toLocaleTimeString("ja-JP", { hour: "2-digit", minute: "2-digit" }),
              type: "system",
            };
            chatHistory.push(sysMsg);
            broadcast({ type: "new-chat", payload: sysMsg });
            break;
          }

          // 2. 位置・居場所移動同期（ドラッグ＆ドロップ、クリック、テレポート）
          case "move": {
            if (!currentUserId) return;
            const existing = activeUsers.get(currentUserId);
            if (existing) {
              existing.position = payload.position;
              if (payload.zoneId) existing.currentZoneId = payload.zoneId;
              if (payload.zoneName) existing.currentLocationName = payload.zoneName;
              existing.lastActive = Date.now();
              activeUsers.set(currentUserId, existing);

              broadcast(
                {
                  type: "user-moved",
                  payload: {
                    userId: currentUserId,
                    position: payload.position,
                    zoneId: payload.zoneId,
                    zoneName: payload.zoneName,
                  },
                },
                currentUserId
              );
            }
            break;
          }

          // 3. プロフィール / アバター / ステータス変更
          case "update-profile": {
            if (!currentUserId) return;
            const existing = activeUsers.get(currentUserId);
            if (existing) {
              const updated = { ...existing, ...payload, lastActive: Date.now() };
              activeUsers.set(currentUserId, updated);

              broadcast({
                type: "user-updated",
                payload: { user: updated },
              });
            }
            break;
          }

          // 4. チャットメッセージ送信
          case "send-chat": {
            const chat: ChatMessageData = {
              id: `chat-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
              senderId: payload.senderId,
              senderName: payload.senderName,
              senderAvatar: payload.senderAvatar,
              content: payload.content,
              timestamp: new Date().toLocaleTimeString("ja-JP", { hour: "2-digit", minute: "2-digit" }),
              type: payload.type || "text",
              channelId: payload.channelId,
            };
            chatHistory.push(chat);
            if (chatHistory.length > 200) chatHistory.shift();

            broadcast({
              type: "new-chat",
              payload: chat,
            });
            break;
          }

          // 5. リアクションエモート（頭上の吹き出し同期）
          case "reaction": {
            if (!currentUserId) return;
            broadcast({
              type: "user-reaction",
              payload: {
                userId: currentUserId,
                emoji: payload.emoji,
              },
            });
            break;
          }

          // 6. 心拍（Heartbeat Ping/Pong）
          case "ping": {
            ws.send(JSON.stringify({ type: "pong", timestamp: Date.now() }));
            break;
          }
        }
      } catch (err) {
        console.error("Error processing websocket message:", err);
      }
    });

    // 切断処理（ブラウザを閉じた / ネットワーク切断）
    ws.on("close", () => {
      if (currentUserId) {
        const leavingUser = activeUsers.get(currentUserId);
        clientSockets.delete(currentUserId);

        // 実ユーザーの場合はメモリから削除（またはオフライン化）
        if (leavingUser && leavingUser.isRealUser) {
          activeUsers.delete(currentUserId);
          broadcast({
            type: "user-left",
            payload: {
              userId: currentUserId,
              name: leavingUser.name,
              activeConnectionCount: clientSockets.size,
            },
          });

          // 退室通知
          const sysMsg: ChatMessageData = {
            id: `sys-${Date.now()}-${Math.random().toString(36).substring(2, 5)}`,
            senderId: "system",
            senderName: "システム通知",
            senderAvatar: "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=150&auto=format&fit=crop&q=80",
            content: `🚪 ${leavingUser.name} さんが退出しました。`,
            timestamp: new Date().toLocaleTimeString("ja-JP", { hour: "2-digit", minute: "2-digit" }),
            type: "system",
          };
          chatHistory.push(sysMsg);
          broadcast({ type: "new-chat", payload: sysMsg });
        }
      }
    });
  });

  // ================= 3. Vite Middleware (開発環境) / 静的配信 (本番環境) =================
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (_req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  server.listen(PORT, "0.0.0.0", () => {
    console.log(`🏰 Virtual Office Server running on http://0.0.0.0:${PORT}`);
  });
}

startServer();
