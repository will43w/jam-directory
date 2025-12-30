'use client';

import { useState } from 'react';
import type { JamSchedule, JamOccurrence } from '@/lib/types';
import { Calendar } from '@/components/ui/Calendar';
import { ExceptionModal } from './ExceptionModal';
import { formatDateString, getNextOccurrenceDate } from '@/lib/utils/dateUtils';

interface ExceptionCalendarProps {
  schedules: JamSchedule[];
  occurrences: JamOccurrence[];
  jamId: string;
  onSave: (data: any, id?: string) => Promise<void>;
  onDelete: (id: string) => Promise<void>;
}

export function ExceptionCalendar({
  schedules,
  occurrences,
  jamId,
  onSave,
  onDelete,
}: ExceptionCalendarProps) {
  const [currentMonth, setCurrentMonth] = useState(new Date().getMonth());
  const [currentYear, setCurrentYear] = useState(new Date().getFullYear());
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Generate highlighted dates from schedules
  const highlightedDates = new Set<string>();
  const activeSchedules = schedules.filter(s => s.is_active);
  
  // Generate dates for the current month view (plus some padding)
  const startDate = new Date(currentYear, currentMonth, 1);
  const endDate = new Date(currentYear, currentMonth + 1, 0);
  
  activeSchedules.forEach((schedule) => {
    let date = getNextOccurrenceDate(schedule.weekday, schedule.start_time, startDate);
    while (date <= endDate) {
      highlightedDates.add(formatDateString(date));
      date = getNextOccurrenceDate(
        schedule.weekday,
        schedule.start_time,
        new Date(date.getTime() + 24 * 60 * 60 * 1000)
      );
      // Prevent infinite loop
      if (date <= new Date(date.getTime() - 24 * 60 * 60 * 1000)) break;
    }
  });

  // Create exception dates map
  const exceptionDates = new Map<string, { status: 'cancelled' | 'moved' | 'created'; color?: string }>();
  occurrences.forEach((occ) => {
    exceptionDates.set(occ.date, {
      status: occ.status,
    });
  });

  const handleDateClick = (date: Date) => {
    setSelectedDate(date);
    setIsModalOpen(true);
  };

  const handleModalClose = () => {
    setIsModalOpen(false);
    setSelectedDate(null);
  };

  const getDefaultTimes = (date: Date) => {
    const dateKey = formatDateString(date);
    const dayOfWeek = date.getDay();
    const schedule = activeSchedules.find(s => s.weekday === dayOfWeek);
    return {
      startTime: schedule?.start_time || '19:00',
      endTime: schedule?.end_time || null,
    };
  };

  const selectedOccurrence = selectedDate
    ? occurrences.find(o => o.date === formatDateString(selectedDate))
    : null;

  const defaultTimes = selectedDate ? getDefaultTimes(selectedDate) : { startTime: '19:00', endTime: null };

  const handlePrevMonth = () => {
    if (currentMonth === 0) {
      setCurrentMonth(11);
      setCurrentYear(currentYear - 1);
    } else {
      setCurrentMonth(currentMonth - 1);
    }
  };

  const handleNextMonth = () => {
    if (currentMonth === 11) {
      setCurrentMonth(0);
      setCurrentYear(currentYear + 1);
    } else {
      setCurrentMonth(currentMonth + 1);
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold">Exception Calendar</h3>
        <div className="flex gap-2">
          <button
            onClick={handlePrevMonth}
            className="px-3 py-1 border border-gray-300 rounded-lg hover:bg-gray-100"
          >
            ←
          </button>
          <span className="px-4 py-1 font-medium">
            {new Date(currentYear, currentMonth).toLocaleDateString('en-US', {
              month: 'long',
              year: 'numeric',
            })}
          </span>
          <button
            onClick={handleNextMonth}
            className="px-3 py-1 border border-gray-300 rounded-lg hover:bg-gray-100"
          >
            →
          </button>
        </div>
      </div>

      <Calendar
        year={currentYear}
        month={currentMonth}
        onDateClick={handleDateClick}
        highlightedDates={highlightedDates}
        exceptionDates={exceptionDates}
      />

      {selectedDate && (
        <ExceptionModal
          isOpen={isModalOpen}
          onClose={handleModalClose}
          date={selectedDate}
          existingOccurrence={selectedOccurrence || null}
          defaultStartTime={defaultTimes.startTime}
          defaultEndTime={defaultTimes.endTime}
          onSave={onSave}
          onDelete={onDelete}
          jamId={jamId}
        />
      )}
    </div>
  );
}

