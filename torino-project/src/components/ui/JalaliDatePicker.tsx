'use client';

import { useEffect, useRef, useState } from 'react';
import { JALALI_MONTHS, toPersianDigits } from '@/utils/format';
import {
  firstWeekdayIndex,
  isoFromJalali,
  jalaaliMonthLength,
  jalaliFromIso,
  todayJalali,
} from '@/utils/jalali';

interface JalaliDatePickerProps {
  value: string;
  onChange: (iso: string) => void;
  placeholder?: string;
  invalid?: boolean;
  id?: string;
  yearsBack?: number;
  yearsForward?: number;
}

const WEEKDAYS = ['ش', 'ی', 'د', 'س', 'چ', 'پ', 'ج'];

export default function JalaliDatePicker({
  value,
  onChange,
  placeholder = 'انتخاب تاریخ',
  invalid = false,
  id,
  yearsBack = 100,
  yearsForward = 3,
}: JalaliDatePickerProps) {
  const [open, setOpen] = useState(false);
  const [view, setView] = useState(() => {
    const base = jalaliFromIso(value) ?? todayJalali();
    return { jy: base.jy, jm: base.jm };
  });
  const rootRef = useRef<HTMLDivElement>(null);
  const selected = jalaliFromIso(value);

  useEffect(() => {
    if (!open) return;
    const onPointerDown = (event: MouseEvent) => {
      if (rootRef.current && !rootRef.current.contains(event.target as Node)) {
        setOpen(false);
      }
    };
    document.addEventListener('mousedown', onPointerDown);
    return () => document.removeEventListener('mousedown', onPointerDown);
  }, [open]);

  const toggle = () => {
    if (!open) {
      const base = jalaliFromIso(value) ?? todayJalali();
      setView({ jy: base.jy, jm: base.jm });
    }
    setOpen((current) => !current);
  };

  const shiftMonth = (step: number) => {
    setView(({ jy, jm }) => {
      const index = jy * 12 + (jm - 1) + step;
      return { jy: Math.floor(index / 12), jm: (index % 12) + 1 };
    });
  };

  const pick = (day: number) => {
    onChange(isoFromJalali(view.jy, view.jm, day));
    setOpen(false);
  };

  const today = open ? todayJalali() : null;
  const currentYear = today?.jy ?? view.jy;
  const years = Array.from(
    { length: yearsBack + yearsForward + 1 },
    (_, index) => currentYear - yearsBack + index,
  );

  const length = jalaaliMonthLength(view.jy, view.jm);
  const offset = firstWeekdayIndex(view.jy, view.jm);
  const cells: Array<number | null> = [
    ...Array.from({ length: offset }, () => null),
    ...Array.from({ length }, (_, index) => index + 1),
  ];

  const label = selected
    ? toPersianDigits(`${selected.jd} ${JALALI_MONTHS[selected.jm - 1]} ${selected.jy}`)
    : placeholder;

  return (
    <div ref={rootRef} className="relative">
      <button
        id={id}
        type="button"
        onClick={toggle}
        aria-haspopup="dialog"
        aria-expanded={open}
        className={`field flex items-center justify-between text-right ${
          invalid ? 'field-error' : ''
        } ${selected ? 'text-slate-800' : 'text-slate-400'}`}
      >
        <span>{label}</span>
        <span aria-hidden="true">📅</span>
      </button>

      {open && (
        <div
          role="dialog"
          aria-label="انتخاب تاریخ"
          className="absolute start-0 z-30 mt-1 w-72 max-w-[90vw] rounded-xl border border-slate-200 bg-white p-3 shadow-lg"
        >
          <div className="mb-3 flex items-center gap-2">
            <button
              type="button"
              onClick={() => shiftMonth(-1)}
              aria-label="ماه قبل"
              className="h-8 w-8 rounded-md text-lg hover:bg-slate-100"
            >
              ›
            </button>
            <select
              aria-label="ماه"
              value={view.jm}
              onChange={(event) => setView((v) => ({ ...v, jm: Number(event.target.value) }))}
              className="h-8 flex-1 rounded-md border border-slate-200 bg-white text-sm"
            >
              {JALALI_MONTHS.map((name, index) => (
                <option key={name} value={index + 1}>
                  {name}
                </option>
              ))}
            </select>
            <select
              aria-label="سال"
              value={view.jy}
              onChange={(event) => setView((v) => ({ ...v, jy: Number(event.target.value) }))}
              className="h-8 w-20 rounded-md border border-slate-200 bg-white text-sm"
            >
              {years.map((year) => (
                <option key={year} value={year}>
                  {toPersianDigits(year)}
                </option>
              ))}
            </select>
            <button
              type="button"
              onClick={() => shiftMonth(1)}
              aria-label="ماه بعد"
              className="h-8 w-8 rounded-md text-lg hover:bg-slate-100"
            >
              ‹
            </button>
          </div>

          <div className="grid grid-cols-7 gap-1 text-center text-xs text-slate-400">
            {WEEKDAYS.map((day) => (
              <span key={day}>{day}</span>
            ))}
          </div>

          <div className="mt-1 grid grid-cols-7 gap-1 text-center text-sm">
            {cells.map((day, index) => {
              if (day === null) return <span key={`blank-${index}`} />;
              const isSelected =
                selected?.jy === view.jy && selected.jm === view.jm && selected.jd === day;
              const isToday =
                today?.jy === view.jy && today.jm === view.jm && today.jd === day;
              return (
                <button
                  key={day}
                  type="button"
                  onClick={() => pick(day)}
                  className={`h-8 rounded-md ${
                    isSelected
                      ? 'bg-brand-500 text-white'
                      : isToday
                        ? 'border border-brand-500 text-brand-600'
                        : 'hover:bg-brand-50'
                  }`}
                >
                  {toPersianDigits(day)}
                </button>
              );
            })}
          </div>

          {value && (
            <button
              type="button"
              onClick={() => {
                onChange('');
                setOpen(false);
              }}
              className="mt-3 w-full text-xs text-slate-500 hover:text-red-600"
            >
              پاک کردن تاریخ
            </button>
          )}
        </div>
      )}
    </div>
  );
}
