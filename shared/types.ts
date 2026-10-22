// クライアント・サーバー間で共有するドメイン型

export interface Position {
  x: number;
  y: number;
}

export interface UserStatus {
  state: 'online' | 'busy' | 'away' | 'focus' | 'break';
  label: string;
  emoji: string;
  color: string;
}

export type RpgJobClass =
  | 'hero'      // 勇者（青マント・剣）
  | 'mage'      // 魔法使い（紫ローブ・とんがり帽子・杖）
  | 'knight'    // 聖騎士（銀の甲冑・盾・赤マント）
  | 'cleric'    // 僧侶/ヒーラー（白緑ローブ・ホーリースタッフ）
  | 'scholar'   // 魔導学者/Dev（メガネ・魔導書）
  | 'bard'      // 吟遊詩人/UIデザイナー（羽帽子・パレット）
  | 'robot'     // 魔導メカ/AIアシスタント（メタルボディ・LEDアイ）
  | 'rogue'     // 盗賊/アサシン（深緑フード・短剣）
  | 'king';     // ギルド長/プレジデント（王冠・マント）

export type AvatarMode = 'sprite' | 'icon';

// オフィス空間内でリアルタイム同期されるユーザー情報
export interface OfficeUser {
  id: string;
  name: string;
  nameEn?: string;
  role: string;
  department: string;
  avatar: string;
  avatarMode?: AvatarMode;     // 'sprite' (全身SFCドット絵) or 'icon' (丸型アイコン)
  rpgClass: RpgJobClass;
  rpgLevel: number;
  status: UserStatus;
  customStatusMsg?: string;
  position: Position;
  currentZoneId: string;       // プロパティとしての居場所ID
  currentLocationName: string; // プロパティとしての居場所名
  isSpeaking?: boolean;
  voiceRange?: number;         // radius in px
}

export type ChatMessageType = 'text' | 'zone_announcement' | 'system';

// サーバーが配信するチャットメッセージ
export interface ChatMessageBase {
  id: string;
  senderId: string;
  senderName: string;
  senderAvatar: string;
  content: string;
  timestamp: string;
  type?: ChatMessageType;
  channelId?: string;
}
