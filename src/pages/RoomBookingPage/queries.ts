import { getRooms, getReservations } from 'pages/remotes';

export const queryKeys = {
  rooms: ['rooms'] as const,
  reservations: ['reservations'] as const,
  myReservations: ['myReservations'] as const,
};

export const roomsQuery = {
  queryKey: queryKeys.rooms,
  queryFn: getRooms,
};

export const reservationsQuery = (date: string) => ({
  queryKey: [...queryKeys.reservations, date] as const,
  queryFn: () => getReservations(date),
  enabled: Boolean(date),
});
