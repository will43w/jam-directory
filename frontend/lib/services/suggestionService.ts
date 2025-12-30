import type { JamSuggestion, CreateSuggestionData } from '@/lib/types';
import { supabase } from '@/lib/supabase/client';

/**
 * Submit a suggestion (public, no auth required)
 */
export async function submitSuggestion(data: CreateSuggestionData): Promise<JamSuggestion> {
  const { data: suggestion, error } = await supabase
    .from('jam_suggestion')
    .insert(data)
    .select()
    .single();

  if (error) {
    throw new Error(`Failed to submit suggestion: ${error.message}`);
  }

  return suggestion;
}
