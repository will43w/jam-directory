import type {
  Jam,
  CreateJamData,
  UpdateJamData,
  SearchFilters,
  JamWithRelations,
} from '@/lib/types';

/**
 * Service interface for jam operations
 * Implementation will be provided via Supabase
 */
export async function getJams(filters?: SearchFilters): Promise<Jam[]> {
  // TODO: Implement with Supabase
  throw new Error('Not implemented: Use Supabase implementation');
}

export async function getJamById(id: string): Promise<JamWithRelations | null> {
  // TODO: Implement with Supabase
  throw new Error('Not implemented: Use Supabase implementation');
}

export async function createJam(data: CreateJamData): Promise<Jam> {
  // TODO: Implement with Supabase
  throw new Error('Not implemented: Use Supabase implementation');
}

export async function updateJam(id: string, data: UpdateJamData): Promise<Jam> {
  // TODO: Implement with Supabase
  throw new Error('Not implemented: Use Supabase implementation');
}

export async function deleteJam(id: string): Promise<void> {
  // TODO: Implement with Supabase
  throw new Error('Not implemented: Use Supabase implementation');
}

