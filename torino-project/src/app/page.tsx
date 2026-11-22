import { fetchTours } from '@/lib/server-api';
import type { Place, Tour } from '@/types';
import SearchForm from '@/components/home/SearchForm';
import TourList from '@/components/home/TourList';
import CallBanner from '@/components/home/CallBanner';
import WhyTorino from '@/components/home/WhyTorino';

interface HomePageProps {
  searchParams: { originId?: string; destinationId?: string; startDate?: string };
}

function uniquePlaces(places: Place[]): Place[] {
  return Array.from(new Map(places.map((place) => [place.id, place])).values());
}

export default async function HomePage({ searchParams }: HomePageProps) {
  const { originId, destinationId, startDate } = searchParams;

  // The full list feeds the select options, the filtered list is rendered on the server
  const [allTours, tours]: [Tour[], Tour[]] = await Promise.all([
    fetchTours(),
    fetchTours({ originId, destinationId, startDate }),
  ]);

  return (
    <>
      <section className="bg-gradient-to-b from-brand-50 to-white">
        <div className="container-page py-10 text-center md:py-16">
          <p className="text-4xl" aria-hidden="true">
            ✈
          </p>
          <h1 className="mt-3 text-2xl font-extrabold leading-10 md:text-3xl">
            <span className="text-brand-600">تورینو</span> برگزار کننده بهترین تور های داخلی و
            خارجی
          </h1>
        </div>
      </section>

      <div className="container-page -mt-6 space-y-12 pb-4">
        <SearchForm
          origins={uniquePlaces(allTours.map((tour) => tour.origin))}
          destinations={uniquePlaces(allTours.map((tour) => tour.destination))}
          initial={{ originId, destinationId, startDate }}
        />

        <section id="tours" className="scroll-mt-20">
          <h2 className="mb-4 text-xl font-bold">همه تور ها</h2>
          <TourList key={`${originId}-${destinationId}-${startDate}`} tours={tours} />
        </section>

        <CallBanner />
        <WhyTorino />
      </div>
    </>
  );
}
