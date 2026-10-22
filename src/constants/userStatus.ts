import { UserStatus } from '../types';

export const USER_STATUSES: Record<string, UserStatus> = {
  online: { state: 'online', label: 'オンライン (Online)', emoji: '🟢', color: '#10B981' },
  busy: { state: 'busy', label: '会議中 (Busy)', emoji: '🔴', color: '#EF4444' },
  focus: { state: 'focus', label: '集中作業中 (Focus)', emoji: '🟣', color: '#A855F7' },
  away: { state: 'away', label: '離席中 (Away)', emoji: '🟡', color: '#F59E0B' },
  break: { state: 'break', label: '休憩中 (Break)', emoji: '☕️', color: '#3B82F6' },
};
