import { getJams } from '@/lib/services/jamService';
import { getSchedulesByJamId } from '@/lib/services/scheduleService';
import { getOccurrencesByJamId } from '@/lib/services/occurrenceService';
import { parseSearchParams } from '@/lib/utils/urlState';
import { Jam, JamSchedule, JamOccurrence } from '@/lib/types';
import { SearchPageClient } from './SearchPageClient';

interface SearchPageProps {
  params: Promise<{ city: string }>;
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}

export default async function SearchPage({ params, searchParams }: SearchPageProps) {
  const resolvedParams = await params;
  const resolvedSearchParams = await searchParams;
  const filters = parseSearchParams(resolvedSearchParams);
  filters.city = resolvedParams.city;

  // Fetch data
  // TODO: Replace with actual Supabase implementation
  // For now, services will throw "Not implemented" errors, so we catch them
  let jams: Jam[] = [];
  const schedulesMap = new Map();
  const occurrencesMap = new Map();

  try {
    jams = await getJams(filters);
    
    // Fetch schedules and occurrences for each jam
    for (const jam of jams) {
      try {
        const schedules = await getSchedulesByJamId(jam.id);
        schedulesMap.set(jam.id, schedules);
      } catch (e) {
        // Service not implemented yet
        schedulesMap.set(jam.id, []);
      }
      
      try {
        const occurrences = await getOccurrencesByJamId(jam.id);
        occurrencesMap.set(jam.id, occurrences);
      } catch (e) {
        // Service not implemented yet
        occurrencesMap.set(jam.id, []);
      }
    }
  } catch (error) {
    // Service not implemented yet - return empty results
    jams = [];
  }

  // Convert Maps to plain objects for client component serialization
  const schedulesObj: Record<string, JamSchedule[]> = {};
  const occurrencesObj: Record<string, JamOccurrence[]> = {};
  for (const [jamId, schedules] of schedulesMap.entries()) {
    schedulesObj[jamId] = schedules;
  }
  for (const [jamId, occurrences] of occurrencesMap.entries()) {
    occurrencesObj[jamId] = occurrences;
  }

  return (
    <SearchPageClient
      city={resolvedParams.city}
      jams={jams}
      schedulesMap={schedulesObj}
      occurrencesMap={occurrencesObj}
      filters={{
        tonight: filters.tonight,
        days: filters.days,
        after: filters.after,
      }}
    />
  );
}

