import { Suspense } from 'react';
import { SearchBar } from '@/components/search/SearchBar';
import { FilterPanel } from '@/components/search/FilterPanel';
import { ResultsList } from '@/components/search/ResultsList';
import { getJams } from '@/lib/services/jamService';
import { getSchedulesByJamId } from '@/lib/services/scheduleService';
import { getOccurrencesByJamId } from '@/lib/services/occurrenceService';
import { parseSearchParams } from '@/lib/utils/urlState';
import { Jam, JamSchedule, JamOccurrence } from '@/lib/types';

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
    <div className="min-h-screen bg-white">
      <div className="max-w-4xl mx-auto px-4 py-8">
        <div className="mb-6">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Jazz Jams in {resolvedParams.city.charAt(0).toUpperCase() + resolvedParams.city.slice(1)}
          </h1>
          <p className="text-gray-600">Find and discover jazz jam sessions near you</p>
        </div>

        <div className="space-y-4 mb-6">
          <Suspense fallback={<div>Loading search...</div>}>
            <SearchBar />
          </Suspense>
          <FilterPanel />
        </div>

        <Suspense fallback={<div>Loading results...</div>}>
          <ResultsList
            jams={jams}
            schedulesMap={schedulesObj}
            occurrencesMap={occurrencesObj}
            filters={{
              tonight: filters.tonight,
              days: filters.days,
              after: filters.after,
            }}
          />
        </Suspense>
      </div>
    </div>
  );
}

