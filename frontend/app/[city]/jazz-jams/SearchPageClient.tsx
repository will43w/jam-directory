'use client';

import { useState } from 'react';
import { SearchBar } from '@/components/search/SearchBar';
import { FilterPanel } from '@/components/search/FilterPanel';
import { ResultsList } from '@/components/search/ResultsList';
import { NewJamSuggestionModal } from '@/components/jam/NewJamSuggestionModal';
import { Button } from '@/components/ui/Button';
import type { Jam, JamSchedule, JamOccurrence, SearchFilters } from '@/lib/types';

interface SearchPageClientProps {
  city: string;
  jams: Jam[];
  schedulesMap: Record<string, JamSchedule[]>;
  occurrencesMap: Record<string, JamOccurrence[]>;
  filters: Pick<SearchFilters, 'tonight' | 'days' | 'after'>;
}

export function SearchPageClient({
  city,
  jams,
  schedulesMap,
  occurrencesMap,
  filters,
}: SearchPageClientProps) {
  const [isSuggestionModalOpen, setIsSuggestionModalOpen] = useState(false);

  return (
    <>
      <div className="min-h-screen bg-white">
        <div className="max-w-4xl mx-auto px-4 py-8">
          <div className="mb-6">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">
              Jazz Jams in {city.charAt(0).toUpperCase() + city.slice(1)}
            </h1>
            <p className="text-gray-600">Find and discover jazz jam sessions near you</p>
          </div>

          <div className="space-y-4 mb-6">
            <SearchBar />
            <FilterPanel />
          </div>

          <div className="mb-4">
            <Button
              onClick={() => setIsSuggestionModalOpen(true)}
              variant="secondary"
              className="w-full md:w-auto"
            >
              Know a jam we&apos;re missing? Tell us!
            </Button>
          </div>

          <ResultsList
            jams={jams}
            schedulesMap={schedulesMap}
            occurrencesMap={occurrencesMap}
            filters={filters}
          />
        </div>
      </div>
      <NewJamSuggestionModal
        isOpen={isSuggestionModalOpen}
        onClose={() => setIsSuggestionModalOpen(false)}
        city={city}
      />
    </>
  );
}

