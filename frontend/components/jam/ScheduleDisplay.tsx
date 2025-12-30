import type { JamSchedule } from '@/lib/types';
import { formatScheduleDisplay } from '@/lib/utils/dateUtils';

interface ScheduleDisplayProps {
  schedules: JamSchedule[];
}

export function ScheduleDisplay({ schedules }: ScheduleDisplayProps) {
  const activeSchedules = schedules.filter(s => s.is_active);
  
  if (activeSchedules.length === 0) {
    return <p className="text-gray-600">No schedule available</p>;
  }
  
  return (
    <div className="space-y-2">
      {activeSchedules.map((schedule) => (
        <p key={schedule.id} className="text-lg">
          {formatScheduleDisplay(schedule)}
        </p>
      ))}
    </div>
  );
}

