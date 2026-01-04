'use client';

import { useState, useEffect, useRef } from 'react';
import { Modal } from '@/components/ui/Modal';
import { Button } from '@/components/ui/Button';

interface LocationModalProps {
  isOpen: boolean;
  onClose: () => void;
  onLocationSelect: (latitude: number, longitude: number) => void;
}

interface NominatimResult {
  place_id: number;
  display_name: string;
  lat: string;
  lon: string;
}

export function LocationModal({ isOpen, onClose, onLocationSelect }: LocationModalProps) {
  const [mode, setMode] = useState<'choice' | 'current' | 'manual'>('choice');
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<NominatimResult[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [isGettingLocation, setIsGettingLocation] = useState(false);
  const [locationError, setLocationError] = useState<string | null>(null);
  const searchTimeoutRef = useRef<NodeJS.Timeout | undefined>(undefined);

  // Clear search when modal closes
  useEffect(() => {
    if (!isOpen) {
      setMode('choice');
      setSearchQuery('');
      setSearchResults([]);
      setLocationError(null);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isOpen]);

  const handleUseCurrentLocation = () => {
    if (!navigator.geolocation) {
      setLocationError('Geolocation is not supported by your browser');
      return;
    }

    setIsGettingLocation(true);
    setLocationError(null);

    navigator.geolocation.getCurrentPosition(
      (position) => {
        onLocationSelect(position.coords.latitude, position.coords.longitude);
        onClose();
      },
      (error) => {
        setIsGettingLocation(false);
        switch (error.code) {
          case error.PERMISSION_DENIED:
            setLocationError('Location access denied. Please enable location permissions.');
            break;
          case error.POSITION_UNAVAILABLE:
            setLocationError('Location information unavailable.');
            break;
          case error.TIMEOUT:
            setLocationError('Location request timed out.');
            break;
          default:
            setLocationError('An unknown error occurred while getting your location.');
            break;
        }
      }
    );
  };

  const handleSearch = async (query: string) => {
    if (!query.trim()) {
      setSearchResults([]);
      return;
    }

    setIsSearching(true);
    try {
      // Use Nominatim API (free OpenStreetMap geocoding service)
      const response = await fetch(
        `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(query)}&limit=5&addressdetails=1`,
        {
          headers: {
            'User-Agent': 'JazzJamDirectory/1.0', // Required by Nominatim
          },
        }
      );

      if (!response.ok) {
        throw new Error('Failed to search locations');
      }

      const data: NominatimResult[] = await response.json();
      setSearchResults(data);
    } catch (error) {
      setLocationError('Failed to search locations. Please try again.');
      setSearchResults([]);
    } finally {
      setIsSearching(false);
    }
  };

  // Debounced search
  useEffect(() => {
    if (searchTimeoutRef.current) {
      clearTimeout(searchTimeoutRef.current);
    }

    if (mode === 'manual' && searchQuery.trim()) {
      searchTimeoutRef.current = setTimeout(() => {
        handleSearch(searchQuery);
      }, 300);
    } else {
      setSearchResults([]);
    }

    return () => {
      if (searchTimeoutRef.current) {
        clearTimeout(searchTimeoutRef.current);
      }
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchQuery, mode]);

  const handleSelectResult = (result: NominatimResult) => {
    console.log('handleSelectResult', result);
    onLocationSelect(parseFloat(result.lat), parseFloat(result.lon));
    onClose();
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Choose Location">
      <div className="space-y-4">
        {mode === 'choice' && (
          <>
            <p className="text-gray-600">
              How would you like to set your location?
            </p>
            <div className="space-y-3">
              <Button
                onClick={() => {
                  setMode('current');
                  handleUseCurrentLocation();
                }}
                className="w-full justify-start flex items-center gap-3"
                variant="outline"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-4 w-4 shrink-0"
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
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
                  />
                </svg>
                Use Current Location
              </Button>
              <Button
                onClick={() => setMode('manual')}
                className="w-full justify-start flex items-center gap-3"
                variant="outline"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-4 w-4 shrink-0"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth={2}
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                  />
                </svg>
                Choose a Location
              </Button>
            </div>
          </>
        )}

        {mode === 'current' && (
          <div className="space-y-3">
            {isGettingLocation && (
              <div className="flex items-center justify-center py-4">
                <svg
                  className="animate-spin h-6 w-6 text-blue-600"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                >
                  <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                  ></circle>
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                  ></path>
                </svg>
                <span className="ml-3 text-gray-600">Getting your location...</span>
              </div>
            )}
            {locationError && (
              <div className="text-sm text-red-600 bg-red-50 border border-red-200 rounded-lg px-4 py-2">
                {locationError}
              </div>
            )}
          </div>
        )}

        {mode === 'manual' && (
          <div className="space-y-3">
            <div>
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Enter postcode, address, or building name (e.g., Grand Hyatt Tokyo)"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                autoFocus
              />
              {isSearching && (
                <p className="text-sm text-gray-500 mt-2">Searching...</p>
              )}
            </div>

            {locationError && (
              <div className="text-sm text-red-600 bg-red-50 border border-red-200 rounded-lg px-4 py-2">
                {locationError}
              </div>
            )}

            {searchResults.length > 0 && (
              <div className="border border-gray-200 rounded-lg overflow-hidden">
                {searchResults.map((result) => (
                  <button
                    key={result.place_id}
                    onClick={() => handleSelectResult(result)}
                    className="w-full text-left px-4 py-3 hover:bg-gray-50 border-b border-gray-100 last:border-b-0 transition-colors"
                  >
                    <p className="text-sm font-medium text-gray-900">
                      {result.display_name}
                    </p>
                  </button>
                ))}
              </div>
            )}

            {searchQuery && !isSearching && searchResults.length === 0 && (
              <p className="text-sm text-gray-500 text-center py-4">
                No results found. Try a different search term.
              </p>
            )}
          </div>
        )}

        {mode !== 'choice' && (
          <div className="pt-3 border-t">
            <Button
              variant="ghost"
              onClick={() => {
                setMode('choice');
                setSearchQuery('');
                setSearchResults([]);
                setLocationError(null);
              }}
              className="w-full"
            >
              Back
            </Button>
          </div>
        )}
      </div>
    </Modal>
  );
}

