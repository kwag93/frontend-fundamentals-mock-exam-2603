import { queryOptions } from '@tanstack/react-query';
import { getRooms, getReservations } from 'pages/remotes';

export const queryKeys = {
  rooms: ['rooms'] as const,
  reservations: ['reservations'] as const,
  myReservations: ['myReservations'] as const,
};

export const roomsQueryOptions = () =>
  queryOptions({
    queryKey: queryKeys.rooms,
    queryFn: getRooms,
  });

export const reservationsQueryOptions = (date: string) =>
  queryOptions({
    queryKey: [...queryKeys.reservations, date] as const,
    queryFn: () => getReservations(date),
    enabled: Boolean(date),
  });
