'use client';

import { useState, useEffect } from 'react';
import type { JamWithRelations, UpcomingDate, UpdateJamData } from '@/lib/types';
import { ScheduleDisplay } from './ScheduleDisplay';
import { UpcomingDates } from './UpcomingDates';
import { ContactSection } from './ContactSection';
import { Button } from '@/components/ui/Button';
import { computeUpcomingDates } from '@/lib/utils/dateUtils';

interface JamDetailProps {
  jam: JamWithRelations;
  onSuggestionClick: () => void;
  onEditClick?: () => void;
  isEditMode?: boolean;
  onJamUpdate?: (id: string, data: UpdateJamData) => Promise<void>;
  onScheduleCreate?: (data: any) => Promise<void>;
  onScheduleUpdate?: (id: string, data: any) => Promise<void>;
  onScheduleDelete?: (id: string) => Promise<void>;
  onOccurrenceCreate?: (data: any) => Promise<void>;
  onOccurrenceUpdate?: (id: string, data: any) => Promise<void>;
  onOccurrenceDelete?: (id: string) => Promise<void>;
  onContactCreate?: (data: any) => Promise<void>;
  onContactUpdate?: (id: string, data: any) => Promise<void>;
  onContactDelete?: (id: string) => Promise<void>;
  onCancelEdit?: () => void;
}

export function JamDetail({ 
  jam, 
  onSuggestionClick, 
  onEditClick,
  isEditMode = false,
  onJamUpdate,
  onScheduleCreate,
  onScheduleUpdate,
  onScheduleDelete,
  onOccurrenceCreate,
  onOccurrenceUpdate,
  onOccurrenceDelete,
  onContactCreate,
  onContactUpdate,
  onContactDelete,
  onCancelEdit,
}: JamDetailProps) {
  const [localJam, setLocalJam] = useState(jam);
  const [isSaving, setIsSaving] = useState(false);
  
  // Sync local state with prop when jam updates
  useEffect(() => {
    setLocalJam(jam);
  }, [jam]);
  
  const upcomingDates = computeUpcomingDates(jam.schedules, jam.occurrences, 6);

  const handleFieldChange = (field: keyof typeof localJam, value: any) => {
    setLocalJam({ ...localJam, [field]: value });
  };

  const handleSave = async () => {
    if (!onJamUpdate) return;
    setIsSaving(true);
    try {
      const updateData: UpdateJamData = {
        name: localJam.name,
        city: localJam.city,
        venue_name: localJam.venue_name,
        venue_address: localJam.venue_address,
        latitude: localJam.latitude,
        longitude: localJam.longitude,
        description: localJam.description,
        skill_level: localJam.skill_level,
        image_url: localJam.image_url,
        canonical_source_url: localJam.canonical_source_url,
      };
      await onJamUpdate(jam.id, updateData);
      if (onCancelEdit) {
        onCancelEdit();
      }
    } finally {
      setIsSaving(false);
    }
  };

  const handleCancel = () => {
    // Reset local state to original jam
    setLocalJam(jam);
    if (onCancelEdit) {
      onCancelEdit();
    }
  };

  return (
    <div className="space-y-6">
      {/* Hero Image */}
      {isEditMode ? (
        <div className="space-y-2">
          <label className="block text-sm font-medium text-gray-700">
            Image URL
          </label>
          <input
            type="url"
            value={localJam.image_url || ''}
            onChange={(e) => handleFieldChange('image_url', e.target.value || null)}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="https://example.com/image.jpg"
          />
          {localJam.image_url && (
            <div className="w-full h-64 md:h-96 bg-gray-200 rounded-lg overflow-hidden">
              <img
                src={localJam.image_url}
                alt={localJam.name}
                className="w-full h-full object-cover"
              />
            </div>
          )}
        </div>
      ) : (
        localJam.image_url && (
          <div className="w-full h-64 md:h-96 bg-gray-200 rounded-lg overflow-hidden">
            <img
              src={localJam.image_url}
              alt={localJam.name}
              className="w-full h-full object-cover"
            />
          </div>
        )
      )}
      
      {/* Basic Info */}
      <div className="relative">
        <div className="flex items-start justify-between gap-4">
          <div className="flex-1">
            {isEditMode ? (
              <input
                type="text"
                value={localJam.name}
                onChange={(e) => handleFieldChange('name', e.target.value)}
                className="text-3xl font-bold text-gray-900 mb-2 w-full bg-transparent border-b-2 border-blue-500 focus:outline-none focus:border-blue-600"
              />
            ) : (
              <h1 className="text-3xl font-bold text-gray-900 mb-2">{localJam.name}</h1>
            )}
          </div>
          {!isEditMode && onEditClick && (
            <button
              onClick={onEditClick}
              className="text-gray-400 hover:text-gray-600 transition-colors flex-shrink-0 mt-1"
              aria-label="Edit jam"
              title="Edit jam"
            >
              <svg
                className="w-5 h-5"
                fill="none"
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
              </svg>
            </button>
          )}
          {isEditMode && (
            <div className="flex gap-2 flex-shrink-0">
              <Button
                variant="ghost"
                size="sm"
                onClick={handleCancel}
                disabled={isSaving}
              >
                Cancel
              </Button>
              <Button
                size="sm"
                onClick={handleSave}
                disabled={isSaving}
              >
                {isSaving ? 'Saving...' : 'Save'}
              </Button>
            </div>
          )}
        </div>
        {isEditMode ? (
          <>
            <input
              type="text"
              value={localJam.venue_name}
              onChange={(e) => handleFieldChange('venue_name', e.target.value)}
              className="text-xl text-gray-700 mb-1 w-full bg-transparent border-b border-gray-300 focus:outline-none focus:border-blue-500"
              placeholder="Venue name"
            />
            <input
              type="text"
              value={localJam.venue_address || ''}
              onChange={(e) => handleFieldChange('venue_address', e.target.value)}
              className="text-gray-600 mb-2 w-full bg-transparent border-b border-gray-300 focus:outline-none focus:border-blue-500"
              placeholder="Venue address"
            />
            <input
              type="text"
              value={localJam.skill_level || ''}
              onChange={(e) => handleFieldChange('skill_level', e.target.value || null)}
              className="text-sm text-gray-500 font-medium w-full bg-transparent border-b border-gray-300 focus:outline-none focus:border-blue-500"
              placeholder="Skill level (optional)"
            />
          </>
        ) : (
          <>
            <p className="text-xl text-gray-700 mb-1">{localJam.venue_name}</p>
            {localJam.venue_address && (
              <p className="text-gray-600 mb-2">{localJam.venue_address}</p>
            )}
            {localJam.skill_level && (
              <p className="text-sm text-gray-500 font-medium">
                Skill Level: {localJam.skill_level}
              </p>
            )}
          </>
        )}
      </div>
      
      {/* Description */}
      <div>
        <h2 className="text-xl font-semibold mb-2">About</h2>
        {isEditMode ? (
          <textarea
            value={localJam.description || ''}
            onChange={(e) => handleFieldChange('description', e.target.value || null)}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 min-h-[100px]"
            placeholder="Description (optional)"
          />
        ) : (
          localJam.description && (
            <p className="text-gray-700 whitespace-pre-wrap">{localJam.description}</p>
          )
        )}
      </div>
      
      {/* Schedule */}
      <div>
        <h2 className="text-xl font-semibold mb-2">Schedule</h2>
        <ScheduleDisplay 
          schedules={jam.schedules} 
          isEditMode={isEditMode}
          jamId={jam.id}
          onScheduleCreate={onScheduleCreate}
          onScheduleUpdate={onScheduleUpdate}
          onScheduleDelete={onScheduleDelete}
        />
      </div>
      
      {/* Upcoming Dates */}
      <div>
        <h2 className="text-xl font-semibold mb-2">Upcoming Dates</h2>
        <UpcomingDates dates={upcomingDates} />
      </div>
      
      {/* Contact */}
      <div>
        <h2 className="text-xl font-semibold mb-2">Contact</h2>
        <ContactSection 
          contacts={jam.contacts} 
          isEditMode={isEditMode}
          jamId={jam.id}
          onContactCreate={onContactCreate}
          onContactUpdate={onContactUpdate}
          onContactDelete={onContactDelete}
        />
      </div>
      
      {/* Canonical Source */}
      <div>
        {isEditMode ? (
          <input
            type="url"
            value={localJam.canonical_source_url || ''}
            onChange={(e) => handleFieldChange('canonical_source_url', e.target.value || null)}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Canonical source URL (optional)"
          />
        ) : (
          localJam.canonical_source_url && (
            <a
              href={localJam.canonical_source_url}
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-600 hover:text-blue-800 hover:underline"
            >
              View original source →
            </a>
          )
        )}
      </div>
      
      {/* Suggestion Button */}
      {!isEditMode && (
        <div className="pt-4 border-t">
          <Button onClick={onSuggestionClick} variant="secondary" className="w-full md:w-auto">
            Got info? Suggest an edit
          </Button>
        </div>
      )}
    </div>
  );
}

