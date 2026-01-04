import type { SearchFilters } from '@/lib/types';

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
  
  if (searchParams.latitude && typeof searchParams.latitude === 'string') {
    const lat = parseFloat(searchParams.latitude);
    if (!isNaN(lat)) {
      filters.latitude = lat;
    }
  }
  
  if (searchParams.longitude && typeof searchParams.longitude === 'string') {
    const lng = parseFloat(searchParams.longitude);
    if (!isNaN(lng)) {
      filters.longitude = lng;
    }
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
  
  if (filters.latitude !== undefined) {
    params.set('latitude', filters.latitude.toString());
  }
  
  if (filters.longitude !== undefined) {
    params.set('longitude', filters.longitude.toString());
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

