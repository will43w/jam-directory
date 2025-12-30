'use client';

import { useState } from 'react';
import type { JamWithRelations } from '@/lib/types';
import { JamDetail } from '@/components/jam/JamDetail';
import { JamDetailAdmin } from '@/components/jam/JamDetailAdmin';
import { SuggestionModal } from '@/components/jam/SuggestionModal';
import { useAuth } from '@/components/auth/AuthProvider';
import { updateJam, deleteJam } from '@/lib/services/jamService';
import { createSchedule, updateSchedule, deleteSchedule } from '@/lib/services/scheduleService';
import { createOccurrence, updateOccurrence, deleteOccurrence } from '@/lib/services/occurrenceService';
import { createContact, updateContact, deleteContact } from '@/lib/services/contactService';
import { useRouter } from 'next/navigation';

interface JamDetailPageClientProps {
  jam: JamWithRelations;
}

export function JamDetailPageClient({ jam }: JamDetailPageClientProps) {
  const { isAdmin } = useAuth();
  const router = useRouter();
  const [isSuggestionModalOpen, setIsSuggestionModalOpen] = useState(false);

  const handleJamUpdate = async (id: string, data: any) => {
    await updateJam(id, data);
    router.refresh();
  };

  const handleJamDelete = async (id: string) => {
    await deleteJam(id);
    router.push('/');
  };

  const handleScheduleCreate = async (data: any) => {
    await createSchedule(data);
    router.refresh();
  };

  const handleScheduleUpdate = async (id: string, data: any) => {
    await updateSchedule(id, data);
    router.refresh();
  };

  const handleScheduleDelete = async (id: string) => {
    await deleteSchedule(id);
    router.refresh();
  };

  const handleOccurrenceCreate = async (data: any) => {
    await createOccurrence(data);
    router.refresh();
  };

  const handleOccurrenceUpdate = async (id: string, data: any) => {
    await updateOccurrence(id, data);
    router.refresh();
  };

  const handleOccurrenceDelete = async (id: string) => {
    await deleteOccurrence(id);
    router.refresh();
  };

  const handleContactCreate = async (data: any) => {
    await createContact(data);
    router.refresh();
  };

  const handleContactUpdate = async (id: string, data: any) => {
    await updateContact(id, data);
    router.refresh();
  };

  const handleContactDelete = async (id: string) => {
    await deleteContact(id);
    router.refresh();
  };

  return (
    <>
      {isAdmin ? (
        <JamDetailAdmin
          jam={jam}
          onJamUpdate={handleJamUpdate}
          onScheduleCreate={handleScheduleCreate}
          onScheduleUpdate={handleScheduleUpdate}
          onScheduleDelete={handleScheduleDelete}
          onOccurrenceCreate={handleOccurrenceCreate}
          onOccurrenceUpdate={handleOccurrenceUpdate}
          onOccurrenceDelete={handleOccurrenceDelete}
          onContactCreate={handleContactCreate}
          onContactUpdate={handleContactUpdate}
          onContactDelete={handleContactDelete}
          onJamDelete={handleJamDelete}
          onSuggestionClick={() => setIsSuggestionModalOpen(true)}
        />
      ) : (
        <JamDetail jam={jam} onSuggestionClick={() => setIsSuggestionModalOpen(true)} />
      )}
      <SuggestionModal
        isOpen={isSuggestionModalOpen}
        onClose={() => setIsSuggestionModalOpen(false)}
        jamId={jam.id}
      />
    </>
  );
}

