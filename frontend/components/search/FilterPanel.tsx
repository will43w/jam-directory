'use client';

import { useRouter, useSearchParams } from 'next/navigation';
import { WEEKDAYS, INDEX_TO_WEEKDAY } from '@/lib/utils/constants';

export function FilterPanel() {
  const router = useRouter();
  const searchParams = useSearchParams();

  // Get all selected days from URL params
  const selectedDays = searchParams.getAll('day').map(dayName => {
    const entry = Object.entries(INDEX_TO_WEEKDAY).find(([_, name]) => name === dayName);
    return entry ? Number(entry[0]) : null;
  }).filter((day): day is number => day !== null);

  const tonight = searchParams.get('tonight') === 'true';

  const handleDayToggle = (dayIndex: number) => {
    const params = new URLSearchParams(searchParams.toString());
    const dayName = INDEX_TO_WEEKDAY[dayIndex];
    
    if (!dayName) return;

    const currentDayValues = params.getAll('day');
    const isSelected = currentDayValues.includes(dayName);

    // Remove all day params and re-add only the ones we want
    params.delete('day');
    
    if (isSelected) {
      // Remove this day
      currentDayValues.filter(d => d !== dayName).forEach(d => params.append('day', d));
    } else {
      // Add this day
      currentDayValues.forEach(d => params.append('day', d));
      params.append('day', dayName);
    }

    router.push(`?${params.toString()}`);
  };

  const handleTonightToggle = () => {
    const params = new URLSearchParams(searchParams.toString());
    if (tonight) {
      params.delete('tonight');
    } else {
      params.set('tonight', 'true');
      params.delete('day'); // Clear day filter when using tonight
    }
    router.push(`?${params.toString()}`);
  };

  return (
    <div className="space-y-4 p-4 bg-gray-50 rounded-lg">
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Filter by day
        </label>
        <div className="space-y-2">
          {WEEKDAYS.map((day, index) => (
            <label key={index} className="flex items-center">
              <input
                type="checkbox"
                checked={selectedDays.includes(index)}
                onChange={() => handleDayToggle(index)}
                disabled={tonight}
                className="mr-2 w-5 h-5 text-blue-600 border-gray-300 rounded focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
              />
              <span className="text-sm text-gray-700">{day}</span>
            </label>
          ))}
        </div>
        {selectedDays.length === 0 && !tonight && (
          <p className="text-xs text-gray-500 mt-2">No days selected = show all days</p>
        )}
      </div>

      <div>
        <label className="flex items-center">
          <input
            type="checkbox"
            checked={tonight}
            onChange={handleTonightToggle}
            className="mr-2 w-5 h-5 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
          />
          <span className="text-sm font-medium text-gray-700">Tonight only</span>
        </label>
      </div>
    </div>
  );
}

