import type { UpcomingDate } from '@/lib/types';
import { formatDateTimeDisplay } from '@/lib/utils/dateUtils';

interface UpcomingDatesProps {
  dates: UpcomingDate[];
}

export function UpcomingDates({ dates }: UpcomingDatesProps) {
  if (dates.length === 0) {
    return <p className="text-gray-600">No upcoming dates</p>;
  }
  
  return (
    <ul className="space-y-3">
      {dates.map((date, index) => (
        <li key={index} className="flex items-start">
          <div className="flex-1">
            <p className="font-medium">
              {formatDateTimeDisplay(date.date, date.startTime)}
            </p>
            {date.endTime && (
              <p className="text-sm text-gray-600">
                Until {formatDateTimeDisplay(date.date, date.endTime).split(' at ')[1]}
              </p>
            )}
            {date.status === 'cancelled' && (
              <p className="text-sm text-red-600 font-medium mt-1">Cancelled</p>
            )}
            {date.status === 'moved' && (
              <p className="text-sm text-yellow-600 font-medium mt-1">Time changed</p>
            )}
            {date.notes && (
              <p className="text-sm text-gray-600 mt-1">{date.notes}</p>
            )}
          </div>
        </li>
      ))}
    </ul>
  );
}

