'use client';

import { useState, useTransition, type FormEvent } from 'react';
import { useRouter } from 'next/navigation';
import JalaliDatePicker from '@/components/ui/JalaliDatePicker';
import { ButtonSpinner } from '@/components/ui/Spinners';
import type { Place } from '@/types';
import { placeLabel } from '@/utils/format';

interface SearchFormProps {
  origins: Place[];
  destinations: Place[];
  initial: { originId?: string; destinationId?: string; startDate?: string };
}

export default function SearchForm({ origins, destinations, initial }: SearchFormProps) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [originId, setOriginId] = useState(initial.originId ?? '');
  const [destinationId, setDestinationId] = useState(initial.destinationId ?? '');
  const [startDate, setStartDate] = useState(initial.startDate ?? '');

  const hasFilters = Boolean(initial.originId || initial.destinationId || initial.startDate);

  const search = (event: FormEvent) => {
    event.preventDefault();
    const params = new URLSearchParams();
    if (originId) params.set('originId', originId);
    if (destinationId) params.set('destinationId', destinationId);
    if (startDate) params.set('startDate', startDate);
    const query = params.toString();
    startTransition(() => router.push(`/${query ? `?${query}` : ''}#tours`));
  };

  const clear = () => {
    setOriginId('');
    setDestinationId('');
    setStartDate('');
    startTransition(() => router.push('/#tours'));
  };

  return (
    <form
      onSubmit={search}
      className="card grid gap-3 p-4 shadow-sm md:grid-cols-[1fr_1fr_1fr_auto] md:items-end"
      aria-label="جستجوی تور"
    >
      <div>
        <label htmlFor="origin" className="mb-1 block text-xs text-slate-500">
          مبدا
        </label>
        <select
          id="origin"
          value={originId}
          onChange={(event) => setOriginId(event.target.value)}
          className="field"
        >
          <option value="">همه مبدأها</option>
          {origins.map((place) => (
            <option key={place.id} value={place.id}>
              {placeLabel(place.name)}
            </option>
          ))}
        </select>
      </div>

      <div>
        <label htmlFor="destination" className="mb-1 block text-xs text-slate-500">
          مقصد
        </label>
        <select
          id="destination"
          value={destinationId}
          onChange={(event) => setDestinationId(event.target.value)}
          className="field"
        >
          <option value="">همه مقصدها</option>
          {destinations.map((place) => (
            <option key={place.id} value={place.id}>
              {placeLabel(place.name)}
            </option>
          ))}
        </select>
      </div>

      <div>
        <label htmlFor="start-date" className="mb-1 block text-xs text-slate-500">
          تاریخ حرکت
        </label>
        <JalaliDatePicker
          id="start-date"
          value={startDate}
          onChange={setStartDate}
          placeholder="تاریخ"
          yearsBack={1}
          yearsForward={3}
        />
      </div>

      <div className="flex gap-2">
        <button type="submit" disabled={isPending} className="btn-primary flex-1 md:w-32">
          {isPending ? <ButtonSpinner /> : 'جستجو'}
        </button>
        {hasFilters && (
          <button type="button" onClick={clear} className="btn-outline">
            حذف فیلتر
          </button>
        )}
      </div>
    </form>
  );
}
