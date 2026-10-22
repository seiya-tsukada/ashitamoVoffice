// チャット入力欄のクイック定型文
export const QUICK_MESSAGE_TEMPLATES = [
  'お疲れ様です！',
  '今少しお時間大丈夫ですか？',
  '資料確認しました！✨',
  'カレンダー予約入れました📅',
];

// 相手の自動返信シミュレーション
export const AUTO_REPLY_DELAY_MS = 1400;
const AUTO_REPLY_QUOTE_LENGTH = 15;

export const buildAutoReplies = (userText: string): string[] => [
  `了解しました！「${userText.slice(0, AUTO_REPLY_QUOTE_LENGTH)}...」の件ですね。進めておきます！`,
  `ありがとうございます！ちょうどその件確認したかったところでした😊`,
  `共有助かります！カレンダー予約画面から1on1も調整できますのでぜひ！`,
  `ナイスです✨ 今日の夕方にovice空間で少しすり合わせしましょう！`,
];

// 自律発話を手動トリガーしたときのメッセージ接頭辞
export const NPC_AUTO_BOT_PREFIX = '💬 [NPC Auto-Bot] ';

// ツールバーから送れるリアクション
export const REACTION_EMOJIS = ['👏', '👍', '❤️', '🎉', '💡', '☕️', '🔥', '🙌'];
