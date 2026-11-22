'use client';

import { useState } from 'react';
import Link from 'next/link';
import { API_URL } from '@/lib/config';
import type { Tour } from '@/types';
import {
  formatPrice,
  getTourDuration,
  jalaliMonthName,
  toPersianDigits,
  vehicleLabel,
} from '@/utils/format';

const PAGE_SIZE = 6;

function TourCard({ tour }: { tour: Tour }) {
  const { days } = getTourDuration(tour.startDate, tour.endDate);

  return (
    <article className="card overflow-hidden">
      <img
        src={`${API_URL}${tour.image}`}
        alt={tour.title}
        loading="lazy"
        className="h-44 w-full object-cover"
      />
      <div className="p-4">
        <h3 className="text-lg font-bold">{tour.title}</h3>
        <p className="mt-1 text-xs text-slate-500">
          {jalaliMonthName(tour.startDate)} ماه . {toPersianDigits(days)} روزه –{' '}
          {vehicleLabel(tour.fleetVehicle)} – {tour.insurance ? 'بیمه' : 'بدون بیمه'}
        </p>
      </div>
      <div className="flex items-center justify-between border-t border-slate-100 px-4 py-3">
        <Link href={`/tours/${tour.id}`} className="btn-primary h-9 px-6">
          رزرو
        </Link>
        <p className="text-sm font-semibold text-sky-600">
          {formatPrice(tour.price)} <span className="text-xs font-normal">تومان</span>
        </p>
      </div>
    </article>
  );
}

export default function TourList({ tours }: { tours: Tour[] }) {
  const [visible, setVisible] = useState(PAGE_SIZE);

  if (tours.length === 0) {
    return (
      <div className="card p-10 text-center text-sm text-slate-500">
        توری با این مشخصات پیدا نشد. فیلترها را تغییر دهید.
      </div>
    );
  }

  return (
    <>
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {tours.slice(0, visible).map((tour) => (
          <TourCard key={tour.id} tour={tour} />
        ))}
      </div>

      {visible < tours.length && (
        <div className="mt-6 text-center">
          <button
            type="button"
            onClick={() => setVisible((count) => count + PAGE_SIZE)}
            className="btn-outline"
          >
            مشاهده بیشتر
          </button>
        </div>
      )}
    </>
  );
}
