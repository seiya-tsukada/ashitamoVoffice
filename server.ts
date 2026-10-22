import express from "express";
import http from "http";
import path from "path";
import { WebSocketServer, WebSocket, type RawData } from "ws";
import { createServer as createViteServer } from "vite";

import { CLIENT_MESSAGE, SERVER_MESSAGE, WS_PATH, type ClientMessage, type ServerMessage } from "./shared/realtime";
import { formatChatTimestamp } from "./shared/time";
import {
  CHAT_HISTORY_API_LIMIT,
  CHAT_HISTORY_INIT_LIMIT,
  CHAT_HISTORY_MAX,
  SERVER_HOST,
  SERVER_PORT,
  SYSTEM_SENDER,
} from "./server/constants";
import { DEFAULT_RESIDENTS } from "./server/residents";
import type { ChatMessageData, UserSessionData } from "./server/types";

// In-Memory User Session & Room State (揮発性メモリ)
const activeUsers = new Map<string, UserSessionData>();
const chatHistory: ChatMessageData[] = [];
const clientSockets = new Map<string, WebSocket>();

// 初期ユーザーをメモリに投入
DEFAULT_RESIDENTS.forEach((user) => {
  activeUsers.set(user.id, user);
});

async function startServer() {
  const app = express();
  const server = http.createServer(app);
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
      messages: chatHistory.slice(-CHAT_HISTORY_API_LIMIT),
    });
  });

  // ================= 2. WebSocket リアルタイム同時接続管理 =================
  const wss = new WebSocketServer({ server, path: WS_PATH });

  const send = (ws: WebSocket, message: ServerMessage) => {
    ws.send(JSON.stringify(message));
  };

  // 全クライアントへのブロードキャスト関数
  const broadcast = (message: ServerMessage, excludeUserId?: string) => {
    const payload = JSON.stringify(message);
    clientSockets.forEach((ws, userId) => {
      if (userId !== excludeUserId && ws.readyState === WebSocket.OPEN) {
        ws.send(payload);
      }
    });
  };

  wss.on("connection", (ws: WebSocket) => {
    let currentUserId: string | null = null;

    ws.on("message", (rawMessage: RawData) => {
      try {
        const message = JSON.parse(rawMessage.toString()) as ClientMessage;

        switch (message.type) {
          // 1. ユーザー入室（セッション開始 / 参加）
          case CLIENT_MESSAGE.JOIN: {
            const { payload } = message;
            const userData: UserSessionData = {
              ...payload,
              lastActive: Date.now(),
              isRealUser: true,
            };
            currentUserId = userData.id;
            activeUsers.set(userData.id, userData);
            clientSockets.set(userData.id, ws);

            // 送信者に現在の全ユーザー＆チャット履歴を同期
            send(ws, {
              type: SERVER_MESSAGE.INIT_STATE,
              payload: {
                users: Array.from(activeUsers.values()),
                chats: chatHistory.slice(-CHAT_HISTORY_INIT_LIMIT),
                activeConnectionCount: clientSockets.size,
              },
            });

            // 他の全員に入室をブロードキャスト
            broadcast(
              {
                type: SERVER_MESSAGE.USER_JOINED,
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
              senderId: SYSTEM_SENDER.id,
              senderName: SYSTEM_SENDER.name,
              senderAvatar: SYSTEM_SENDER.avatar,
              content: `🏰 ${userData.name} さんがオフィスに入室しました。(${userData.currentLocationName})`,
              timestamp: formatChatTimestamp(),
              type: "system",
            };
            chatHistory.push(sysMsg);
            broadcast({ type: SERVER_MESSAGE.NEW_CHAT, payload: sysMsg });
            break;
          }

          // 2. 位置・居場所移動同期（ドラッグ＆ドロップ、クリック、テレポート）
          case CLIENT_MESSAGE.MOVE: {
            const { payload } = message;
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
                  type: SERVER_MESSAGE.USER_MOVED,
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
          case CLIENT_MESSAGE.UPDATE_PROFILE: {
            const { payload } = message;
            if (!currentUserId) return;
            const existing = activeUsers.get(currentUserId);
            if (existing) {
              const updated = { ...existing, ...payload, lastActive: Date.now() };
              activeUsers.set(currentUserId, updated);

              broadcast({
                type: SERVER_MESSAGE.USER_UPDATED,
                payload: { user: updated },
              });
            }
            break;
          }

          // 4. チャットメッセージ送信
          case CLIENT_MESSAGE.SEND_CHAT: {
            const { payload } = message;
            const chat: ChatMessageData = {
              id: `chat-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
              senderId: payload.senderId,
              senderName: payload.senderName,
              senderAvatar: payload.senderAvatar,
              content: payload.content,
              timestamp: formatChatTimestamp(),
              type: payload.type || "text",
              channelId: payload.channelId,
            };
            chatHistory.push(chat);
            if (chatHistory.length > CHAT_HISTORY_MAX) chatHistory.shift();

            broadcast({
              type: SERVER_MESSAGE.NEW_CHAT,
              payload: chat,
            });
            break;
          }

          // 5. リアクションエモート（頭上の吹き出し同期）
          case CLIENT_MESSAGE.REACTION: {
            const { payload } = message;
            if (!currentUserId) return;
            broadcast({
              type: SERVER_MESSAGE.USER_REACTION,
              payload: {
                userId: currentUserId,
                emoji: payload.emoji,
              },
            });
            break;
          }

          // 6. 心拍（Heartbeat Ping/Pong）
          case CLIENT_MESSAGE.PING: {
            send(ws, { type: SERVER_MESSAGE.PONG, timestamp: Date.now() });
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
            type: SERVER_MESSAGE.USER_LEFT,
            payload: {
              userId: currentUserId,
              name: leavingUser.name,
              activeConnectionCount: clientSockets.size,
            },
          });

          // 退室通知
          const sysMsg: ChatMessageData = {
            id: `sys-${Date.now()}-${Math.random().toString(36).substring(2, 5)}`,
            senderId: SYSTEM_SENDER.id,
            senderName: SYSTEM_SENDER.name,
            senderAvatar: SYSTEM_SENDER.avatar,
            content: `🚪 ${leavingUser.name} さんが退出しました。`,
            timestamp: formatChatTimestamp(),
            type: "system",
          };
          chatHistory.push(sysMsg);
          broadcast({ type: SERVER_MESSAGE.NEW_CHAT, payload: sysMsg });
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

  server.listen(SERVER_PORT, SERVER_HOST, () => {
    console.log(`🏰 Virtual Office Server running on http://${SERVER_HOST}:${SERVER_PORT}`);
  });
}

startServer();
