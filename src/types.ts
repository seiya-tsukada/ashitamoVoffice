import type { ChatMessageBase, OfficeUser, RpgJobClass } from '../shared/types';

export type { AvatarMode, Position, RpgJobClass, UserStatus } from '../shared/types';

export type PageType = 'office' | 'split-chat' | 'profile-booking';

export interface Member extends OfficeUser {
  nameEn: string;
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

export interface ChatMessage extends ChatMessageBase {
  rpgClass?: RpgJobClass;
  isSelf: boolean;
  reactions?: { emoji: string; count: number; userReacted: boolean }[];
  isAutonomous?: boolean;
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
