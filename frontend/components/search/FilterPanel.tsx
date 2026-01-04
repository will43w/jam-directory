'use client';

import { useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { SKILL_LEVELS } from '@/lib/utils/constants';

export function FilterPanel() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [isOpen, setIsOpen] = useState(false);

  // Get all selected skill levels from URL params
  const selectedSkillLevels = searchParams.getAll('skill_level');

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

  // Count active filters for display
  const activeFilterCount = selectedSkillLevels.length;

  return (
    <div className="border border-gray-200 rounded-md bg-white">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full px-3 py-2 flex items-center justify-between text-left hover:bg-gray-50 rounded-md transition-colors"
      >
        <span className="text-sm font-medium text-gray-800">
          Filters {activeFilterCount > 0 && `(${activeFilterCount})`}
        </span>
        <svg
          className={`w-4 h-4 text-gray-500 transform transition-transform ${isOpen ? 'rotate-180' : ''}`}
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </button>
      
      {isOpen && (
        <div className="px-3 pb-3 pt-2 space-y-3">
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
                    className="mr-2 w-4 h-4 text-blue-600 border-gray-300 rounded-sm focus:ring-blue-500"
                  />
                  <span className="text-sm text-gray-700">{skillLevel}</span>
                </label>
              ))}
            </div>
            {selectedSkillLevels.length === 0 && (
              <p className="text-xs text-gray-500 mt-2">No skill levels selected = show all levels</p>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

