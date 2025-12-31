'use client';

import { useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { WEEKDAYS, INDEX_TO_WEEKDAY, SKILL_LEVELS } from '@/lib/utils/constants';

export function FilterPanel() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [isOpen, setIsOpen] = useState(false);

  // Get all selected days from URL params
  const selectedDays = searchParams.getAll('day').map(dayName => {
    const entry = Object.entries(INDEX_TO_WEEKDAY).find(([_, name]) => name === dayName);
    return entry ? Number(entry[0]) : null;
  }).filter((day): day is number => day !== null);

  // Get all selected skill levels from URL params
  const selectedSkillLevels = searchParams.getAll('skill_level');

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

  const handleSkillLevelToggle = (skillLevel: string) => {
    const params = new URLSearchParams(searchParams.toString());
    const currentSkillLevels = params.getAll('skill_level');
    const isSelected = currentSkillLevels.includes(skillLevel);

    // Remove all skill_level params and re-add only the ones we want
    params.delete('skill_level');
    
    if (isSelected) {
      // Remove this skill level
      currentSkillLevels.filter(sl => sl !== skillLevel).forEach(sl => params.append('skill_level', sl));
    } else {
      // Add this skill level
      currentSkillLevels.forEach(sl => params.append('skill_level', sl));
      params.append('skill_level', skillLevel);
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

  // Count active filters for display
  const activeFilterCount = selectedDays.length + selectedSkillLevels.length + (tonight ? 1 : 0);

  return (
    <div className="bg-gray-50 rounded-lg">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full px-4 py-3 flex items-center justify-between text-left hover:bg-gray-100 rounded-lg transition-colors"
      >
        <span className="text-sm font-medium text-gray-700">
          Filters {activeFilterCount > 0 && `(${activeFilterCount})`}
        </span>
        <svg
          className={`w-5 h-5 text-gray-500 transform transition-transform ${isOpen ? 'rotate-180' : ''}`}
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </button>
      
      {isOpen && (
        <div className="px-4 pb-4 pt-2 space-y-4">
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
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Filter by skill level
            </label>
            <div className="space-y-2">
              {SKILL_LEVELS.map((skillLevel) => (
                <label key={skillLevel} className="flex items-center">
                  <input
                    type="checkbox"
                    checked={selectedSkillLevels.includes(skillLevel)}
                    onChange={() => handleSkillLevelToggle(skillLevel)}
                    className="mr-2 w-5 h-5 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                  />
                  <span className="text-sm text-gray-700">{skillLevel}</span>
                </label>
              ))}
            </div>
            {selectedSkillLevels.length === 0 && (
              <p className="text-xs text-gray-500 mt-2">No skill levels selected = show all levels</p>
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
      )}
    </div>
  );
}

