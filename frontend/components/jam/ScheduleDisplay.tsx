'use client';

import { useState } from 'react';
import type { JamSchedule, CreateScheduleData, UpdateScheduleData } from '@/lib/types';
import { formatScheduleDisplay } from '@/lib/utils/dateUtils';
import { WEEKDAYS } from '@/lib/utils/constants';
import { Button } from '@/components/ui/Button';

interface ScheduleDisplayProps {
  schedules: JamSchedule[];
  isEditMode?: boolean;
  jamId?: string;
  onScheduleCreate?: (data: CreateScheduleData) => Promise<void>;
  onScheduleUpdate?: (id: string, data: UpdateScheduleData) => Promise<void>;
  onScheduleDelete?: (id: string) => Promise<void>;
}

export function ScheduleDisplay({ 
  schedules, 
  isEditMode = false,
  jamId,
  onScheduleCreate,
  onScheduleUpdate,
  onScheduleDelete,
}: ScheduleDisplayProps) {
  const [editingId, setEditingId] = useState<string | null>(null);
  const [isAdding, setIsAdding] = useState(false);
  const [formData, setFormData] = useState<CreateScheduleData>({
    jam_id: jamId || '',
    weekday: 1,
    start_time: '19:00',
    end_time: null,
    timezone: 'America/New_York',
    is_active: true,
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const activeSchedules = schedules.filter(s => s.is_active);
  const allSchedules = isEditMode ? schedules : activeSchedules;

  const handleEdit = (schedule: JamSchedule) => {
    setEditingId(schedule.id);
    setFormData({
      jam_id: schedule.jam_id,
      weekday: schedule.weekday,
      start_time: schedule.start_time,
      end_time: schedule.end_time,
      timezone: schedule.timezone,
      is_active: schedule.is_active,
    });
    setIsAdding(false);
  };

  const handleCancel = () => {
    setEditingId(null);
    setIsAdding(false);
    setFormData({
      jam_id: jamId || '',
      weekday: 1,
      start_time: '19:00',
      end_time: null,
      timezone: 'America/New_York',
      is_active: true,
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!onScheduleCreate || !onScheduleUpdate) return;
    setIsSubmitting(true);
    try {
      if (editingId) {
        const { jam_id, ...updateData } = formData;
        await onScheduleUpdate(editingId, updateData);
      } else {
        await onScheduleCreate(formData);
      }
      handleCancel();
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!isEditMode) {
    if (activeSchedules.length === 0) {
      return <p className="text-gray-600">No schedule available</p>;
    }
    
    return (
      <div className="space-y-2">
        {activeSchedules.map((schedule) => (
          <p key={schedule.id} className="text-lg">
            {formatScheduleDisplay(schedule)}
          </p>
        ))}
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {allSchedules.map((schedule) => (
        editingId === schedule.id ? (
          <form key={schedule.id} onSubmit={handleSubmit} className="p-4 border border-blue-300 rounded-lg bg-blue-50 space-y-3">
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Day of Week
                </label>
                <select
                  value={formData.weekday}
                  onChange={(e) => setFormData({ ...formData, weekday: Number(e.target.value) })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  {WEEKDAYS.map((day, index) => (
                    <option key={index} value={index}>
                      {day}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Timezone
                </label>
                <input
                  type="text"
                  value={formData.timezone}
                  onChange={(e) => setFormData({ ...formData, timezone: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Start Time
                </label>
                <input
                  type="time"
                  value={formData.start_time}
                  onChange={(e) => setFormData({ ...formData, start_time: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  End Time (optional)
                </label>
                <input
                  type="time"
                  value={formData.end_time || ''}
                  onChange={(e) => setFormData({ ...formData, end_time: e.target.value || null })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>
            <div className="flex items-center gap-2">
              <input
                type="checkbox"
                checked={formData.is_active}
                onChange={(e) => setFormData({ ...formData, is_active: e.target.checked })}
                className="w-4 h-4"
              />
              <label className="text-sm font-medium text-gray-700">Active</label>
            </div>
            <div className="flex gap-2">
              <Button type="submit" size="sm" disabled={isSubmitting}>
                {isSubmitting ? 'Saving...' : 'Save'}
              </Button>
              <Button type="button" variant="ghost" size="sm" onClick={handleCancel}>
                Cancel
              </Button>
            </div>
          </form>
        ) : (
          <div key={schedule.id} className="p-3 border border-gray-200 rounded-lg flex items-center justify-between hover:bg-gray-50">
            <div className="flex-1">
              <p className="text-lg font-medium">
                {formatScheduleDisplay(schedule)}
              </p>
              {!schedule.is_active && (
                <p className="text-sm text-gray-500">(Inactive)</p>
              )}
            </div>
            <div className="flex gap-2">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => handleEdit(schedule)}
              >
                Edit
              </Button>
              {onScheduleDelete && (
                <Button
                  variant="danger"
                  size="sm"
                  onClick={() => onScheduleDelete(schedule.id)}
                >
                  Delete
                </Button>
              )}
            </div>
          </div>
        )
      ))}
      
      {isAdding ? (
        <form onSubmit={handleSubmit} className="p-4 border-2 border-dashed border-blue-300 rounded-lg bg-blue-50 space-y-3">
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Day of Week
              </label>
              <select
                value={formData.weekday}
                onChange={(e) => setFormData({ ...formData, weekday: Number(e.target.value) })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                {WEEKDAYS.map((day, index) => (
                  <option key={index} value={index}>
                    {day}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Timezone
              </label>
              <input
                type="text"
                value={formData.timezone}
                onChange={(e) => setFormData({ ...formData, timezone: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Start Time
              </label>
              <input
                type="time"
                value={formData.start_time}
                onChange={(e) => setFormData({ ...formData, start_time: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                End Time (optional)
              </label>
              <input
                type="time"
                value={formData.end_time || ''}
                onChange={(e) => setFormData({ ...formData, end_time: e.target.value || null })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>
          <div className="flex items-center gap-2">
            <input
              type="checkbox"
              checked={formData.is_active}
              onChange={(e) => setFormData({ ...formData, is_active: e.target.checked })}
              className="w-4 h-4"
            />
            <label className="text-sm font-medium text-gray-700">Active</label>
          </div>
          <div className="flex gap-2">
            <Button type="submit" size="sm" disabled={isSubmitting}>
              {isSubmitting ? 'Saving...' : 'Save'}
            </Button>
            <Button type="button" variant="ghost" size="sm" onClick={handleCancel}>
              Cancel
            </Button>
          </div>
        </form>
      ) : (
        <Button
          variant="secondary"
          size="sm"
          onClick={() => {
            setIsAdding(true);
            setEditingId(null);
          }}
        >
          + Add Schedule
        </Button>
      )}
    </div>
  );
}

