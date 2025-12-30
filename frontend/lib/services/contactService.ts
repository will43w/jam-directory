import type {
  JamContact,
  CreateContactData,
  UpdateContactData,
} from '@/lib/types';
import { supabase } from '@/lib/supabase/client';

/**
 * Get all contacts for a jam
 */
export async function getContactsByJamId(jamId: string): Promise<JamContact[]> {
  const { data, error } = await supabase
    .from('jam_contact')
    .select('*')
    .eq('jam_id', jamId)
    .order('is_primary', { ascending: false });

  if (error) {
    throw new Error(`Failed to fetch contacts: ${error.message}`);
  }

  return data || [];
}

/**
 * Create a new contact
 */
export async function createContact(data: CreateContactData): Promise<JamContact> {
  const { data: contact, error } = await supabase
    .from('jam_contact')
    .insert(data)
    .select()
    .single();

  if (error) {
    throw new Error(`Failed to create contact: ${error.message}`);
  }

  return contact;
}

/**
 * Update an existing contact
 */
export async function updateContact(
  id: string,
  data: UpdateContactData
): Promise<JamContact> {
  const { data: contact, error } = await supabase
    .from('jam_contact')
    .update(data)
    .eq('id', id)
    .select()
    .single();

  if (error) {
    throw new Error(`Failed to update contact: ${error.message}`);
  }

  return contact;
}

/**
 * Delete a contact
 */
export async function deleteContact(id: string): Promise<void> {
  const { error } = await supabase
    .from('jam_contact')
    .delete()
    .eq('id', id);

  if (error) {
    throw new Error(`Failed to delete contact: ${error.message}`);
  }
}
