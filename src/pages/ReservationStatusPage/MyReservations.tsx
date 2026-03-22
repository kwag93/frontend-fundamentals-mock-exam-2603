import { css } from '@emotion/react';
import { Button, Text, ListRow } from '_tosslib/components';
import { colors } from '_tosslib/constants/colors';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { cancelReservation } from 'pages/remotes';
import { EQUIPMENT_LABELS } from './constant';
import { roomsQuery, myReservationsQuery, queryKeys } from './queries';
import type { Message } from './useMessage';

type SetMessage = (message: Message | null) => void;

export const MyReservations = ({ setMessage }: { setMessage: SetMessage }) => {
  const { data: rooms = [] } = useQuery(roomsQuery);
  const { data: myReservationList = [] } = useQuery(myReservationsQuery);
  const getRoomName = (roomId: string) =>
    rooms.find((r: { id: string; name: string }) => r.id === roomId)?.name ?? roomId;

  return (
    <>
      {myReservationList.length === 0 ? (
        <div
          css={css`
            padding: 40px 0;
            text-align: center;
            background: ${colors.grey50};
            border-radius: 14px;
          `}
        >
          <Text typography="t6" color={colors.grey500}>
            예약 내역이 없습니다.
          </Text>
        </div>
      ) : (
        <div
          css={css`
            display: flex;
            flex-direction: column;
            gap: 10px;
          `}
        >
          {myReservationList.map(
            (reservation: {
              id: string;
              roomId: string;
              date: string;
              start: string;
              end: string;
              attendees: number;
              equipment: string[];
            }) => (
              <div
                key={reservation.id}
                css={css`
                  padding: 14px 16px;
                  border-radius: 14px;
                  background: ${colors.grey50};
                  border: 1px solid ${colors.grey200};
                `}
              >
                <ListRow
                  contents={
                    <ListRow.Text2Rows
                      top={getRoomName(reservation.roomId)}
                      topProps={{ typography: 't6', fontWeight: 'bold', color: colors.grey900 }}
                      bottom={`${reservation.date} ${reservation.start}~${reservation.end} · ${
                        reservation.attendees
                      }명 · ${reservation.equipment.map((e: string) => EQUIPMENT_LABELS[e]).join(', ') || '장비 없음'}`}
                      bottomProps={{ typography: 't7', color: colors.grey600 }}
                    />
                  }
                  right={<CancelButton id={reservation.id} setMessage={setMessage} />}
                />
              </div>
            )
          )}
        </div>
      )}
    </>
  );
};

const CancelButton = ({ id, setMessage }: { id: string; setMessage: SetMessage }) => {
  const queryClient = useQueryClient();
  const cancelMutation = useMutation((id: string) => cancelReservation(id), {
    onSuccess: () => {
      queryClient.invalidateQueries(queryKeys.reservations);
      queryClient.invalidateQueries(queryKeys.myReservations);
    },
  });

  // 상태관리
  const handleCancel = async (id: string) => {
    try {
      await cancelMutation.mutateAsync(id);
      setMessage({ type: 'success', text: '예약이 취소되었습니다.' });
    } catch {
      setMessage({ type: 'error', text: '취소에 실패했습니다.' });
    }
  };

  return (
    <Button
      type="danger"
      style="weak"
      size="small"
      onClick={e => {
        e.stopPropagation();
        if (window.confirm('정말 취소하시겠습니까?')) {
          handleCancel(id);
        }
      }}
    >
      취소
    </Button>
  );
};
