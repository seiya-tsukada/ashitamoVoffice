export const SERVER_PORT = 3000;
export const SERVER_HOST = "0.0.0.0";

// チャット履歴の保持・返却件数
export const CHAT_HISTORY_MAX = 200;
export const CHAT_HISTORY_API_LIMIT = 50;
export const CHAT_HISTORY_INIT_LIMIT = 30;

// システム通知の送信者情報
export const SYSTEM_SENDER = {
  id: "system",
  name: "システム通知",
  avatar: "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=150&auto=format&fit=crop&q=80",
} as const;
