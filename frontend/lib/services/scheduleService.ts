import type {
  JamSchedule,
  CreateScheduleData,
  UpdateScheduleData,
} from '@/lib/types';

/**
 * Service interface for schedule operations
 * Implementation will be provided via Supabase
 */
export async function getSchedulesByJamId(jamId: string): Promise<JamSchedule[]> {
  // TODO: Implement with Supabase
  throw new Error('Not implemented: Use Supabase implementation');
}

export async function createSchedule(data: CreateScheduleData): Promise<JamSchedule> {
  // TODO: Implement with Supabase
  throw new Error('Not implemented: Use Supabase implementation');
}

export async function updateSchedule(
  id: string,
  data: UpdateScheduleData
): Promise<JamSchedule> {
  // TODO: Implement with Supabase
  throw new Error('Not implemented: Use Supabase implementation');
}

export async function deleteSchedule(id: string): Promise<void> {
  // TODO: Implement with Supabase
  throw new Error('Not implemented: Use Supabase implementation');
}

