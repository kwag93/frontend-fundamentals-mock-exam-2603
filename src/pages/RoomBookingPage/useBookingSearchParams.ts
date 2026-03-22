import { useSearchParams } from 'react-router-dom';
import { formatDate } from 'pages/constants';

export interface BookingFilter {
  date: string;
  startTime: string;
  endTime: string;
  attendees: number;
  equipment: string[];
  preferredFloor: number | null;
}

type SetBookingFilter = (partial: Partial<BookingFilter>) => void;

export function useBookingSearchParams(): [BookingFilter, SetBookingFilter] {
  const [searchParams, setSearchParams] = useSearchParams();

  const filter: BookingFilter = {
    date: searchParams.get('date') || formatDate(new Date()),
    startTime: searchParams.get('startTime') || '',
    endTime: searchParams.get('endTime') || '',
    attendees: Number(searchParams.get('attendees')) || 1,
    equipment: searchParams.get('equipment')?.split(',').filter(Boolean) ?? [],
    preferredFloor: searchParams.get('floor') ? Number(searchParams.get('floor')) : null,
  };

  const setFilter: SetBookingFilter = partial => {
    setSearchParams(
      prev => {
        const entries: Record<string, (val: unknown) => string | null> = {
          date: val => (val as string) || null,
          startTime: val => (val as string) || null,
          endTime: val => (val as string) || null,
          attendees: val => ((val as number) > 1 ? String(val) : null),
          equipment: val => ((val as string[]).length > 0 ? (val as string[]).join(',') : null),
          preferredFloor: val => (val !== null ? String(val) : null),
        };

        const paramKeys: Record<string, string> = {
          date: 'date',
          startTime: 'startTime',
          endTime: 'endTime',
          attendees: 'attendees',
          equipment: 'equipment',
          preferredFloor: 'floor',
        };

        for (const [key, value] of Object.entries(partial)) {
          const serialized = entries[key]?.(value) ?? null;
          const paramKey = paramKeys[key] ?? key;
          if (serialized === null) {
            prev.delete(paramKey);
          } else {
            prev.set(paramKey, serialized);
          }
        }

        return prev;
      },
      { replace: true }
    );
  };

  return [filter, setFilter];
}
