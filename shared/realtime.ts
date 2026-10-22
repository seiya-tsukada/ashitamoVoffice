// クライアント・サーバー間で共有するリアルタイム通信の定数

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
