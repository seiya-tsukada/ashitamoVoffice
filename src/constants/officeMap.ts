// オフィス空間キャンバスのサイズ (px)
export const OFFICE_MAP_WIDTH = 980;
export const OFFICE_MAP_HEIGHT = 620;

// アバターをドラッグで配置できる範囲 (px)
export const AVATAR_POSITION_BOUNDS = {
  minX: 35,
  maxX: 945,
  minY: 35,
  maxY: 585,
} as const;

// この距離 (px) 以上動いたらクリックではなくドラッグとみなす
export const DRAG_START_THRESHOLD_PX = 3;

export const ZOOM = {
  DEFAULT: 1,
  MIN: 0.75,
  MAX: 1.3,
  STEP: 0.1,
} as const;

// voiceRange 未設定時の音声到達半径 (px)
export const DEFAULT_VOICE_RANGE = 110;
// 2人の voiceRange 合計に対し、この割合以内の距離なら近接（空間音声接続）とみなす
export const PROXIMITY_RANGE_RATIO = 0.75;

// アバタークリック時のポップアップ配置
export const AVATAR_POPUP_LAYOUT = {
  offsetX: 35,
  maxLeft: 660,
  offsetY: 130,
  minTop: 20,
} as const;
