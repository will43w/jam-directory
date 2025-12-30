import type {
  JamSchedule,
  CreateScheduleData,
  UpdateScheduleData,
} from '@/lib/types';
import { supabase } from '@/lib/supabase/client';

/**
 * Get all schedules for a jam
 */
export async function getSchedulesByJamId(jamId: string): Promise<JamSchedule[]> {
  const { data, error } = await supabase
    .from('jam_schedule')
    .select('*')
    .eq('jam_id', jamId)
    .order('weekday');

  if (error) {
    throw new Error(`Failed to fetch schedules: ${error.message}`);
  }

  return data || [];
}

/**
 * Create a new schedule
 */
export async function createSchedule(data: CreateScheduleData): Promise<JamSchedule> {
  const { data: schedule, error } = await supabase
    .from('jam_schedule')
    .insert(data)
    .select()
    .single();

  if (error) {
    throw new Error(`Failed to create schedule: ${error.message}`);
  }

  return schedule;
}

/**
 * Update an existing schedule
 */
export async function updateSchedule(
  id: string,
  data: UpdateScheduleData
): Promise<JamSchedule> {
  const { data: schedule, error } = await supabase
    .from('jam_schedule')
    .update(data)
    .eq('id', id)
    .select()
    .single();

  if (error) {
    throw new Error(`Failed to update schedule: ${error.message}`);
  }

  return schedule;
}

/**
 * Delete a schedule
 */
export async function deleteSchedule(id: string): Promise<void> {
  const { error } = await supabase
    .from('jam_schedule')
    .delete()
    .eq('id', id);

  if (error) {
    throw new Error(`Failed to delete schedule: ${error.message}`);
  }
}
