import { jalaaliMonthLength, toGregorian, toJalaali } from 'jalaali-js';

export { jalaaliMonthLength };

export interface JalaliDate {
  jy: number;
  jm: number;
  jd: number;
}

export function jalaliFromIso(iso: string): JalaliDate | null {
  const match = /^(\d{4})-(\d{2})-(\d{2})/.exec(iso);
  if (!match) return null;
  return toJalaali(Number(match[1]), Number(match[2]), Number(match[3]));
}

export function isoFromJalali(jy: number, jm: number, jd: number): string {
  const { gy, gm, gd } = toGregorian(jy, jm, jd);
  return `${gy}-${String(gm).padStart(2, '0')}-${String(gd).padStart(2, '0')}`;
}

export function todayJalali(): JalaliDate {
  const now = new Date();
  return toJalaali(now.getFullYear(), now.getMonth() + 1, now.getDate());
}

/** 0 = Saturday ... 6 = Friday */
export function firstWeekdayIndex(jy: number, jm: number): number {
  const { gy, gm, gd } = toGregorian(jy, jm, 1);
  const day = new Date(Date.UTC(gy, gm - 1, gd)).getUTCDay();
  return (day + 1) % 7;
}
