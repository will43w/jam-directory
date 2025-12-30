import type { JamSuggestion, CreateSuggestionData } from '@/lib/types';

/**
 * Service interface for suggestion submissions (public, no auth)
 * Implementation will be provided via Supabase
 */
export async function submitSuggestion(data: CreateSuggestionData): Promise<JamSuggestion> {
  // TODO: Implement with Supabase
  throw new Error('Not implemented: Use Supabase implementation');
}

