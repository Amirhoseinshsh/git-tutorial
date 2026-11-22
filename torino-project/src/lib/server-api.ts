import { API_URL } from './config';
import type { Tour } from '@/types';

type TourFilters = {
  originId?: string;
  destinationId?: string;
  startDate?: string;
};

// The API returns a full image URL (http://localhost:6500/static/...).
// Keep only the path so the components can prefix it with API_URL.
function normalizeTour(tour: Tour): Tour {
  return { ...tour, image: tour.image.replace(/^https?:\/\/[^/]+/, '') };
}

export async function fetchTours(filters: TourFilters = {}): Promise<Tour[]> {
  const params = new URLSearchParams();
  Object.entries(filters).forEach(([key, value]) => {
    if (value) params.set(key, value);
  });
  const query = params.toString();
  const url = API_URL + '/tour' + (query ? '?' + query : '');

  const res = await fetch(url, { next: { revalidate: 30 } });
  if (!res.ok) throw new Error('Failed to load tours');
  const tours: Tour[] = await res.json();
  return tours.map(normalizeTour);
}

export async function fetchTour(id: string): Promise<Tour | null> {
  const url = API_URL + '/tour/' + encodeURIComponent(id);

  const res = await fetch(url, { next: { revalidate: 30 } });
  if (res.status === 404) return null;
  if (!res.ok) throw new Error('Failed to load tour');
  return normalizeTour(await res.json());
}