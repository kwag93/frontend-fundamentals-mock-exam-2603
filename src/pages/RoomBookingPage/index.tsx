import { css } from '@emotion/react';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { Top, Spacing, Border, Text } from '_tosslib/components';
import { colors } from '_tosslib/constants/colors';
import { FilterPanel } from './FilterPanel';
import { AvailableRoomList } from './AvailableRoomList';
import { BookButton } from './BookButton';
import { useBookingSearchParams } from './useBookingSearchParams';
import { getFilterValidationError, isFilterComplete, filterAvailableRooms } from './filterAvailableRooms';
import { roomsQuery, reservationsQuery } from './queries';

export function RoomBookingPage() {
  const navigate = useNavigate();
  const [filter] = useBookingSearchParams();
  const [selectedRoomId, setSelectedRoomId] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const { data: rooms = [] } = useQuery(roomsQuery);
  const { data: reservations = [] } = useQuery(reservationsQuery(filter.date));

  const validationError = getFilterValidationError(filter);
  const availableRooms = isFilterComplete(filter) ? filterAvailableRooms(rooms, reservations, filter) : [];

  const handleFilterChange = () => {
    setSelectedRoomId(null);
    setErrorMessage(null);
  };

  return (
    <div
      css={css`
        background: ${colors.white};
        padding-bottom: 40px;
      `}
    >
      <div
        css={css`
          padding: 12px 24px 0;
        `}
      >
        <button
          type="button"
          onClick={() => navigate('/')}
          aria-label="뒤로가기"
          css={css`
            background: none;
            border: none;
            padding: 0;
            cursor: pointer;
            font-size: 14px;
            color: ${colors.grey600};
            &:hover {
              color: ${colors.grey900};
            }
          `}
        >
          ← 예약 현황으로
        </button>
      </div>
      <Top.Top03
        css={css`
          padding-left: 24px;
          padding-right: 24px;
        `}
      >
        예약하기
      </Top.Top03>

      {errorMessage && (
        <div
          css={css`
            padding: 0 24px;
          `}
        >
          <Spacing size={12} />
          <div
            css={css`
              padding: 10px 14px;
              border-radius: 10px;
              background: ${colors.red50};
              display: flex;
              align-items: center;
              gap: 8px;
            `}
          >
            <Text typography="t7" fontWeight="medium" color={colors.red500}>
              {errorMessage}
            </Text>
          </div>
        </div>
      )}

      <Spacing size={24} />

      {/* 예약 조건 입력 */}
      <div
        css={css`
          padding: 0 24px;
        `}
      >
        <Text typography="t5" fontWeight="bold" color={colors.grey900}>
          예약 조건
        </Text>
        <Spacing size={16} />
        <FilterPanel onFilterChange={handleFilterChange} />
      </div>

      {validationError && (
        <div
          css={css`
            padding: 0 24px;
          `}
        >
          <Spacing size={8} />
          <span
            css={css`
              color: ${colors.red500};
              font-size: 14px;
            `}
            role="alert"
          >
            {validationError}
          </span>
        </div>
      )}

      <Spacing size={24} />
      <Border size={8} />
      <Spacing size={24} />

      {/* 예약 가능 회의실 목록 */}
      <div
        css={css`
          padding: 0 24px;
        `}
      >
        <div
          css={css`
            display: flex;
            align-items: baseline;
            gap: 6px;
          `}
        >
          <Text typography="t5" fontWeight="bold" color={colors.grey900}>
            예약 가능 회의실
          </Text>
          <Text typography="t7" fontWeight="medium" color={colors.grey500}>
            {availableRooms.length}개
          </Text>
        </div>
        <Spacing size={16} />
        <AvailableRoomList
          filter={filter}
          selectedRoomId={selectedRoomId}
          onSelect={setSelectedRoomId}
        />
      </div>

      <Spacing size={16} />

      <div
        css={css`
          padding: 0 24px;
        `}
      >
        <BookButton
          filter={filter}
          selectedRoomId={selectedRoomId}
          onSelect={setSelectedRoomId}
          setErrorMessage={setErrorMessage}
          onBookingSuccess={() => navigate('/', { state: { message: '예약이 완료되었습니다!' } })}
        />
      </div>

      <Spacing size={24} />
    </div>
  );
}
