import type { JamSuggestion, CreateSuggestionData } from '@/lib/types';
import { supabase } from '@/lib/supabase/client';

/**
 * Submit a suggestion (public, no auth required)
 */
export async function submitSuggestion(data: CreateSuggestionData): Promise<void> {
  const { data: suggestion, error } = await supabase
    .from('jam_suggestion')
    .insert(data);

  if (error) {
    throw new Error(`Failed to submit suggestion: ${error.message}`);
  }
}
