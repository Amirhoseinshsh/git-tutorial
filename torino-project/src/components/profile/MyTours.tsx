'use client';

import Link from 'next/link';
import { useQuery } from '@tanstack/react-query';
import { PageSpinner } from '@/components/ui/Spinners';
import { api } from '@/lib/api';
import type { Tour } from '@/types';
import { formatJalaliDate, formatPrice, placeLabel, vehicleLabel } from '@/utils/format';

function tourStatus(tour: Tour) {
  const now = Date.now();
  if (now > new Date(tour.endDate).getTime()) {
    return { label: 'به اتمام رسیده', className: 'bg-emerald-50 text-emerald-700' };
  }
  if (now >= new Date(tour.startDate).getTime()) {
    return { label: 'در حال برگزاری', className: 'bg-amber-50 text-amber-700' };
  }
  return { label: 'در انتظار برگزاری', className: 'bg-sky-50 text-sky-700' };
}

export default function MyTours() {
  const { data, isPending, isError } = useQuery({
    queryKey: ['user-tours'],
    queryFn: async () => (await api.get<Array<Tour | null>>('/user/tours')).data,
  });

  if (isPending) return <PageSpinner />;
  if (isError) {
    return (
      <p role="alert" className="card p-6 text-center text-sm text-red-600">
        دریافت تورهای شما ناموفق بود.
      </p>
    );
  }

  const tours = data.filter((tour): tour is Tour => Boolean(tour));

  if (tours.length === 0) {
    return (
      <div className="card p-8 text-center">
        <p className="text-sm text-slate-500">هنوز توری رزرو نکرده‌اید.</p>
        <Link href="/#tours" className="btn-primary mt-4">
          مشاهده تورها
        </Link>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {tours.map((tour, index) => {
        const status = tourStatus(tour);
        return (
          <article key={`${tour.id}-${index}`} className="card p-4">
            <div className="flex items-start justify-between gap-2">
              <h2 className="font-bold">{tour.title}</h2>
              <span className={`rounded-full px-3 py-1 text-xs ${status.className}`}>
                {status.label}
              </span>
            </div>
            <p className="mt-1 text-sm text-slate-600">
              {placeLabel(tour.origin.name)} به {placeLabel(tour.destination.name)} ·{' '}
              {vehicleLabel(tour.fleetVehicle)}
            </p>
            <dl className="mt-3 grid grid-cols-2 gap-3 text-sm">
              <div>
                <dt className="text-slate-500">تاریخ رفت</dt>
                <dd className="mt-1 font-medium">{formatJalaliDate(tour.startDate)}</dd>
              </div>
              <div>
                <dt className="text-slate-500">تاریخ برگشت</dt>
                <dd className="mt-1 font-medium">{formatJalaliDate(tour.endDate)}</dd>
              </div>
            </dl>
            <p className="mt-3 flex items-center justify-between border-t border-slate-100 pt-3 text-sm">
              <span className="text-slate-500">مبلغ پرداخت شده</span>
              <span className="font-bold">{formatPrice(tour.price)} تومان</span>
            </p>
          </article>
        );
      })}
    </div>
  );
}
