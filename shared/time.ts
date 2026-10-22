const TIME_LOCALE = 'ja-JP';

// チャットのタイムスタンプ表示（例: "09:30"）
export const formatChatTimestamp = (date: Date = new Date()): string =>
  date.toLocaleTimeString(TIME_LOCALE, { hour: '2-digit', minute: '2-digit' });
