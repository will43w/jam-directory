import type { JamSchedule, JamOccurrence, UpcomingDate } from '@/lib/types';
import { WEEKDAYS } from './constants';

/**
 * Calculate the next occurrence date for a given weekday and time
 */
export function getNextOccurrenceDate(
  weekday: number,
  startTime: string,
  afterDate: Date = new Date()
): Date {
  const result = new Date(afterDate);
  const currentDay = result.getDay();
  const daysUntilNext = (weekday - currentDay + 7) % 7;
  
  // If same day, check if time has passed
  if (daysUntilNext === 0) {
    const [hours, minutes] = startTime.split(':').map(Number);
    const scheduleTime = new Date(result);
    scheduleTime.setHours(hours, minutes || 0, 0, 0);
    
    if (scheduleTime <= afterDate) {
      result.setDate(result.getDate() + 7);
    }
  } else {
    result.setDate(result.getDate() + daysUntilNext);
  }
  
  return result;
}

/**
 * Format time string (HH:MM:SS or HH:MM) to display format (H:MM AM/PM)
 */
export function formatTime(time: string): string {
  const [hours, minutes] = time.split(':').map(Number);
  const period = hours >= 12 ? 'PM' : 'AM';
  const displayHours = hours % 12 || 12;
  const displayMinutes = minutes.toString().padStart(2, '0');
  return `${displayHours}:${displayMinutes} ${period}`;
}

/**
 * Format schedule display: "Every Tuesday at 7:30pm"
 */
export function formatScheduleDisplay(schedule: JamSchedule): string {
  const weekday = WEEKDAYS[schedule.weekday];
  const time = formatTime(schedule.start_time);
  
  if (schedule.end_time) {
    const endTime = formatTime(schedule.end_time);
    return `Every ${weekday} at ${time} - ${endTime}`;
  }
  
  return `Every ${weekday} at ${time}`;
}

/**
 * Check if a date is "tonight" (today's date)
 */
export function isTonight(date: Date, timezone?: string): boolean {
  const today = new Date();
  const compareDate = new Date(date);
  
  // Simple check: same year, month, day
  // TODO: Handle timezone properly if needed
  return (
    today.getFullYear() === compareDate.getFullYear() &&
    today.getMonth() === compareDate.getMonth() &&
    today.getDate() === compareDate.getDate()
  );
}

/**
 * Format date to YYYY-MM-DD string
 */
export function formatDateString(date: Date): string {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

/**
 * Parse YYYY-MM-DD string to Date
 */
export function parseDateString(dateString: string): Date {
  return new Date(dateString + 'T00:00:00');
}

/**
 * Compute upcoming jam dates from schedule and occurrences
 */
export function computeUpcomingDates(
  schedules: JamSchedule[],
  occurrences: JamOccurrence[],
  limit: number = 6,
  afterDate?: Date
): UpcomingDate[] {
  const after = afterDate || new Date();
  const upcomingDates: UpcomingDate[] = [];
  
  // Only consider active schedules
  const activeSchedules = schedules.filter(s => s.is_active);
  
  // Generate dates from schedules
  const scheduleDates = new Map<string, UpcomingDate>();
  
  for (const schedule of activeSchedules) {
    let currentDate = getNextOccurrenceDate(schedule.weekday, schedule.start_time, after);
    let count = 0;
    const maxIterations = limit * 3; // Generate more to account for cancellations
    
    while (count < maxIterations && scheduleDates.size < limit * 3) {
      const dateKey = formatDateString(currentDate);
      
      // Check if this date has an exception
      const occurrence = occurrences.find(
        o => o.date === dateKey && o.jam_id === schedule.jam_id
      );
      
      if (occurrence) {
        // Apply exception
        if (occurrence.status === 'cancelled') {
          // Skip cancelled dates - don't add to map
          currentDate = getNextOccurrenceDate(
            schedule.weekday,
            schedule.start_time,
            new Date(currentDate.getTime() + 24 * 60 * 60 * 1000)
          );
          count++;
          continue;
        }
        
        // Use exception times if provided, otherwise use schedule times
        const startTime = occurrence.start_time || schedule.start_time;
        const endTime = occurrence.end_time || schedule.end_time;
        
        scheduleDates.set(dateKey, {
          date: dateKey,
          startTime,
          endTime,
          status: occurrence.status,
          notes: occurrence.notes,
        });
      } else {
        // Use schedule default - only add if not already in map (from another schedule)
        if (!scheduleDates.has(dateKey)) {
          scheduleDates.set(dateKey, {
            date: dateKey,
            startTime: schedule.start_time,
            endTime: schedule.end_time,
            status: null,
            notes: null,
          });
        }
      }
      
      // Move to next occurrence
      currentDate = getNextOccurrenceDate(
        schedule.weekday,
        schedule.start_time,
        new Date(currentDate.getTime() + 24 * 60 * 60 * 1000)
      );
      count++;
    }
  }
  
  // Convert to array, sort by date, and limit
  const sortedDates = Array.from(scheduleDates.values())
    .sort((a, b) => a.date.localeCompare(b.date))
    .slice(0, limit);
  
  return sortedDates;
}

/**
 * Format date for display (e.g., "Jan 15, 2024")
 */
export function formatDateDisplay(dateString: string): string {
  const date = parseDateString(dateString);
  return date.toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  });
}

/**
 * Format date and time for display (e.g., "Jan 15, 2024 at 7:30 PM")
 */
export function formatDateTimeDisplay(dateString: string, timeString: string): string {
  const date = parseDateString(dateString);
  const formattedDate = date.toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  });
  const formattedTime = formatTime(timeString);
  return `${formattedDate} at ${formattedTime}`;
}

