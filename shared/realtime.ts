// クライアント・サーバー間で共有するリアルタイム通信の定数・メッセージ型

import type { ChatMessageBase, ChatMessageType, OfficeUser, Position } from './types';

export const WS_PATH = '/ws';

// クライアント → サーバー
export const CLIENT_MESSAGE = {
  JOIN: 'join',
  MOVE: 'move',
  UPDATE_PROFILE: 'update-profile',
  SEND_CHAT: 'send-chat',
  REACTION: 'reaction',
  PING: 'ping',
} as const;

// サーバー → クライアント
export const SERVER_MESSAGE = {
  INIT_STATE: 'init-state',
  USER_JOINED: 'user-joined',
  USER_MOVED: 'user-moved',
  USER_UPDATED: 'user-updated',
  USER_LEFT: 'user-left',
  NEW_CHAT: 'new-chat',
  USER_REACTION: 'user-reaction',
  PONG: 'pong',
} as const;

// ================= メッセージ型 =================

export interface MovePayload {
  position: Position;
  zoneId?: string;
  zoneName?: string;
}

export interface SendChatPayload {
  senderId: string;
  senderName: string;
  senderAvatar: string;
  content: string;
  channelId?: string;
  type?: ChatMessageType;
}

export type ClientMessage =
  | { type: typeof CLIENT_MESSAGE.JOIN; payload: OfficeUser }
  | { type: typeof CLIENT_MESSAGE.MOVE; payload: MovePayload }
  | { type: typeof CLIENT_MESSAGE.UPDATE_PROFILE; payload: Partial<OfficeUser> }
  | { type: typeof CLIENT_MESSAGE.SEND_CHAT; payload: SendChatPayload }
  | { type: typeof CLIENT_MESSAGE.REACTION; payload: { emoji: string } }
  | { type: typeof CLIENT_MESSAGE.PING };

export type ServerMessage =
  | {
      type: typeof SERVER_MESSAGE.INIT_STATE;
      payload: { users: OfficeUser[]; chats: ChatMessageBase[]; activeConnectionCount: number };
    }
  | { type: typeof SERVER_MESSAGE.USER_JOINED; payload: { user: OfficeUser; activeConnectionCount: number } }
  | { type: typeof SERVER_MESSAGE.USER_MOVED; payload: MovePayload & { userId: string } }
  | { type: typeof SERVER_MESSAGE.USER_UPDATED; payload: { user: OfficeUser } }
  | { type: typeof SERVER_MESSAGE.USER_LEFT; payload: { userId: string; name: string; activeConnectionCount: number } }
  | { type: typeof SERVER_MESSAGE.NEW_CHAT; payload: ChatMessageBase }
  | { type: typeof SERVER_MESSAGE.USER_REACTION; payload: { userId: string; emoji: string } }
  | { type: typeof SERVER_MESSAGE.PONG; timestamp: number };
