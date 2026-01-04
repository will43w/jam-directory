import { getJams } from '@/lib/services/jamService';
import { parseSearchParams } from '@/lib/utils/urlState';
import { Jam } from '@/lib/types';
import { SearchPageClient } from './SearchPageClient';

interface SearchPageProps {
  params: Promise<{ city: string }>;
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}

// URL search parameter parsing and data fetching
export default async function SearchPage({ params, searchParams }: SearchPageProps) {
  const resolvedParams = await params;
  const resolvedSearchParams = await searchParams;
  const filters = parseSearchParams(resolvedSearchParams);
  filters.city = resolvedParams.city;

  // Fetch data
  let jams: Jam[] = [];

  try {
    jams = await getJams(filters);
  } catch (error) {
    // Service not implemented yet - return empty results
    jams = [];
  }

  return (
    <SearchPageClient
      city={resolvedParams.city}
      jams={jams}
    />
  );
}

