export type PageType = 'office' | 'split-chat' | 'profile-booking';

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

export interface Member {
  id: string;
  name: string;
  nameEn: string;
  role: string;
  department: string;
  avatar: string;
  avatarMode?: AvatarMode;     // 'sprite' (全身SFCドット絵) or 'icon' (丸型アイコン)
  rpgClass: RpgJobClass;
  rpgLevel: number;
  status: UserStatus;
  customStatusMsg?: string;
  position: { x: number; y: number };
  currentZoneId: string;       // プロパティとしての居場所ID
  currentLocationName: string; // プロパティとしての居場所名
  isSpeaking?: boolean;
  voiceRange?: number;         // radius in px
  recentActivity?: string;
  bio: string;
  skills: string[];
  hobbies: string[];
  workingHours: string;
  timezone: string;
  email: string;
  slackHandle: string;
  availableSlots: TimeSlot[];
}

export interface TimeSlot {
  id: string;
  date: string; // YYYY-MM-DD
  time: string; // HH:mm - HH:mm
  available: boolean;
}

export interface Booking {
  id: string;
  memberId: string;
  memberName: string;
  memberAvatar: string;
  date: string;
  time: string;
  title: string;
  meetingType: 'casual' | '1on1' | 'review' | 'deep';
  location: string;
  notes?: string;
  createdAt: string;
}

export interface ChatMessage {
  id: string;
  senderId: string;
  senderName: string;
  senderAvatar: string;
  rpgClass?: RpgJobClass;
  isSelf: boolean;
  content: string;
  timestamp: string;
  reactions?: { emoji: string; count: number; userReacted: boolean }[];
  isAutonomous?: boolean;
  type?: 'text' | 'zone_announcement' | 'system';
  channelId?: string;
}

export interface OfficeZone {
  id: string;
  name: string;
  rpgName: string;
  x: number;
  y: number;
  width: number;
  height: number;
  type: 'cafe' | 'lounge' | 'focus' | 'meeting' | 'studio' | 'castle';
  color: string;
  description: string;
  icon: string;
}
