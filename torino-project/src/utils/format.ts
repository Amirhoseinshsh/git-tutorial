import { toJalaali } from 'jalaali-js';

const PERSIAN_DIGITS = '۰۱۲۳۴۵۶۷۸۹';
const ARABIC_DIGITS = '٠١٢٣٤٥٦٧٨٩';

export const JALALI_MONTHS = [
  'فروردین',
  'اردیبهشت',
  'خرداد',
  'تیر',
  'مرداد',
  'شهریور',
  'مهر',
  'آبان',
  'آذر',
  'دی',
  'بهمن',
  'اسفند',
];

export function toEnglishDigits(value: string): string {
  return value
    .replace(/[۰-۹]/g, (d) => String(PERSIAN_DIGITS.indexOf(d)))
    .replace(/[٠-٩]/g, (d) => String(ARABIC_DIGITS.indexOf(d)));
}

export function toPersianDigits(value: string | number): string {
  return String(value).replace(/\d/g, (d) => PERSIAN_DIGITS[Number(d)]);
}

/** yup transform: Persian digits to English, remove spaces and dashes */
export function cleanDigits(value: unknown): unknown {
  return typeof value === 'string' ? toEnglishDigits(value.replace(/[\s-]/g, '')) : value;
}

export function formatPrice(value: number): string {
  return toPersianDigits(String(Math.round(value)).replace(/\B(?=(\d{3})+(?!\d))/g, ','));
}

/** Date-only or UTC ISO values (tour dates, birth dates) */
export function formatJalaliDate(iso?: string): string {
  if (!iso) return '—';
  const date = new Date(iso);
  if (Number.isNaN(date.getTime())) return '—';
  const { jy, jm, jd } = toJalaali(
    date.getUTCFullYear(),
    date.getUTCMonth() + 1,
    date.getUTCDate(),
  );
  return toPersianDigits(`${jd} ${JALALI_MONTHS[jm - 1]} ${jy}`);
}

/** Timestamps shown in the user's local time (transactions) */
export function formatJalaliDateTime(iso: string): string {
  const date = new Date(iso);
  if (Number.isNaN(date.getTime())) return '—';
  const { jy, jm, jd } = toJalaali(date.getFullYear(), date.getMonth() + 1, date.getDate());
  const hours = String(date.getHours()).padStart(2, '0');
  const minutes = String(date.getMinutes()).padStart(2, '0');
  return toPersianDigits(
    `${jy}/${String(jm).padStart(2, '0')}/${String(jd).padStart(2, '0')} - ${hours}:${minutes}`,
  );
}

export function jalaliMonthName(iso: string): string {
  const date = new Date(iso);
  if (Number.isNaN(date.getTime())) return '';
  const { jm } = toJalaali(
    date.getUTCFullYear(),
    date.getUTCMonth() + 1,
    date.getUTCDate(),
  );
  return JALALI_MONTHS[jm - 1];
}

export function getTourDuration(start: string, end: string) {
  const diff = Math.round((new Date(end).getTime() - new Date(start).getTime()) / 86_400_000);
  const nights = Math.max(diff, 0);
  return { nights, days: nights + 1 };
}

const VEHICLES: Record<string, string> = {
  bus: 'اتوبوس',
  airplane: 'هواپیما',
  ship: 'کشتی',
  train: 'قطار',
  SUV: 'خودرو شاسی‌بلند',
};

const PLACES: Record<string, string> = {
  Tehran: 'تهران',
  Sananndaj: 'سنندج',
  Madrid: 'مادرید',
  Isfahan: 'اصفهان',
  Sulaymaniyah: 'سلیمانیه',
  Hewler: 'هولر',
  Mazandaran: 'مازندران',
  Gilan: 'گیلان',
  Italy: 'ایتالیا',
};

export function vehicleLabel(vehicle: string): string {
  return VEHICLES[vehicle] ?? vehicle;
}

export function placeLabel(name: string): string {
  return PLACES[name] ?? name;
}
