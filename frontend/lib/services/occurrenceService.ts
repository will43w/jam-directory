import type {
  JamOccurrence,
  CreateOccurrenceData,
  UpdateOccurrenceData,
} from '@/lib/types';
import { supabase } from '@/lib/supabase/client';

/**
 * Get all occurrences for a jam
 */
export async function getOccurrencesByJamId(jamId: string): Promise<JamOccurrence[]> {
  const { data, error } = await supabase
    .from('jam_occurrence')
    .select('*')
    .eq('jam_id', jamId)
    .order('date', { ascending: true });

  if (error) {
    throw new Error(`Failed to fetch occurrences: ${error.message}`);
  }

  return data || [];
}

/**
 * Create a new occurrence
 */
export async function createOccurrence(data: CreateOccurrenceData): Promise<JamOccurrence> {
  const { data: occurrence, error } = await supabase
    .from('jam_occurrence')
    .insert(data)
    .select()
    .single();

  if (error) {
    throw new Error(`Failed to create occurrence: ${error.message}`);
  }

  return occurrence;
}

/**
 * Update an existing occurrence
 */
export async function updateOccurrence(
  id: string,
  data: UpdateOccurrenceData
): Promise<JamOccurrence> {
  const { data: occurrence, error } = await supabase
    .from('jam_occurrence')
    .update(data)
    .eq('id', id)
    .select()
    .single();

  if (error) {
    throw new Error(`Failed to update occurrence: ${error.message}`);
  }

  return occurrence;
}

/**
 * Delete an occurrence
 */
export async function deleteOccurrence(id: string): Promise<void> {
  const { error } = await supabase
    .from('jam_occurrence')
    .delete()
    .eq('id', id);

  if (error) {
    throw new Error(`Failed to delete occurrence: ${error.message}`);
  }
}
