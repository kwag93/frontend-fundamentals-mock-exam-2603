import { useSearchParams } from 'react-router-dom';
import { formatDate } from 'pages/constants';

export function useDateParam(): [string, (date: string) => void] {
  const [searchParams, setSearchParams] = useSearchParams();
  const date = searchParams.get('date') || formatDate(new Date());

  const setDate = (newDate: string) => {
    setSearchParams(prev => {
      prev.set('date', newDate);
      return prev;
    });
  };

  return [date, setDate];
}
