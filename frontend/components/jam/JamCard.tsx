import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import type { Jam } from '@/lib/types';
import { calculateDistance } from '@/lib/services/jamService';

interface JamCardProps {
  jam: Jam;
}

export function JamCard({ jam }: JamCardProps) {
  const searchParams = useSearchParams();
  const latitude = searchParams.get('latitude');
  const longitude = searchParams.get('longitude');
  
  const formatDistance = (distance: number): string => {
    if (distance < 1) {
      return `${Math.round(distance * 1000)}m`;
    }
    return `${distance.toFixed(1)}km`;
  };

  // Calculate distance if location filter is active and jam has coordinates
  let distance: number | undefined;
  if (latitude && longitude && jam.latitude !== null && jam.longitude !== null) {
    distance = calculateDistance(
      parseFloat(latitude),
      parseFloat(longitude),
      jam.latitude,
      jam.longitude
    );
  }

  const hasScheduleOrDistance = jam.schedule || distance !== undefined;

  return (
    <Link
      href={`/jams/${jam.id}`}
      className="block p-3 border border-gray-300 rounded-md hover:border-gray-400 hover:bg-gray-50 transition-colors"
    >
      <div className="space-y-2">
        <h3 className="text-base font-semibold text-gray-900 leading-snug">{jam.name}</h3>
        <p className="text-sm text-gray-700">{jam.venue_name}</p>
        {jam.venue_address && (
          <p className="text-xs text-gray-600">{jam.venue_address}</p>
        )}
        {hasScheduleOrDistance && (
          <div className="pt-2 border-t border-gray-200">
            <p className="text-xs text-gray-700">
              {jam.schedule || ''}
              {jam.schedule && distance !== undefined && (
                <span className="text-gray-400 mx-2">•</span>
              )}
              {distance !== undefined && (
                <span className="text-gray-600">{formatDistance(distance)}</span>
              )}
            </p>
          </div>
        )}
      </div>
    </Link>
  );
}
