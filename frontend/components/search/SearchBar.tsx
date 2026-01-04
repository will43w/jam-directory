'use client';

import { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { LocationModal } from './LocationModal';

export function SearchBar() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [searchValue, setSearchValue] = useState(searchParams.get('search') || '');
  const [isLocationModalOpen, setIsLocationModalOpen] = useState(false);

  // Check if location is already set
  const hasLocation = searchParams.has('latitude') && searchParams.has('longitude');

  useEffect(() => {
    const timeoutId = setTimeout(() => {
      const params = new URLSearchParams(searchParams.toString());
      if (searchValue) {
        params.set('search', searchValue);
      } else {
        params.delete('search');
      }
      router.push(`?${params.toString()}`);
    }, 300); // Debounce 300ms

    return () => clearTimeout(timeoutId);
  }, [searchValue, router, searchParams]);

  const handleNearMeClick = () => {
    if (hasLocation) {
      // Remove location if already set
      const params = new URLSearchParams(searchParams.toString());
      params.delete('latitude');
      params.delete('longitude');
      router.push(`?${params.toString()}`);
    } else {
      // Open modal to choose location
      setIsLocationModalOpen(true);
    }
  };

  const handleLocationSelect = (latitude: number, longitude: number) => {
    const params = new URLSearchParams(searchParams.toString());
    params.set('latitude', latitude.toString());
    params.set('longitude', longitude.toString());
    router.push(`?${params.toString()}`);
  };

  return (
    <>
      <div className="w-full space-y-2">
        <div className="flex gap-2">
          <input
            type="text"
            value={searchValue}
            onChange={(e) => setSearchValue(e.target.value)}
            placeholder="Search name, venue, keywords..."
            className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500 text-sm"
          />
          <button
            onClick={handleNearMeClick}
            className={`px-3 py-2 rounded-md font-medium transition-colors whitespace-nowrap text-sm ${
              hasLocation
                ? 'bg-blue-600 text-white hover:bg-blue-700'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200 border border-gray-300'
            }`}
            title={hasLocation ? 'Remove location filter' : 'Sort by proximity to your location'}
          >
            <span className="flex items-center gap-1">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-4 w-4"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={2}
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
                />
                <path strokeLinecap="round" strokeLinejoin="round" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
              {hasLocation ? 'Near Me ✓' : 'Near Me'}
            </span>
          </button>
        </div>
        {hasLocation && (
          <div className="text-xs text-blue-700 bg-blue-50 border border-blue-200 rounded-md px-3 py-2">
            Results sorted by distance from your location
          </div>
        )}
      </div>
      <LocationModal
        isOpen={isLocationModalOpen}
        onClose={() => setIsLocationModalOpen(false)}
        onLocationSelect={handleLocationSelect}
      />
    </>
  );
}

