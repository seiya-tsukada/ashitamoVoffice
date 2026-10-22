// サーバー側の型定義

export interface UserPosition {
  x: number;
  y: number;
}

export interface UserSessionData {
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

export interface ChatMessageData {
  id: string;
  senderId: string;
  senderName: string;
  senderAvatar: string;
  content: string;
  timestamp: string;
  type: "text" | "zone_announcement" | "system";
  channelId?: string;
}
