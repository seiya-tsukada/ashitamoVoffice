import type { ElementType } from 'react';
import { Building2, Columns2, UserCheck } from 'lucide-react';
import { PageType } from '../types';

export const NAV_PAGES: { id: PageType; title: string; subtitle: string; icon: ElementType }[] = [
  {
    id: 'office',
    title: '1. オフィス空間',
    subtitle: 'バーチャル空間・アバター配置',
    icon: Building2,
  },
  {
    id: 'split-chat',
    title: '2. スプリットチャット',
    subtitle: '左アバター × 右自律チャット',
    icon: Columns2,
  },
  {
    id: 'profile-booking',
    title: '3. プロフィール＆予約',
    subtitle: '詳細情報＆カレンダー1on1予約',
    icon: UserCheck,
  },
];
