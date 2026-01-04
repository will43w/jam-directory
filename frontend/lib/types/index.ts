// Core data types matching PRD data model

export type ContactType = 'email' | 'phone' | 'instagram_dm' | 'facebook_dm' | 'website_contact' | 'other';

export type UpdateSourceType = 'website' | 'facebook' | 'instagram' | 'twitter' | 'other';

export type SuggestionType = 'new_jam' | 'update_info' | 'inactive' | 'other';

export interface JamContact {
  id: string;
  jam_id: string;
  contact_type: ContactType;
  contact_value: string;
  is_primary: boolean;
}

export interface JamUpdateSource {
  id: string;
  jam_id: string;
  source_type: UpdateSourceType;
  source_value: string;
  is_primary: boolean;
}

export interface Jam {
  id: string;
  name: string;
  city: string;
  venue_name: string;
  venue_address: string;
  latitude: number | null;
  longitude: number | null;
  description: string | null;
  skill_level: string | null;
  image_url: string | null;
  canonical_source_url: string | null;
  schedule: string | null; // Free-form text schedule (e.g., "Last Thursday of every month")
  created_at: string;
  updated_at: string;
  // Relations (may be empty arrays if not fetched)
  contacts?: JamContact[];
  update_sources?: JamUpdateSource[];
}

export interface JamSuggestion {
  id: string;
  jam_id: string | null;
  suggestion_type: SuggestionType;
  message: string;
  source_url: string | null;
  created_at: string;
}

// Search and filter types

export interface SearchFilters {
  city?: string;
  search?: string;
  // Location-based search
  latitude?: number;
  longitude?: number;
}

// Form data types

export interface CreateJamData {
  name: string;
  city: string;
  venue_name: string;
  venue_address: string;
  latitude?: number | null;
  longitude?: number | null;
  description?: string | null;
  skill_level?: string | null;
  image_url?: string | null;
  canonical_source_url?: string | null;
  schedule?: string | null;
}

export interface UpdateJamData extends Partial<CreateJamData> {}

export interface CreateContactData {
  jam_id: string;
  contact_type: ContactType;
  contact_value: string;
  is_primary: boolean;
}

export interface UpdateContactData extends Partial<Omit<CreateContactData, 'jam_id'>> {}

export interface CreateUpdateSourceData {
  jam_id: string;
  source_type: UpdateSourceType;
  source_value: string;
  is_primary: boolean;
}

export interface UpdateUpdateSourceData extends Partial<Omit<CreateUpdateSourceData, 'jam_id'>> {}

export interface CreateSuggestionData {
  jam_id: string | null;
  suggestion_type: SuggestionType;
  message: string;
  source_url?: string | null;
}

