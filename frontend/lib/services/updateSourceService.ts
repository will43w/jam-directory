import type {
  JamUpdateSource,
  CreateUpdateSourceData,
  UpdateUpdateSourceData,
} from '@/lib/types';
import { supabase } from '@/lib/supabase/client';

/**
 * Get all update sources for a jam
 */
export async function getUpdateSourcesByJamId(jamId: string): Promise<JamUpdateSource[]> {
  const { data, error } = await supabase
    .from('jam_update_source')
    .select('*')
    .eq('jam_id', jamId)
    .order('is_primary', { ascending: false });

  if (error) {
    throw new Error(`Failed to fetch update sources: ${error.message}`);
  }

  return data || [];
}

/**
 * Create a new update source
 */
export async function createUpdateSource(data: CreateUpdateSourceData): Promise<JamUpdateSource> {
  const { data: updateSource, error } = await supabase
    .from('jam_update_source')
    .insert(data)
    .select()
    .single();

  if (error) {
    throw new Error(`Failed to create update source: ${error.message}`);
  }

  return updateSource;
}

/**
 * Update an existing update source
 */
export async function updateUpdateSource(
  id: string,
  data: UpdateUpdateSourceData
): Promise<JamUpdateSource> {
  const { data: updateSource, error } = await supabase
    .from('jam_update_source')
    .update(data)
    .eq('id', id)
    .select()
    .single();

  if (error) {
    throw new Error(`Failed to update update source: ${error.message}`);
  }

  return updateSource;
}

/**
 * Delete an update source
 */
export async function deleteUpdateSource(id: string): Promise<void> {
  const { error } = await supabase
    .from('jam_update_source')
    .delete()
    .eq('id', id);

  if (error) {
    throw new Error(`Failed to delete update source: ${error.message}`);
  }
}

