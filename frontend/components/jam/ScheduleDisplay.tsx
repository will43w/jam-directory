'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/Button';

interface ScheduleDisplayProps {
  schedule: string | null;
  isEditMode?: boolean;
  onScheduleUpdate?: (schedule: string | null) => Promise<void>;
}

export function ScheduleDisplay({ 
  schedule,
  isEditMode = false,
  onScheduleUpdate,
}: ScheduleDisplayProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [editedSchedule, setEditedSchedule] = useState(schedule || '');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSave = async () => {
    if (!onScheduleUpdate) return;
    setIsSubmitting(true);
    try {
      await onScheduleUpdate(editedSchedule || null);
      setIsEditing(false);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCancel = () => {
    setEditedSchedule(schedule || '');
    setIsEditing(false);
  };

  if (!isEditMode) {
    return (
      <div>
        {schedule ? (
          <p className="text-lg">{schedule}</p>
        ) : (
          <p className="text-gray-600">No schedule available</p>
        )}
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {isEditing ? (
        <div className="space-y-3">
          <textarea
            value={editedSchedule}
            onChange={(e) => setEditedSchedule(e.target.value)}
            placeholder="e.g., Last Thursday of every month, Every other Tuesday at 7pm"
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 min-h-[100px]"
            rows={3}
          />
          <div className="flex gap-2">
            <Button
              size="sm"
              onClick={handleSave}
              disabled={isSubmitting}
            >
              {isSubmitting ? 'Saving...' : 'Save'}
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={handleCancel}
              disabled={isSubmitting}
            >
              Cancel
            </Button>
          </div>
        </div>
      ) : (
        <div className="flex items-start justify-between gap-4">
          <div className="flex-1">
            {schedule ? (
              <p className="text-lg">{schedule}</p>
            ) : (
              <p className="text-gray-500 italic">No schedule set</p>
            )}
          </div>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setIsEditing(true)}
          >
            Edit
          </Button>
        </div>
      )}
    </div>
  );
}
