'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import type { JamWithRelations, UpdateJamData, CreateScheduleData, UpdateScheduleData, CreateOccurrenceData, UpdateOccurrenceData, CreateContactData, UpdateContactData } from '@/lib/types';
import { JamDetail } from './JamDetail';
import { ExceptionCalendar } from '@/components/admin/ExceptionCalendar';
import { Button } from '@/components/ui/Button';

interface JamDetailAdminProps {
  jam: JamWithRelations;
  onJamUpdate: (id: string, data: UpdateJamData) => Promise<void>;
  onScheduleCreate: (data: CreateScheduleData) => Promise<void>;
  onScheduleUpdate: (id: string, data: UpdateScheduleData) => Promise<void>;
  onScheduleDelete: (id: string) => Promise<void>;
  onOccurrenceCreate: (data: CreateOccurrenceData) => Promise<void>;
  onOccurrenceUpdate: (id: string, data: UpdateOccurrenceData) => Promise<void>;
  onOccurrenceDelete: (id: string) => Promise<void>;
  onContactCreate: (data: CreateContactData) => Promise<void>;
  onContactUpdate: (id: string, data: UpdateContactData) => Promise<void>;
  onContactDelete: (id: string) => Promise<void>;
  onJamDelete: (id: string) => Promise<void>;
  onSuggestionClick: () => void;
}

export function JamDetailAdmin({
  jam,
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
  onJamDelete,
  onSuggestionClick,
}: JamDetailAdminProps) {
  const router = useRouter();
  const [isDeleting, setIsDeleting] = useState(false);

  const handleCancelEdit = () => {
    // Remove edit param from URL
    const url = new URL(window.location.href);
    url.searchParams.delete('edit');
    window.history.pushState({}, '', url);
    router.refresh();
  };

  const handleOccurrenceSave = async (data: CreateOccurrenceData | UpdateOccurrenceData, id?: string) => {
    if (id) {
      await onOccurrenceUpdate(id, data as UpdateOccurrenceData);
    } else {
      await onOccurrenceCreate(data as CreateOccurrenceData);
    }
  };

  const handleDelete = async () => {
    if (window.confirm('Are you sure you want to delete this jam? This action cannot be undone.')) {
      setIsDeleting(true);
      try {
        await onJamDelete(jam.id);
      } finally {
        setIsDeleting(false);
      }
    }
  };

  return (
    <div className="space-y-6">
      {/* Seamless edit mode */}
      <JamDetail 
        jam={jam} 
        onSuggestionClick={onSuggestionClick}
        isEditMode={true}
        onJamUpdate={onJamUpdate}
        onScheduleCreate={onScheduleCreate}
        onScheduleUpdate={onScheduleUpdate}
        onScheduleDelete={onScheduleDelete}
        onOccurrenceCreate={onOccurrenceCreate}
        onOccurrenceUpdate={onOccurrenceUpdate}
        onOccurrenceDelete={onOccurrenceDelete}
        onContactCreate={onContactCreate}
        onContactUpdate={onContactUpdate}
        onContactDelete={onContactDelete}
        onCancelEdit={handleCancelEdit}
      />

      {/* Exception Calendar - shown below in edit mode */}
      <div className="pt-6 border-t">
        <h2 className="text-xl font-semibold mb-4">Exception Calendar</h2>
        <ExceptionCalendar
          schedules={jam.schedules}
          occurrences={jam.occurrences}
          jamId={jam.id}
          onSave={handleOccurrenceSave}
          onDelete={onOccurrenceDelete}
        />
      </div>

      {/* Delete button - shown at bottom in edit mode */}
      <div className="pt-4 border-t flex justify-end">
        <Button variant="danger" onClick={handleDelete} disabled={isDeleting}>
          {isDeleting ? 'Deleting...' : 'Delete Jam'}
        </Button>
      </div>
    </div>
  );
}

