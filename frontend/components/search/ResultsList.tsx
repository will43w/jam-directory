'use client';

import type { Jam } from '@/lib/types';
import { JamCard } from '@/components/jam/JamCard';

interface ResultsListProps {
  jams: Jam[];
}

export function ResultsList({
  jams,
}: ResultsListProps) {
  if (jams.length === 0) {
    return (
      <div className="text-center py-8">
        <p className="text-gray-800 text-sm font-medium">No jams found</p>
        <p className="text-gray-600 text-xs mt-1">Try adjusting your search</p>
      </div>
    );
  }

  return (
    <div className="space-y-2">
      {jams.map((jam) => (
        <JamCard key={jam.id} jam={jam} />
      ))}
    </div>
  );
}
