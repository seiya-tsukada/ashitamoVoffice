import { Coffee, Layers, Sparkles, User } from 'lucide-react';
import { Booking } from '../types';

export type MeetingType = Booking['meetingType'];

// 予約可能な日付の選択肢
export const BOOKING_DATE_OPTIONS = [
  { date: '2026-08-24', label: '8/24 (月)', subtitle: '明日' },
  { date: '2026-08-25', label: '8/25 (火)', subtitle: '明後日' },
  { date: '2026-08-26', label: '8/26 (水)', subtitle: '水曜日' },
  { date: '2026-08-27', label: '8/27 (木)', subtitle: '木曜日' },
];

export const DEFAULT_BOOKING_DATE = BOOKING_DATE_OPTIONS[0].date;
export const DEFAULT_MEETING_TYPE: MeetingType = '1on1';
export const DEFAULT_MEETING_TITLE = 'ovice 1on1 ミーティング';
export const BOOKING_LOCATION = 'ovice バーチャル空間 (ラウンジ・個別ブース)';

export const MEETING_TYPE_OPTIONS = [
  { id: 'casual' as const, label: '15分 雑談・クイック相談', badge: '15min', icon: Coffee, color: 'bg-amber-50 text-amber-700 border-amber-200' },
  { id: '1on1' as const, label: '30分 定期1on1 / 相談', badge: '30min', icon: User, color: 'bg-blue-50 text-blue-700 border-blue-200' },
  { id: 'review' as const, label: '45分 デザイン・仕様レビュー', badge: '45min', icon: Layers, color: 'bg-purple-50 text-purple-700 border-purple-200' },
  { id: 'deep' as const, label: '60分 戦略ディスカッション', badge: '60min', icon: Sparkles, color: 'bg-emerald-50 text-emerald-700 border-emerald-200' },
];
