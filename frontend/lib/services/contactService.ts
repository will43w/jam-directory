import type {
  JamContact,
  CreateContactData,
  UpdateContactData,
} from '@/lib/types';

/**
 * Service interface for contact operations
 * Implementation will be provided via Supabase
 */
export async function getContactsByJamId(jamId: string): Promise<JamContact[]> {
  // TODO: Implement with Supabase
  throw new Error('Not implemented: Use Supabase implementation');
}

export async function createContact(data: CreateContactData): Promise<JamContact> {
  // TODO: Implement with Supabase
  throw new Error('Not implemented: Use Supabase implementation');
}

export async function updateContact(
  id: string,
  data: UpdateContactData
): Promise<JamContact> {
  // TODO: Implement with Supabase
  throw new Error('Not implemented: Use Supabase implementation');
}

export async function deleteContact(id: string): Promise<void> {
  // TODO: Implement with Supabase
  throw new Error('Not implemented: Use Supabase implementation');
}

