'use client';

import { useState } from 'react';

interface CalendarProps {
  year: number;
  month: number; // 0-11 (0 = January)
  onDateClick?: (date: Date) => void;
  highlightedDates?: Set<string>; // Set of date strings (YYYY-MM-DD)
  exceptionDates?: Map<string, { status: 'cancelled' | 'moved' | 'created'; color?: string }>; // Map of date strings to exception info
}

export function Calendar({
  year,
  month,
  onDateClick,
  highlightedDates = new Set(),
  exceptionDates = new Map(),
}: CalendarProps) {
  const firstDay = new Date(year, month, 1);
  const lastDay = new Date(year, month + 1, 0);
  const daysInMonth = lastDay.getDate();
  const startingDayOfWeek = firstDay.getDay();

  const weekDays = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

  const formatDateKey = (day: number) => {
    const date = new Date(year, month, day);
    return date.toISOString().split('T')[0];
  };

  const getDateStatus = (day: number) => {
    const dateKey = formatDateKey(day);
    if (exceptionDates.has(dateKey)) {
      return exceptionDates.get(dateKey);
    }
    if (highlightedDates.has(dateKey)) {
      return { status: 'default' as const };
    }
    return null;
  };

  return (
    <div className="w-full">
      <div className="grid grid-cols-7 gap-1 mb-2">
        {weekDays.map((day) => (
          <div key={day} className="text-center text-sm font-medium text-gray-600 py-2">
            {day}
          </div>
        ))}
      </div>
      <div className="grid grid-cols-7 gap-1">
        {Array.from({ length: startingDayOfWeek }).map((_, index) => (
          <div key={`empty-${index}`} className="aspect-square" />
        ))}
        {Array.from({ length: daysInMonth }).map((_, index) => {
          const day = index + 1;
          const dateKey = formatDateKey(day);
          const status = getDateStatus(day);
          const isToday = new Date().toDateString() === new Date(year, month, day).toDateString();
          
          return (
            <button
              key={day}
              onClick={() => onDateClick?.(new Date(year, month, day))}
              className={`
                aspect-square rounded-lg text-sm font-medium
                transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-1
                ${status?.status === 'cancelled' ? 'bg-red-100 text-red-700 hover:bg-red-200' : ''}
                ${status?.status === 'moved' ? 'bg-yellow-100 text-yellow-700 hover:bg-yellow-200' : ''}
                ${status?.status === 'created' ? 'bg-blue-100 text-blue-700 hover:bg-blue-200' : ''}
                ${status?.status === 'default' ? 'bg-gray-100 text-gray-700 hover:bg-gray-200' : ''}
                ${!status ? 'text-gray-900 hover:bg-gray-100' : ''}
                ${isToday ? 'ring-2 ring-blue-500' : ''}
              `}
            >
              {day}
            </button>
          );
        })}
      </div>
    </div>
  );
}

