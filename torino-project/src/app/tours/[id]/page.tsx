import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { API_URL } from '@/lib/config';
import { fetchTour } from '@/lib/server-api';
import ReserveButton from '@/components/tours/ReserveButton';
import {
  formatJalaliDate,
  formatPrice,
  getTourDuration,
  placeLabel,
  toPersianDigits,
  vehicleLabel,
} from '@/utils/format';

interface TourPageProps {
  params: { id: string };
}

export async function generateMetadata({ params }: TourPageProps): Promise<Metadata> {
  const tour = await fetchTour(params.id).catch(() => null);
  return { title: tour ? tour.title : 'جزئیات تور' };
}

export default async function TourPage({ params }: TourPageProps) {
  const tour = await fetchTour(params.id);
  if (!tour) notFound();

  const { days, nights } = getTourDuration(tour.startDate, tour.endDate);

  const facts = [
    { label: 'مبدا', value: placeLabel(tour.origin.name) },
    { label: 'مقصد', value: placeLabel(tour.destination.name) },
    { label: 'حمل و نقل', value: vehicleLabel(tour.fleetVehicle) },
    { label: 'ظرفیت', value: `حداکثر ${toPersianDigits(tour.capacity)} نفر` },
    { label: 'صندلی باقی‌مانده', value: `${toPersianDigits(tour.availableSeats)} صندلی` },
    { label: 'بیمه', value: tour.insurance ? 'بیمه مسافرتی' : 'ندارد' },
    { label: 'تاریخ رفت', value: formatJalaliDate(tour.startDate) },
    { label: 'تاریخ برگشت', value: formatJalaliDate(tour.endDate) },
  ];

  return (
    <div className="container-page py-8">
      <div className="card grid gap-6 p-4 md:grid-cols-2 md:p-6">
        <img
          src={`${API_URL}${tour.image}`}
          alt={tour.title}
          className="h-64 w-full rounded-xl object-cover md:h-full"
        />

        <div className="flex flex-col">
          <div className="flex items-start justify-between gap-3">
            <h1 className="text-2xl font-extrabold">{tour.title}</h1>
            <p className="shrink-0 text-sm text-slate-500">
              {toPersianDigits(days)} روز و {toPersianDigits(nights)} شب
            </p>
          </div>

          <ul className="mt-4 flex flex-wrap gap-x-5 gap-y-2 text-xs text-slate-500">
            <li>✔ تورلیدر از مبدا</li>
            <li>✔ برنامه سفر</li>
            <li>✔ تضمین کیفیت</li>
          </ul>

          <dl className="mt-6 grid grid-cols-2 gap-4 text-sm">
            {facts.map((fact) => (
              <div key={fact.label}>
                <dt className="text-slate-500">{fact.label}</dt>
                <dd className="mt-1 font-medium">{fact.value}</dd>
              </div>
            ))}
          </dl>

          {tour.options.length > 0 && (
            <div className="mt-6">
              <h2 className="mb-2 text-sm font-bold">امکانات تور</h2>
              <ul className="flex flex-wrap gap-2">
                {tour.options.map((option) => (
                  <li
                    key={option}
                    className="rounded-full bg-brand-50 px-3 py-1 text-xs text-brand-700"
                  >
                    {option}
                  </li>
                ))}
              </ul>
            </div>
          )}

          <div className="mt-8 flex flex-col-reverse items-stretch gap-4 border-t border-slate-100 pt-4 sm:flex-row sm:items-center sm:justify-between md:mt-auto">
            <ReserveButton tourId={tour.id} soldOut={tour.availableSeats <= 0} />
            <p className="text-2xl font-extrabold text-sky-600">
              {formatPrice(tour.price)} <span className="text-sm font-normal">تومان</span>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
