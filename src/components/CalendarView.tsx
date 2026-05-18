'use client';

import React from 'react';
import { useCalendarStore } from '@/store/calendarStore';
import CalendarHeader from './CalendarHeader';
import CalendarGrid from './CalendarGrid';
import TeamPanel from './TeamPanel';

const CalendarView: React.FC = () => {
  const {
    currentDate,
    weekStart,
    goToToday,
    goToPreviousWeek,
    goToNextWeek,
  } = useCalendarStore();

  return (
    <div className="min-h-screen bg-muted-50 p-6">
      <div className="max-w-7xl mx-auto">
        <CalendarHeader
          currentDate={weekStart}
          onPrevious={goToPreviousWeek}
          onNext={goToNextWeek}
          onToday={goToToday}
        />

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* 메인 캘린더 */}
          <div className="lg:col-span-3">
            <CalendarGrid currentDate={weekStart} />
          </div>

          {/* 팀원 패널 */}
          <div className="lg:col-span-1">
            <TeamPanel />
          </div>
        </div>
      </div>
    </div>
  );
};

export default CalendarView;
