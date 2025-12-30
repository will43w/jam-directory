import type { SearchFilters } from '@/lib/types';
import { INDEX_TO_WEEKDAY, WEEKDAY_TO_INDEX } from './constants';

/**
 * Parse Next.js searchParams to SearchFilters object
 */
export function parseSearchParams(
  searchParams: { [key: string]: string | string[] | undefined }
): SearchFilters {
  const filters: SearchFilters = {};
  
  if (searchParams.city && typeof searchParams.city === 'string') {
    filters.city = searchParams.city;
  }
  
  if (searchParams.search && typeof searchParams.search === 'string') {
    filters.search = searchParams.search;
  }
  
  if (searchParams.day) {
    const dayValues = typeof searchParams.day === 'string' ? [searchParams.day] : searchParams.day;
    const dayIndices = dayValues
      .map(dayValue => WEEKDAY_TO_INDEX[dayValue.toLowerCase()])
      .filter((dayIndex): dayIndex is number => dayIndex !== undefined);
    if (dayIndices.length > 0) {
      filters.days = dayIndices;
    }
  }
  
  if (searchParams.after && typeof searchParams.after === 'string') {
    filters.after = searchParams.after;
  }
  
  if (searchParams.tonight) {
    filters.tonight = searchParams.tonight === 'true' || searchParams.tonight === '1';
  }
  
  return filters;
}

/**
 * Serialize SearchFilters to URLSearchParams
 */
export function serializeSearchParams(filters: SearchFilters): URLSearchParams {
  const params = new URLSearchParams();
  
  if (filters.city) {
    params.set('city', filters.city);
  }
  
  if (filters.search) {
    params.set('search', filters.search);
  }
  
  if (filters.days && filters.days.length > 0) {
    filters.days.forEach((dayIndex) => {
      const weekdayName = INDEX_TO_WEEKDAY[dayIndex];
      if (weekdayName) {
        params.append('day', weekdayName);
      }
    });
  }
  
  if (filters.after) {
    params.set('after', filters.after);
  }
  
  if (filters.tonight) {
    params.set('tonight', 'true');
  }
  
  return params;
}

/**
 * Build URL with search params
 */
export function buildSearchUrl(basePath: string, filters: SearchFilters): string {
  const params = serializeSearchParams(filters);
  const queryString = params.toString();
  return queryString ? `${basePath}?${queryString}` : basePath;
}

