'use client';

import { useState, useEffect } from 'react';
import { useSearchParams } from 'next/navigation';
import type { Jam } from '@/lib/types';
import { JamDetail } from '@/components/jam/JamDetail';
import { JamDetailAdmin } from '@/components/jam/JamDetailAdmin';
import { SuggestionModal } from '@/components/jam/SuggestionModal';
import { AdminLoginModal } from '@/components/auth/AdminLoginModal';
import { useAuth } from '@/components/auth/AuthProvider';
import { updateJam, deleteJam } from '@/lib/services/jamService';
import { createUpdateSource, updateUpdateSource, deleteUpdateSource } from '@/lib/services/updateSourceService';
import { createContact, updateContact, deleteContact } from '@/lib/services/contactService';
import { useRouter } from 'next/navigation';

interface JamDetailPageClientProps {
  jam: Jam;
}

export function JamDetailPageClient({ jam }: JamDetailPageClientProps) {
  const { isAdmin, session, loading: authLoading } = useAuth();
  const router = useRouter();
  const searchParams = useSearchParams();
  const [isSuggestionModalOpen, setIsSuggestionModalOpen] = useState(false);
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);

  // Check URL query param for edit mode and enable when conditions are met
  useEffect(() => {
    if (authLoading) {
      return; // Wait for auth to finish loading
    }
    
    const editParam = searchParams.get('edit');
    
    if (editParam === 'true' && isAdmin && session) {
      setIsEditMode(true);
    } else if (editParam !== 'true') {
      // If edit param is removed or not present, disable edit mode
      setIsEditMode(false);
    } else if (editParam === 'true' && (!isAdmin || !session)) {
      setIsEditMode(false);
    }
  }, [searchParams, isAdmin, session, authLoading]);

  const handleEditClick = () => {
    if (session && isAdmin) {
      setIsEditMode(true);
      // Update URL without navigation
      const url = new URL(window.location.href);
      url.searchParams.set('edit', 'true');
      window.history.pushState({}, '', url);
    } else if (!session) {
      setIsLoginModalOpen(true);
    }
    // If authenticated but not admin, do nothing (or could show error)
    // TODO: Inform the user, with a modal, that they're logged in, but don't have permissions to edit the jam. 
    // Tell them that they can go to the bottom of the jam page to suggest jams. 
  };

  const handleCancelEdit = () => {
    setIsEditMode(false);
    // Remove edit param from URL
    const url = new URL(window.location.href);
    url.searchParams.delete('edit');
    window.history.pushState({}, '', url);
  };

  const handleJamUpdate = async (id: string, data: any) => {
    await updateJam(id, data);
    router.refresh();
  };

  const handleJamDelete = async (id: string) => {
    await deleteJam(id);
    router.push('/');
  };

  const handleUpdateSourceCreate = async (data: any) => {
    await createUpdateSource(data);
    router.refresh();
  };

  const handleUpdateSourceUpdate = async (id: string, data: any) => {
    await updateUpdateSource(id, data);
    router.refresh();
  };

  const handleUpdateSourceDelete = async (id: string) => {
    await deleteUpdateSource(id);
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
      {isEditMode && isAdmin ? (
        <JamDetailAdmin
          jam={jam}
          onJamUpdate={handleJamUpdate}
          onUpdateSourceCreate={handleUpdateSourceCreate}
          onUpdateSourceUpdate={handleUpdateSourceUpdate}
          onUpdateSourceDelete={handleUpdateSourceDelete}
          onContactCreate={handleContactCreate}
          onContactUpdate={handleContactUpdate}
          onContactDelete={handleContactDelete}
          onJamDelete={handleJamDelete}
          onSuggestionClick={() => setIsSuggestionModalOpen(true)}
        />
      ) : (
        <JamDetail
          jam={jam}
          onSuggestionClick={() => setIsSuggestionModalOpen(true)}
          onEditClick={handleEditClick}
        />
      )}
      <SuggestionModal
        isOpen={isSuggestionModalOpen}
        onClose={() => setIsSuggestionModalOpen(false)}
        jamId={jam.id}
      />
      <AdminLoginModal
        isOpen={isLoginModalOpen}
        onClose={() => setIsLoginModalOpen(false)}
        jamId={jam.id}
      />
    </>
  );
}

