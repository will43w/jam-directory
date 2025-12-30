'use client';

import { useState } from 'react';
import type { OccurrenceStatus, CreateOccurrenceData, UpdateOccurrenceData, JamOccurrence } from '@/lib/types';
import { Modal } from '@/components/ui/Modal';
import { Button } from '@/components/ui/Button';
import { formatDateString } from '@/lib/utils/dateUtils';

interface ExceptionModalProps {
  isOpen: boolean;
  onClose: () => void;
  date: Date;
  existingOccurrence: JamOccurrence | null;
  defaultStartTime: string;
  defaultEndTime: string | null;
  onSave: (data: CreateOccurrenceData | UpdateOccurrenceData, id?: string) => Promise<void>;
  onDelete?: (id: string) => Promise<void>;
  jamId: string;
}

export function ExceptionModal({
  isOpen,
  onClose,
  date,
  existingOccurrence,
  defaultStartTime,
  defaultEndTime,
  onSave,
  onDelete,
  jamId,
}: ExceptionModalProps) {
  const [status, setStatus] = useState<OccurrenceStatus | 'confirm'>(
    existingOccurrence?.status || 'confirm'
  );
  const [startTime, setStartTime] = useState(
    existingOccurrence?.start_time || defaultStartTime
  );
  const [endTime, setEndTime] = useState(
    existingOccurrence?.end_time || defaultEndTime || ''
  );
  const [notes, setNotes] = useState(existingOccurrence?.notes || '');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleConfirm = () => {
    onClose(); // No-op, just close
  };

  const handleSave = async () => {
    if (status === 'confirm') {
      handleConfirm();
      return;
    }

    setIsSubmitting(true);
    try {
      const dateString = formatDateString(date);
      const data: CreateOccurrenceData | UpdateOccurrenceData = {
        date: dateString,
        start_time: startTime || null,
        end_time: endTime || null,
        status: status as OccurrenceStatus,
        notes: notes || null,
      };

      if (existingOccurrence) {
        await onSave(data, existingOccurrence.id);
      } else {
        await onSave({ ...data, jam_id: jamId } as CreateOccurrenceData);
      }
      onClose();
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async () => {
    if (!existingOccurrence || !onDelete) return;
    setIsSubmitting(true);
    try {
      await onDelete(existingOccurrence.id);
      onClose();
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={`${date.toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}`}
    >
      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Action
          </label>
          <div className="space-y-2">
            <label className="flex items-center">
              <input
                type="radio"
                name="status"
                value="confirm"
                checked={status === 'confirm'}
                onChange={() => setStatus('confirm')}
                className="mr-2"
              />
              <span>Confirm (no change)</span>
            </label>
            <label className="flex items-center">
              <input
                type="radio"
                name="status"
                value="cancelled"
                checked={status === 'cancelled'}
                onChange={(e) => setStatus(e.target.value as OccurrenceStatus)}
                className="mr-2"
              />
              <span>Cancel</span>
            </label>
            <label className="flex items-center">
              <input
                type="radio"
                name="status"
                value="moved"
                checked={status === 'moved'}
                onChange={(e) => setStatus(e.target.value as OccurrenceStatus)}
                className="mr-2"
              />
              <span>Change time</span>
            </label>
          </div>
        </div>

        {status === 'moved' && (
          <>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Start Time
                </label>
                <input
                  type="time"
                  value={startTime}
                  onChange={(e) => setStartTime(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  End Time
                </label>
                <input
                  type="time"
                  value={endTime}
                  onChange={(e) => setEndTime(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>
          </>
        )}

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Notes
          </label>
          <textarea
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            rows={3}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <div className="flex gap-3 justify-end">
          {existingOccurrence && onDelete && (
            <Button
              type="button"
              variant="danger"
              onClick={handleDelete}
              disabled={isSubmitting}
            >
              Delete Exception
            </Button>
          )}
          <Button type="button" variant="ghost" onClick={onClose} disabled={isSubmitting}>
            Cancel
          </Button>
          <Button onClick={handleSave} disabled={isSubmitting}>
            {isSubmitting ? 'Saving...' : 'Save'}
          </Button>
        </div>
      </div>
    </Modal>
  );
}

