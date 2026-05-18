import { DAY_NAMES } from './constants';

/**
 * 주어진 날짜가 속한 주의 시작(일요일)과 끝(토요일)을 반환
 */
export function getWeekRange(date: Date): [Date, Date] {
  const d = new Date(date);
  const day = d.getDay();
  const diff = d.getDate() - day; // 일요일 계산
  
  const startOfWeek = new Date(d.setDate(diff));
  const endOfWeek = new Date(d.setDate(diff + 6));
  
  return [startOfWeek, endOfWeek];
}

/**
 * 주어진 날짜가 속한 주와 다음 주 총 2주의 날짜 배열 반환
 */
export function getTwoWeeks(date: Date): Date[] {
  const [weekStart] = getWeekRange(date);
  const twoWeeks: Date[] = [];
  
  for (let i = 0; i < 14; i++) {
    const newDate = new Date(weekStart);
    newDate.setDate(weekStart.getDate() + i);
    twoWeeks.push(newDate);
  }
  
  return twoWeeks;
}

/**
 * 날짜를 YYYY-MM-DD 형식으로 반환
 */
export function formatDateToString(date: Date): string {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

/**
 * YYYY-MM-DD 형식의 문자열을 Date 객체로 변환
 */
export function parseStringToDate(dateStr: string): Date {
  const [year, month, day] = dateStr.split('-').map(Number);
  return new Date(year, month - 1, day);
}

/**
 * 두 날짜가 같은 날인지 확인
 */
export function isSameDay(date1: Date, date2: Date): boolean {
  return (
    date1.getFullYear() === date2.getFullYear() &&
    date1.getMonth() === date2.getMonth() &&
    date1.getDate() === date2.getDate()
  );
}

/**
 * 날짜를 "월 일" 형식으로 반환 (예: "5월 18일")
 */
export function formatDateToMonthDay(date: Date): string {
  const month = date.getMonth() + 1;
  const day = date.getDate();
  return `${month}월 ${day}일`;
}

/**
 * 날짜를 "요일" 형식으로 반환 (예: "월")
 */
export function formatDateToDayName(date: Date): string {
  return DAY_NAMES[date.getDay()];
}

/**
 * 주어진 날짜의 주 번호 반환 (연도 기준)
 */
export function getWeekNumber(date: Date): number {
  const firstDayOfYear = new Date(date.getFullYear(), 0, 1);
  const pastDaysOfYear = (date.getTime() - firstDayOfYear.getTime()) / 86400000;
  return Math.ceil((pastDaysOfYear + firstDayOfYear.getDay() + 1) / 7);
}

/**
 * 이전 주의 시작 날짜 반환
 */
export function getPreviousWeekStart(date: Date): Date {
  const d = new Date(date);
  const [weekStart] = getWeekRange(d);
  weekStart.setDate(weekStart.getDate() - 7);
  return weekStart;
}

/**
 * 다음 주의 시작 날짜 반환
 */
export function getNextWeekStart(date: Date): Date {
  const d = new Date(date);
  const [weekStart] = getWeekRange(d);
  weekStart.setDate(weekStart.getDate() + 7);
  return weekStart;
}
