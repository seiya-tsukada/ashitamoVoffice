import { OfficeZone } from '../types';

export type OfficeFloor = 'rpg_office' | 'all';

export const OFFICE_FLOOR = {
  RPG_OFFICE: 'rpg_office',
  CONFERENCE: 'all',
} as const satisfies Record<string, OfficeFloor>;

// ================= RPGオフィス =================

export const OFFICE_ZONES: OfficeZone[] = [
  {
    id: 'guild_tavern',
    name: 'カフェスペース ＆ リフレッシュラウンジ',
    rpgName: '☕ カフェスペース ＆ リフレッシュラウンジ',
    type: 'cafe',
    x: 20,
    y: 50,
    width: 260,
    height: 200,
    description: 'コーヒーやお茶を片手に雑談や休憩を楽しむカウンター席。リラックスしたカジュアルな会話が生まれる場所。',
    color: 'bg-amber-500/20 border-amber-500 text-amber-200',
    icon: '☕',
  },
  {
    id: 'throne_lounge',
    name: 'メイン執務ラウンジ ＆ コラボレーションエリア',
    rpgName: '💼 メイン執務ラウンジ ＆ コラボレーションエリア',
    type: 'lounge',
    x: 285,
    y: 50,
    width: 380,
    height: 270,
    description: 'オープンスペースとミーティングソファ。空間音声で近くのメンバーと自然にディスカッションや情報共有ができます。',
    color: 'bg-red-500/20 border-red-500 text-red-200',
    icon: '💼',
  },
  {
    id: 'magic_library',
    name: '集中作業ブース ＆ サイレントスペース',
    rpgName: '🎧 集中作業ブース ＆ サイレントスペース',
    type: 'focus',
    x: 670,
    y: 50,
    width: 260,
    height: 200,
    description: '深い集中作業やコードレビューのためのサイレント空間。周囲の音声をミュートにして個人ワークに没頭できます。',
    color: 'bg-purple-500/20 border-purple-500 text-purple-200',
    icon: '🎧',
  },
  {
    id: 'forge_lab',
    name: 'プロジェクトルーム ＆ クリエイティブラボ',
    rpgName: '💡 プロジェクトルーム ＆ クリエイティブラボ',
    type: 'studio',
    x: 20,
    y: 350,
    width: 300,
    height: 200,
    description: '新機能の企画立案、UIモック作成、デザインプロトタイプ検討を行うクリエイティブルーム。',
    color: 'bg-cyan-500/20 border-cyan-500 text-cyan-200',
    icon: '💡',
  },
  {
    id: 'grand_hall',
    name: 'メインカンファレンスルーム (大会議室)',
    rpgName: '🏛️ メインカンファレンスルーム (大会議室)',
    type: 'meeting',
    x: 650,
    y: 350,
    width: 340,
    height: 200,
    description: '大画面ディスプレイを使ったクライアント商談、プレゼンテーション、全体定例ミーティングを行う大会議室。',
    color: 'bg-emerald-500/20 border-emerald-500 text-emerald-200',
    icon: '🏛️',
  },
];

// 居場所プロパティのセレクターに並べる順序
export const OFFICE_ZONE_SELECT_ORDER = [
  'throne_lounge',
  'guild_tavern',
  'magic_library',
  'forge_lab',
  'grand_hall',
] as const;

// どのゾーンにも該当しない場合・未設定時の居場所
export const DEFAULT_OFFICE_ZONE = {
  zoneId: 'throne_lounge',
  zoneName: '💼 メイン執務ラウンジ ＆ コラボレーションエリア',
} as const;

// RPGオフィスへ切り替えたときの移動先座標
export const DEFAULT_OFFICE_POSITION = { x: 440, y: 190 } as const;

// ================= 全体（大型カンファレンス） =================

export interface ConferenceZone {
  zoneId: string;
  zoneName: string;
  // セレクターで選択したときの移動先座標
  position: { x: number; y: number };
}

// セレクターに並べる順序で定義
export const CONFERENCE_ZONES = {
  main_stage: {
    zoneId: 'main_stage',
    zoneName: '🎤 メインステージ (基調講演・サミット)',
    position: { x: 455, y: 75 },
  },
  audience_seats: {
    zoneId: 'audience_seats',
    zoneName: '🪑 メインアリーナ (聴講・観客エリア)',
    position: { x: 455, y: 340 },
  },
  parking_lot: {
    zoneId: 'parking_lot',
    zoneName: '🅿️ 総合受付 ＆ エントランスエリア',
    position: { x: 105, y: 55 },
  },
  timetable_board: {
    zoneId: 'timetable_board',
    zoneName: '📋 総合案内インフォメーション ＆ タイムテーブル',
    position: { x: 105, y: 200 },
  },
  booth_area: {
    zoneId: 'booth_area',
    zoneName: '🏢 企業展示 ＆ スポンサーブースエリア',
    position: { x: 840, y: 220 },
  },
} as const satisfies Record<string, ConferenceZone>;

// カンファレンスマップの領域境界 (px)
export const CONFERENCE_ZONE_BOUNDS = {
  // これより左は受付・案内エリア
  sideAreaMaxX: 210,
  // 左エリアのうち、これより上は受付
  entranceMaxY: 105,
  // 210〜この値まではメインアリーナ、これより右は展示ブース
  arenaMaxX: 690,
  // アリーナのうち、これより上はメインステージ
  stageMaxY: 160,
} as const;
