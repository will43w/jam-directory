// Core data types matching PRD data model

export type ContactType = 'email' | 'instagram' | 'facebook' | 'website' | 'other';

export type OccurrenceStatus = 'created' | 'cancelled' | 'moved';

export type SuggestionType = 'new_jam' | 'update_info' | 'inactive' | 'other';

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
  created_at: string;
  updated_at: string;
}

export interface JamSchedule {
  id: string;
  jam_id: string;
  weekday: number; // 0=Sun, 1=Mon, ..., 6=Sat
  start_time: string; // Time format (HH:MM:SS or HH:MM)
  end_time: string | null;
  timezone: string;
  is_active: boolean;
}

export interface JamOccurrence {
  id: string;
  jam_id: string;
  date: string; // Date format (YYYY-MM-DD)
  start_time: string | null;
  end_time: string | null;
  status: OccurrenceStatus;
  notes: string | null;
  created_at: string;
}

export interface JamContact {
  id: string;
  jam_id: string;
  contact_type: ContactType;
  contact_value: string;
  is_primary: boolean;
}

export interface JamSuggestion {
  id: string;
  jam_id: string | null;
  suggestion_type: SuggestionType;
  message: string;
  source_url: string | null;
  created_at: string;
}

// Computed/derived types

export interface UpcomingDate {
  date: string; // YYYY-MM-DD
  startTime: string; // Time format
  endTime: string | null;
  status: OccurrenceStatus | null; // null means default from schedule
  notes: string | null;
}

export interface JamWithRelations extends Jam {
  schedules: JamSchedule[];
  contacts: JamContact[];
  occurrences: JamOccurrence[];
}

// Search and filter types

export interface SearchFilters {
  city?: string;
  search?: string;
  days?: number[]; // 0-6 for weekday (OR logic when multiple selected)
  after?: string; // Time format (HH:MM)
  tonight?: boolean;
  skill_levels?: string[]; // Skill level values (OR logic when multiple selected)
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
}

export interface UpdateJamData extends Partial<CreateJamData> {}

export interface CreateScheduleData {
  jam_id: string;
  weekday: number;
  start_time: string;
  end_time?: string | null;
  timezone: string;
  is_active: boolean;
}

export interface UpdateScheduleData extends Partial<Omit<CreateScheduleData, 'jam_id'>> {}

export interface CreateOccurrenceData {
  jam_id: string;
  date: string;
  start_time?: string | null;
  end_time?: string | null;
  status: OccurrenceStatus;
  notes?: string | null;
}

export interface UpdateOccurrenceData extends Partial<Omit<CreateOccurrenceData, 'jam_id' | 'date'>> {}

export interface CreateContactData {
  jam_id: string;
  contact_type: ContactType;
  contact_value: string;
  is_primary: boolean;
}

export interface UpdateContactData extends Partial<Omit<CreateContactData, 'jam_id'>> {}

export interface CreateSuggestionData {
  jam_id: string | null;
  suggestion_type: SuggestionType;
  message: string;
  source_url?: string | null;
}

