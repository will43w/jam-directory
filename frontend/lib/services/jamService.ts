import type {
  Jam,
  CreateJamData,
  UpdateJamData,
  SearchFilters,
} from '@/lib/types';
import { supabase } from '@/lib/supabase/client';

/**
 * Calculate distance between two points using Haversine formula
 */
export function calculateDistance(
  lat1: number,
  lon1: number,
  lat2: number,
  lon2: number
): number {
  const R = 6371; // Radius of the Earth in km
  const dLat = ((lat2 - lat1) * Math.PI) / 180;
  const dLon = ((lon2 - lon1) * Math.PI) / 180;
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos((lat1 * Math.PI) / 180) *
      Math.cos((lat2 * Math.PI) / 180) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
}

/**
 * Get jams with optional filters
 */
export async function getJams(filters?: SearchFilters): Promise<Jam[]> {
  let query = supabase
    .from('jam')
    .select('*');

  // Apply city filter (case-insensitive)
  if (filters?.city) {
    query = query.ilike('city', filters.city);
  }

  // Apply semantic search filter (name, venue_name, venue_address, and description)
  if (filters?.search) {
    const searchTerm = filters.search;
    // Use or() with proper Supabase filter syntax to search across multiple fields
    query = query.or(
      `name.ilike.%${searchTerm}%,venue_name.ilike.%${searchTerm}%,venue_address.ilike.%${searchTerm}%,description.ilike.%${searchTerm}%`
    );
  }

  const { data, error } = await query;

  if (error) {
    throw new Error(`Failed to fetch jams: ${error.message}`);
  }

  let jams: Jam[] = (data || []).map(jam => ({ ...jam, contacts: [], update_sources: [] }));

  // If location is provided, sort by distance
  if (filters?.latitude !== undefined && filters?.longitude !== undefined) {
    jams = jams.sort((a, b) => {
      const aHasLocation = a.latitude !== null && a.longitude !== null;
      const bHasLocation = b.latitude !== null && b.longitude !== null;
      
      if (aHasLocation && bHasLocation) {
        const distanceA = calculateDistance(
          filters.latitude!,
          filters.longitude!,
          a.latitude!,
          a.longitude!
        );
        const distanceB = calculateDistance(
          filters.latitude!,
          filters.longitude!,
          b.latitude!,
          b.longitude!
        );
        return distanceA - distanceB;
      }
      if (aHasLocation) return -1;
      if (bHasLocation) return 1;
      return a.name.localeCompare(b.name);
    });
  } else {
    // Default sort by name when no location is provided
    jams.sort((a, b) => a.name.localeCompare(b.name));
  }

  return jams;
}

/**
 * Get a single jam by ID with all related data
 */
export async function getJamById(id: string): Promise<Jam | null> {
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
  const [contactsResult, updateSourcesResult] = await Promise.all([
    supabase
      .from('jam_contact')
      .select('*')
      .eq('jam_id', id)
      .order('is_primary', { ascending: false }),
    supabase
      .from('jam_update_source')
      .select('*')
      .eq('jam_id', id)
      .order('is_primary', { ascending: false }),
  ]);

  if (contactsResult.error) {
    throw new Error(`Failed to fetch contacts: ${contactsResult.error.message}`);
  }
  if (updateSourcesResult.error) {
    throw new Error(`Failed to fetch update sources: ${updateSourcesResult.error.message}`);
  }

  return {
    ...jam,
    contacts: contactsResult.data || [],
    update_sources: updateSourcesResult.data || [],
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
