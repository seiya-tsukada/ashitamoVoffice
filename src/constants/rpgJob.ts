import { RpgJobClass } from '../types';

// アバター頭上に表示する職業ラベルと、rpgLevel 未設定時のレベル
export const RPG_JOB_LABELS: Record<RpgJobClass, { label: string; defaultLevel: number }> = {
  hero: { label: '勇者', defaultLevel: 5 },
  mage: { label: '魔導士', defaultLevel: 7 },
  knight: { label: '聖騎士', defaultLevel: 6 },
  cleric: { label: '僧侶', defaultLevel: 4 },
  scholar: { label: '賢者/Dev', defaultLevel: 8 },
  bard: { label: '詩人/UI', defaultLevel: 5 },
  robot: { label: 'AIロボ', defaultLevel: 99 },
  rogue: { label: '盗賊/Ops', defaultLevel: 5 },
  king: { label: 'ギルド長', defaultLevel: 10 },
};
