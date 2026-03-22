import { Button } from '_tosslib/components';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import axios from 'axios';
import { createReservation } from 'pages/remotes';
import { BookingFilter } from './useBookingSearchParams';
import { queryKeys } from './queries';

interface BookButtonProps {
  filter: BookingFilter;
  selectedRoomId: string | null;
  onSelect: (roomId: string | null) => void;
  setErrorMessage: (message: string | null) => void;
  onBookingSuccess: () => void;
}

export function BookButton({
  filter,
  selectedRoomId,
  onSelect,
  setErrorMessage,
  onBookingSuccess,
}: BookButtonProps) {
  const { date, startTime, endTime, attendees, equipment } = filter;
  const queryClient = useQueryClient();

  const createMutation = useMutation(
    (data: { roomId: string; date: string; start: string; end: string; attendees: number; equipment: string[] }) =>
      createReservation(data),
    {
      onSuccess: (_data, variables) => {
        queryClient.invalidateQueries([...queryKeys.reservations, variables.date]);
        queryClient.invalidateQueries(queryKeys.myReservations);
      },
    }
  );

  const handleBook = async () => {
    if (!selectedRoomId) {
      setErrorMessage('회의실을 선택해주세요.');
      return;
    }
    if (!startTime || !endTime) {
      setErrorMessage('시작 시간과 종료 시간을 선택해주세요.');
      return;
    }

    try {
      const result = await createMutation.mutateAsync({
        roomId: selectedRoomId,
        date,
        start: startTime,
        end: endTime,
        attendees,
        equipment,
      });

      if ('ok' in result && result.ok) {
        onBookingSuccess();
        return;
      }

      const errResult = result as { message?: string };
      setErrorMessage(errResult.message ?? '예약에 실패했습니다.');
      onSelect(null);
    } catch (err: unknown) {
      let serverMessage = '예약에 실패했습니다.';
      if (axios.isAxiosError(err)) {
        const data = err.response?.data as { message?: string } | undefined;
        serverMessage = data?.message ?? serverMessage;
      }
      setErrorMessage(serverMessage);
      onSelect(null);
    }
  };

  return (
    <Button display="full" onClick={handleBook} disabled={createMutation.isLoading}>
      {createMutation.isLoading ? '예약 중...' : '확정'}
    </Button>
  );
}
