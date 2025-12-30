import type {
  JamOccurrence,
  CreateOccurrenceData,
  UpdateOccurrenceData,
} from '@/lib/types';

/**
 * Service interface for occurrence/exception operations
 * Implementation will be provided via Supabase
 */
export async function getOccurrencesByJamId(jamId: string): Promise<JamOccurrence[]> {
  // TODO: Implement with Supabase
  throw new Error('Not implemented: Use Supabase implementation');
}

export async function createOccurrence(data: CreateOccurrenceData): Promise<JamOccurrence> {
  // TODO: Implement with Supabase
  throw new Error('Not implemented: Use Supabase implementation');
}

export async function updateOccurrence(
  id: string,
  data: UpdateOccurrenceData
): Promise<JamOccurrence> {
  // TODO: Implement with Supabase
  throw new Error('Not implemented: Use Supabase implementation');
}

export async function deleteOccurrence(id: string): Promise<void> {
  // TODO: Implement with Supabase
  throw new Error('Not implemented: Use Supabase implementation');
}

