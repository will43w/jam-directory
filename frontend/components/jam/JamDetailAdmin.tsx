'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import type { Jam, UpdateJamData, CreateUpdateSourceData, UpdateUpdateSourceData, CreateContactData, UpdateContactData } from '@/lib/types';
import { JamDetail } from './JamDetail';
import { Button } from '@/components/ui/Button';

interface JamDetailAdminProps {
  jam: Jam;
  onJamUpdate: (id: string, data: UpdateJamData) => Promise<void>;
  onUpdateSourceCreate: (data: CreateUpdateSourceData) => Promise<void>;
  onUpdateSourceUpdate: (id: string, data: UpdateUpdateSourceData) => Promise<void>;
  onUpdateSourceDelete: (id: string) => Promise<void>;
  onContactCreate: (data: CreateContactData) => Promise<void>;
  onContactUpdate: (id: string, data: UpdateContactData) => Promise<void>;
  onContactDelete: (id: string) => Promise<void>;
  onJamDelete: (id: string) => Promise<void>;
  onSuggestionClick: () => void;
}

export function JamDetailAdmin({
  jam,
  onJamUpdate,
  onUpdateSourceCreate,
  onUpdateSourceUpdate,
  onUpdateSourceDelete,
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
        onUpdateSourceCreate={onUpdateSourceCreate}
        onUpdateSourceUpdate={onUpdateSourceUpdate}
        onUpdateSourceDelete={onUpdateSourceDelete}
        onContactCreate={onContactCreate}
        onContactUpdate={onContactUpdate}
        onContactDelete={onContactDelete}
        onCancelEdit={handleCancelEdit}
      />

      {/* Delete button - shown at bottom in edit mode */}
      <div className="pt-4 border-t flex justify-end">
        <Button variant="danger" onClick={handleDelete} disabled={isDeleting}>
          {isDeleting ? 'Deleting...' : 'Delete Jam'}
        </Button>
      </div>
    </div>
  );
}

