'use client';

import { useState } from 'react';
import type { JamSchedule, CreateScheduleData, UpdateScheduleData } from '@/lib/types';
import { WEEKDAYS } from '@/lib/utils/constants';
import { Button } from '@/components/ui/Button';

interface ScheduleEditorProps {
  schedules: JamSchedule[];
  onSave: (schedule: CreateScheduleData | UpdateScheduleData, id?: string) => Promise<void>;
  onDelete: (id: string) => Promise<void>;
}

export function ScheduleEditor({ schedules, onSave, onDelete }: ScheduleEditorProps) {
  const [editingId, setEditingId] = useState<string | null>(null);
  const [isAdding, setIsAdding] = useState(false);
  const [formData, setFormData] = useState<CreateScheduleData>({
    jam_id: '',
    weekday: 1,
    start_time: '19:00',
    end_time: null,
    timezone: 'America/New_York',
    is_active: true,
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

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
      jam_id: '',
      weekday: 1,
      start_time: '19:00',
      end_time: null,
      timezone: 'America/New_York',
      is_active: true,
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      if (editingId) {
        const { jam_id, ...updateData } = formData;
        await onSave(updateData, editingId);
      } else {
        await onSave(formData);
      }
      handleCancel();
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-semibold">Schedules</h3>
        <Button
          type="button"
          variant="secondary"
          size="sm"
          onClick={() => {
            setIsAdding(true);
            setEditingId(null);
          }}
        >
          Add Schedule
        </Button>
      </div>

      {(isAdding || editingId) && (
        <form onSubmit={handleSubmit} className="p-4 border border-gray-200 rounded-lg space-y-3">
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

          <div>
            <label className="flex items-center">
              <input
                type="checkbox"
                checked={formData.is_active}
                onChange={(e) => setFormData({ ...formData, is_active: e.target.checked })}
                className="mr-2"
              />
              <span className="text-sm font-medium text-gray-700">Active</span>
            </label>
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
      )}

      <div className="space-y-2">
        {schedules.map((schedule) => (
          <div
            key={schedule.id}
            className="p-3 border border-gray-200 rounded-lg flex items-center justify-between"
          >
            <div>
              <p className="font-medium">
                {WEEKDAYS[schedule.weekday]} at {schedule.start_time}
                {schedule.end_time && ` - ${schedule.end_time}`}
              </p>
              <p className="text-sm text-gray-600">
                {schedule.timezone} {schedule.is_active ? '(Active)' : '(Inactive)'}
              </p>
            </div>
            <div className="flex gap-2">
              <Button
                type="button"
                variant="ghost"
                size="sm"
                onClick={() => handleEdit(schedule)}
              >
                Edit
              </Button>
              <Button
                type="button"
                variant="danger"
                size="sm"
                onClick={() => onDelete(schedule.id)}
              >
                Delete
              </Button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

