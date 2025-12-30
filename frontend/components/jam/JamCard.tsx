import Link from 'next/link';
import type { Jam, UpcomingDate } from '@/lib/types';
import { formatDateTimeDisplay, formatDateDisplay } from '@/lib/utils/dateUtils';

interface JamCardProps {
  jam: Jam;
  nextUpcomingDate?: UpcomingDate;
}

export function JamCard({ jam, nextUpcomingDate }: JamCardProps) {
  return (
    <Link
      href={`/jams/${jam.id}`}
      className="block p-4 border border-gray-200 rounded-lg hover:border-blue-500 hover:shadow-md transition-all"
    >
      <div className="space-y-2">
        <h3 className="text-xl font-semibold text-gray-900">{jam.name}</h3>
        <p className="text-gray-600">{jam.venue_name}</p>
        {jam.venue_address && (
          <p className="text-sm text-gray-500">{jam.venue_address}</p>
        )}
        {nextUpcomingDate && (
          <div className="pt-2 border-t border-gray-100">
            <p className="text-sm font-medium text-gray-900">
              Next: {formatDateTimeDisplay(nextUpcomingDate.date, nextUpcomingDate.startTime)}
            </p>
            {nextUpcomingDate.status === 'cancelled' && (
              <p className="text-sm text-red-600">Cancelled</p>
            )}
          </div>
        )}
      </div>
    </Link>
  );
}

