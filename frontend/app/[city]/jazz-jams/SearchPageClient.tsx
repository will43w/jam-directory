'use client';

import { useState } from 'react';
import { SearchBar } from '@/components/search/SearchBar';
import { ResultsList } from '@/components/search/ResultsList';
import { NewJamSuggestionModal } from '@/components/jam/NewJamSuggestionModal';
import { Button } from '@/components/ui/Button';
import type { Jam } from '@/lib/types';

interface SearchPageClientProps {
  city: string;
  jams: Jam[];
}

// Data displayed in the search page
export function SearchPageClient({
  city,
  jams,
}: SearchPageClientProps) {
  const [isSuggestionModalOpen, setIsSuggestionModalOpen] = useState(false);

  return (
    <>
      <div className="min-h-screen bg-white">
        <div className="max-w-3xl mx-auto p-3 sm:p-4 space-y-2">
          <div>
              <h1 className="text-2xl font-semibold text-gray-900 mb-1">
              Jazz Jams in {city.charAt(0).toUpperCase() + city.slice(1)}
              </h1>
              <p className="text-gray-600 text-sm">Find jazz jam sessions near you</p>
          </div>

          <div>
              <SearchBar />
          </div>

          <div>
              <Button
              onClick={() => setIsSuggestionModalOpen(true)}
              variant="secondary"
              className="w-full md:w-auto"
              >
              Know a jam we&apos;re missing? Tell us!
              </Button>
          </div>

          <div>
              <ResultsList jams={jams} />
          </div>
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

