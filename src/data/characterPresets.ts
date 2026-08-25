import { RpgJobClass } from '../types';

export interface CharacterPreset {
  id: string;
  name: string;
  jobClass: RpgJobClass;
  level: number;
  avatarUrl: string;
  description: string;
}

export const CHARACTER_PRESETS: CharacterPreset[] = [
  {
    id: 'hero',
    name: '勇者 (Hero)',
    jobClass: 'hero',
    level: 5,
    avatarUrl: 'https://images.unsplash.com/photo-1573497019940-1c28c88b4f3e?w=150&auto=format&fit=crop&q=80',
    description: '青マントと剣を携えたリーダータイプ',
  },
  {
    id: 'mage',
    name: '魔法使い (Mage)',
    jobClass: 'mage',
    level: 7,
    avatarUrl: 'https://images.unsplash.com/photo-1581092918056-0c4c3acd3789?w=150&auto=format&fit=crop&q=80',
    description: '紫ローブとクリスタル杖の知性派',
  },
  {
    id: 'knight',
    name: '聖騎士 (Knight)',
    jobClass: 'knight',
    level: 6,
    avatarUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80',
    description: '白銀の甲冑と大盾を持つディフェンダー',
  },
  {
    id: 'cleric',
    name: '僧侶 (Cleric)',
    jobClass: 'cleric',
    level: 4,
    avatarUrl: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?w=150&auto=format&fit=crop&q=80',
    description: '聖なる十字架とロッドで癒やすヒーラー',
  },
  {
    id: 'scholar',
    name: '賢者/Dev (Scholar)',
    jobClass: 'scholar',
    level: 8,
    avatarUrl: 'https://images.unsplash.com/photo-1596075780750-81249df16d19?w=150&auto=format&fit=crop&q=80',
    description: 'メガネと魔導書を操るテックマスター',
  },
  {
    id: 'bard',
    name: '吟遊詩人/UI (Bard)',
    jobClass: 'bard',
    level: 5,
    avatarUrl: 'https://images.unsplash.com/photo-1628157582853-a796fa650a6a?w=150&auto=format&fit=crop&q=80',
    description: '羽帽子とパレットを持つクリエイター',
  },
  {
    id: 'robot',
    name: '魔導メカ/AI (Robot)',
    jobClass: 'robot',
    level: 99,
    avatarUrl: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=150&auto=format&fit=crop&q=80',
    description: 'メタルボディとLEDアイの自律AI',
  },
  {
    id: 'rogue',
    name: '盗賊/Ops (Rogue)',
    jobClass: 'rogue',
    level: 5,
    avatarUrl: 'https://images.unsplash.com/photo-1522529599102-193c0d76b5b6?w=150&auto=format&fit=crop&q=80',
    description: '深緑フードと短剣で素早く動く敏腕',
  },
  {
    id: 'king',
    name: 'ギルド長 (King)',
    jobClass: 'king',
    level: 10,
    avatarUrl: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=150&auto=format&fit=crop&q=80',
    description: '王冠と豪奢なマントのギルドプレジデント',
  },
];

export const PHOTO_AVATAR_OPTIONS = [
  { id: 'p1', url: 'https://images.unsplash.com/photo-1573497019940-1c28c88b4f3e?w=150&auto=format&fit=crop&q=80', label: '女性 (スーツ/ビジネス)' },
  { id: 'p2', url: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80', label: '男性 (スーツ/マネージャー)' },
  { id: 'p3', url: 'https://images.unsplash.com/photo-1581092918056-0c4c3acd3789?w=150&auto=format&fit=crop&q=80', label: '女性 (オフィス/プロダクト)' },
  { id: 'p4', url: 'https://images.unsplash.com/photo-1596075780750-81249df16d19?w=150&auto=format&fit=crop&q=80', label: '男性 (メガネ/エンジニア)' },
  { id: 'p5', url: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?w=150&auto=format&fit=crop&q=80', label: '女性 (笑顔/セールス)' },
  { id: 'p6', url: 'https://images.unsplash.com/photo-1628157582853-a796fa650a6a?w=150&auto=format&fit=crop&q=80', label: '男性 (カジュアル/デザイン)' },
  { id: 'p7', url: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=150&auto=format&fit=crop&q=80', label: '女性 (スマート/企画)' },
  { id: 'p8', url: 'https://images.unsplash.com/photo-1522529599102-193c0d76b5b6?w=150&auto=format&fit=crop&q=80', label: '男性 (爽やか/営業)' },
  { id: 'p9', url: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80', label: '女性 (ナチュラル/広報)' },
  { id: 'p10', url: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=150&auto=format&fit=crop&q=80', label: '男性 (テックリード/開発)' },
  { id: 'p11', url: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150&auto=format&fit=crop&q=80', label: '女性 (エグゼクティブ)' },
  { id: 'p12', url: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&auto=format&fit=crop&q=80', label: '男性 (ディレクター)' },
  { id: 'p13', url: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150&auto=format&fit=crop&q=80', label: 'イラスト (アバター)' },
  { id: 'p14', url: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=150&auto=format&fit=crop&q=80', label: 'AI ロボット (アシスタント)' },
];
