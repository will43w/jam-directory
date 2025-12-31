import type {
  Jam,
  CreateJamData,
  UpdateJamData,
  SearchFilters,
  JamWithRelations,
} from '@/lib/types';
import { supabase } from '@/lib/supabase/client';

/**
 * Get jams with optional filters
 */
export async function getJams(filters?: SearchFilters): Promise<Jam[]> {
  let query = supabase
    .from('jam')
    .select('*')
    .order('name');

  // Apply city filter (case-insensitive)
  if (filters?.city) {
    query = query.ilike('city', filters.city);
  }

  // Apply search filter (name, venue_name, or venue_address)
  if (filters?.search) {
    const searchTerm = filters.search;
    // Use or() with proper Supabase filter syntax
    query = query.or(
      `name.ilike.%${searchTerm}%,venue_name.ilike.%${searchTerm}%,venue_address.ilike.%${searchTerm}%`
    );
  }

  // Apply skill level filter
  if (filters?.skill_levels && filters.skill_levels.length > 0) {
    query = query.in('skill_level', filters.skill_levels);
  }

  // Apply day/tonight filters (requires join with jam_schedule)
  // Note: This is a simplified approach. For more complex filtering,
  // you might want to fetch all jams and filter in memory, or use a database function
  let scheduleFilteredJamIds: string[] | null = null;
  
  if (filters?.days && filters.days.length > 0) {
    // Fetch jam_ids that have schedules on the specified days
    const { data: scheduleData } = await supabase
      .from('jam_schedule')
      .select('jam_id')
      .in('weekday', filters.days)
      .eq('is_active', true);
    
    if (scheduleData && scheduleData.length > 0) {
      scheduleFilteredJamIds = [...new Set(scheduleData.map(s => s.jam_id))];
    } else {
      // No jams match the day filter, return empty array
      return [];
    }
  }

  // Apply "tonight" filter - get jams that have a schedule for today
  if (filters?.tonight) {
    const today = new Date();
    const weekday = today.getDay(); // 0 = Sunday, 6 = Saturday
    
    // Fetch jam_ids that have schedules on today's weekday
    const { data: scheduleData } = await supabase
      .from('jam_schedule')
      .select('jam_id')
      .eq('weekday', weekday)
      .eq('is_active', true);
    
    if (scheduleData && scheduleData.length > 0) {
      const tonightJamIds = [...new Set(scheduleData.map(s => s.jam_id))];
      
      // If we already have day-filtered IDs, intersect them
      if (scheduleFilteredJamIds) {
        scheduleFilteredJamIds = scheduleFilteredJamIds.filter(id => tonightJamIds.includes(id));
      } else {
        scheduleFilteredJamIds = tonightJamIds;
      }
      
      if (scheduleFilteredJamIds.length === 0) {
        // No jams match both filters, return empty array
        return [];
      }
    } else {
      // No jams match the tonight filter, return empty array
      return [];
    }
  }
  
  // Apply schedule-based filter if we have one
  if (scheduleFilteredJamIds) {
    query = query.in('id', scheduleFilteredJamIds);
  }

  const { data, error } = await query;

  if (error) {
    throw new Error(`Failed to fetch jams: ${error.message}`);
  }

  return data || [];
}

/**
 * Get a single jam by ID with all related data
 */
export async function getJamById(id: string): Promise<JamWithRelations | null> {
  // Fetch jam
  const { data: jam, error: jamError } = await supabase
    .from('jam')
    .select('*')
    .eq('id', id)
    .single();

  if (jamError) {
    throw new Error(`Failed to fetch jam: ${jamError.message}`);
  }

  if (!jam) {
    return null;
  }

  // Fetch related data in parallel
  const [schedulesResult, contactsResult, occurrencesResult] = await Promise.all([
    supabase
      .from('jam_schedule')
      .select('*')
      .eq('jam_id', id)
      .order('weekday'),
    supabase
      .from('jam_contact')
      .select('*')
      .eq('jam_id', id)
      .order('is_primary', { ascending: false }),
    supabase
      .from('jam_occurrence')
      .select('*')
      .eq('jam_id', id)
      .order('date', { ascending: true }),
  ]);

  if (schedulesResult.error) {
    throw new Error(`Failed to fetch schedules: ${schedulesResult.error.message}`);
  }
  if (contactsResult.error) {
    throw new Error(`Failed to fetch contacts: ${contactsResult.error.message}`);
  }
  if (occurrencesResult.error) {
    throw new Error(`Failed to fetch occurrences: ${occurrencesResult.error.message}`);
  }

  return {
    ...jam,
    schedules: schedulesResult.data || [],
    contacts: contactsResult.data || [],
    occurrences: occurrencesResult.data || [],
  };
}

/**
 * Create a new jam
 */
export async function createJam(data: CreateJamData): Promise<Jam> {
  const { data: jam, error } = await supabase
    .from('jam')
    .insert(data)
    .select()
    .single();

  if (error) {
    throw new Error(`Failed to create jam: ${error.message}`);
  }

  return jam;
}

/**
 * Update an existing jam
 */
export async function updateJam(id: string, data: UpdateJamData): Promise<Jam> {
  const { data: jam, error } = await supabase
    .from('jam')
    .update(data)
    .eq('id', id)
    .select()
    .single();

  if (error) {
    throw new Error(`Failed to update jam: ${error.message}`);
  }

  return jam;
}

/**
 * Delete a jam (cascades to schedules, contacts, occurrences)
 */
export async function deleteJam(id: string): Promise<void> {
  const { error } = await supabase
    .from('jam')
    .delete()
    .eq('id', id);

  if (error) {
    throw new Error(`Failed to delete jam: ${error.message}`);
  }
}
