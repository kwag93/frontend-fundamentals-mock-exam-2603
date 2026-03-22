import { BookingFilter } from './useBookingSearchParams';

interface Room {
  id: string;
  name: string;
  floor: number;
  capacity: number;
  equipment: string[];
}

interface Reservation {
  roomId: string;
  date: string;
  start: string;
  end: string;
}

export function isFilterComplete(filter: BookingFilter): boolean {
  const { startTime, endTime, attendees } = filter;
  const hasTimeInputs = startTime !== '' && endTime !== '';
  return hasTimeInputs && endTime > startTime && attendees >= 1;
}

export function getFilterValidationError(filter: BookingFilter): string | null {
  const { startTime, endTime, attendees } = filter;
  const hasTimeInputs = startTime !== '' && endTime !== '';
  if (!hasTimeInputs) return null;
  if (endTime <= startTime) return '종료 시간은 시작 시간보다 늦어야 합니다.';
  if (attendees < 1) return '참석 인원은 1명 이상이어야 합니다.';
  return null;
}

export function filterAvailableRooms(
  rooms: Room[],
  reservations: Reservation[],
  filter: BookingFilter
): Room[] {
  const { date, startTime, endTime, attendees, equipment, preferredFloor } = filter;

  return rooms
    .filter(room => {
      if (room.capacity < attendees) {
        return false;
      }
      if (!equipment.every(eq => room.equipment.includes(eq))) {
        return false;
      }
      if (preferredFloor !== null && room.floor !== preferredFloor) {
        return false;
      }
      const hasConflict = reservations.some(
        r => r.roomId === room.id && r.date === date && r.start < endTime && r.end > startTime
      );
      return !hasConflict;
    })
    .sort((a, b) => {
      if (a.floor !== b.floor) {
        return a.floor - b.floor;
      }
      return a.name.localeCompare(b.name);
    });
}
