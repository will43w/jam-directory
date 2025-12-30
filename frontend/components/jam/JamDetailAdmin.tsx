'use client';

import { useState } from 'react';
import type { JamWithRelations, CreateJamData, UpdateJamData, CreateScheduleData, UpdateScheduleData, CreateOccurrenceData, UpdateOccurrenceData, CreateContactData, UpdateContactData, JamContact } from '@/lib/types';
import { JamDetail } from './JamDetail';
import { JamEditForm } from '@/components/admin/JamEditForm';
import { ScheduleEditor } from '@/components/admin/ScheduleEditor';
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
  const [isEditingJam, setIsEditingJam] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  const handleJamSave = async (data: CreateJamData | UpdateJamData) => {
    await onJamUpdate(jam.id, data as UpdateJamData);
    setIsEditingJam(false);
  };

  const handleScheduleSave = async (data: CreateScheduleData | UpdateScheduleData, id?: string) => {
    if (id) {
      await onScheduleUpdate(id, data as UpdateScheduleData);
    } else {
      await onScheduleCreate(data as CreateScheduleData);
    }
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
    <div className="space-y-8">
      {/* Public view */}
      <JamDetail jam={jam} onSuggestionClick={onSuggestionClick} />

      {/* Admin controls */}
      <div className="border-t pt-8 space-y-8">
        <div className="flex justify-between items-center">
          <h2 className="text-2xl font-bold">Admin Controls</h2>
          <Button variant="danger" onClick={handleDelete} disabled={isDeleting}>
            {isDeleting ? 'Deleting...' : 'Delete Jam'}
          </Button>
        </div>

        {/* Edit Jam */}
        <div>
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-xl font-semibold">Jam Details</h3>
            <Button
              variant="secondary"
              size="sm"
              onClick={() => setIsEditingJam(!isEditingJam)}
            >
              {isEditingJam ? 'Cancel Edit' : 'Edit Details'}
            </Button>
          </div>
          {isEditingJam ? (
            <JamEditForm jam={jam} onSave={handleJamSave} onCancel={() => setIsEditingJam(false)} />
          ) : null}
        </div>

        {/* Schedule Editor */}
        <div>
          <ScheduleEditor
            schedules={jam.schedules}
            onSave={handleScheduleSave}
            onDelete={onScheduleDelete}
          />
        </div>

        {/* Contact Management */}
        <div>
          <h3 className="text-xl font-semibold mb-4">Contacts</h3>
          <ContactManager
            contacts={jam.contacts}
            jamId={jam.id}
            onCreate={onContactCreate}
            onUpdate={onContactUpdate}
            onDelete={onContactDelete}
          />
        </div>

        {/* Exception Calendar */}
        <div>
          <ExceptionCalendar
            schedules={jam.schedules}
            occurrences={jam.occurrences}
            jamId={jam.id}
            onSave={handleOccurrenceSave}
            onDelete={onOccurrenceDelete}
          />
        </div>
      </div>
    </div>
  );
}

function ContactManager({
  contacts,
  jamId,
  onCreate,
  onUpdate,
  onDelete,
}: {
  contacts: JamContact[];
  jamId: string;
  onCreate: (data: CreateContactData) => Promise<void>;
  onUpdate: (id: string, data: UpdateContactData) => Promise<void>;
  onDelete: (id: string) => Promise<void>;
}) {
  // Simple contact management - could be expanded with a form
  return (
    <div className="space-y-2">
      {contacts.map((contact) => (
        <div key={contact.id} className="p-3 border border-gray-200 rounded-lg flex items-center justify-between">
          <div>
            <p className="font-medium">{contact.contact_type}: {contact.contact_value}</p>
            {contact.is_primary && <span className="text-sm text-blue-600">Primary</span>}
          </div>
          <div className="flex gap-2">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => {
                // TODO: Implement edit contact
                alert('Edit contact - to be implemented');
              }}
            >
              Edit
            </Button>
            <Button
              variant="danger"
              size="sm"
              onClick={() => onDelete(contact.id)}
            >
              Delete
            </Button>
          </div>
        </div>
      ))}
      <Button
        variant="secondary"
        size="sm"
        onClick={() => {
          // TODO: Implement add contact
          alert('Add contact - to be implemented');
        }}
      >
        Add Contact
      </Button>
    </div>
  );
}

