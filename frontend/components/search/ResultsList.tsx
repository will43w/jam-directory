'use client';

import type { Jam, UpcomingDate, JamSchedule, JamOccurrence } from '@/lib/types';
import { JamCard } from '@/components/jam/JamCard';
import { computeUpcomingDates } from '@/lib/utils/dateUtils';
import { isTonight } from '@/lib/utils/dateUtils';

interface ResultsListProps {
  jams: Jam[];
  schedulesMap: Map<string, JamSchedule[]> | Record<string, JamSchedule[]>;
  occurrencesMap: Map<string, JamOccurrence[]> | Record<string, JamOccurrence[]>;
  filters?: {
    tonight?: boolean;
    days?: number[];
    after?: string;
  };
}

export function ResultsList({
  jams,
  schedulesMap,
  occurrencesMap,
  filters,
}: ResultsListProps) {
  if (jams.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-600 text-lg">No jams found</p>
        <p className="text-gray-500 text-sm mt-2">Try adjusting your search or filters</p>
      </div>
    );
  }

  // Compute next upcoming date for each jam
  const jamResults = jams.map((jam) => {
    // Handle both Map and plain object formats
    const schedules = (schedulesMap instanceof Map ? schedulesMap.get(jam.id) : schedulesMap[jam.id]) || [];
    const occurrences = (occurrencesMap instanceof Map ? occurrencesMap.get(jam.id) : occurrencesMap[jam.id]) || [];
    
    let upcomingDates = computeUpcomingDates(schedules, occurrences, 1);
    
    // Apply filters
    if (filters?.tonight) {
      upcomingDates = upcomingDates.filter((date) => {
        const dateObj = new Date(date.date + 'T' + date.startTime);
        return isTonight(dateObj);
      });
    }
    
    if (filters?.days && filters.days.length > 0) {
      upcomingDates = upcomingDates.filter((date) => {
        const dateObj = new Date(date.date);
        return filters.days!.includes(dateObj.getDay());
      });
    }
    
    if (filters?.after) {
      upcomingDates = upcomingDates.filter((date) => {
        const [hours, minutes] = date.startTime.split(':').map(Number);
        const [filterHours, filterMinutes] = filters.after!.split(':').map(Number);
        const dateTime = hours * 60 + minutes;
        const filterTime = filterHours * 60 + filterMinutes;
        return dateTime >= filterTime;
      });
    }
    
    return {
      jam,
      nextUpcomingDate: upcomingDates[0],
    };
  });

  // Filter out jams with no matching upcoming dates
  const filteredResults = jamResults.filter((result) => result.nextUpcomingDate);

  return (
    <div className="space-y-4">
      {filteredResults.map(({ jam, nextUpcomingDate }) => (
        <JamCard key={jam.id} jam={jam} nextUpcomingDate={nextUpcomingDate} />
      ))}
    </div>
  );
}

