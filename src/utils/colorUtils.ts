import { COLOR_PALETTE, ICON_LIST } from './constants';

/**
 * 팀원 ID 기반으로 색상 반환
 */
export function getColorByIndex(index: number): string {
  return COLOR_PALETTE[index % COLOR_PALETTE.length].hex;
}

/**
 * 팀원 ID 기반으로 Tailwind 클래스 반환
 */
export function getTailwindColorByIndex(index: number): string {
  return COLOR_PALETTE[index % COLOR_PALETTE.length].tailwind;
}

/**
 * 팀원 ID 기반으로 아이콘 반환
 */
export function getIconByIndex(index: number): string {
  return ICON_LIST[index % ICON_LIST.length];
}

/**
 * 랜덤 색상 선택
 */
export function getRandomColor(): string {
  return COLOR_PALETTE[Math.floor(Math.random() * COLOR_PALETTE.length)].hex;
}

/**
 * 랜덤 아이콘 선택
 */
export function getRandomIcon(): string {
  return ICON_LIST[Math.floor(Math.random() * ICON_LIST.length)];
}

/**
 * 텍스트 색상이 보이도록 배경색 기반 글자색 결정 (흑/백)
 */
export function getContrastTextColor(hexColor: string): string {
  const hex = hexColor.replace('#', '');
  const r = parseInt(hex.substr(0, 2), 16);
  const g = parseInt(hex.substr(2, 2), 16);
  const b = parseInt(hex.substr(4, 2), 16);
  const brightness = (r * 299 + g * 587 + b * 114) / 1000;
  return brightness > 155 ? '#000000' : '#FFFFFF';
}
