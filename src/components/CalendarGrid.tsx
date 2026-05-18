'use client';

import React, { useState } from 'react';
import { getTwoWeeks, formatDateToString, isSameDay } from '@/utils/dateUtils';
import { DAY_NAMES_FULL } from '@/utils/constants';
import { useEventStore } from '@/store/eventStore';
import EventBlock from './EventBlock';
import EventModal from './EventModal';
import { Event } from '@/types';

interface CalendarGridProps {
  currentDate: Date;
}

const CalendarGrid: React.FC<CalendarGridProps> = ({ currentDate }) => {
  const twoWeeks = getTwoWeeks(currentDate);
  const { getEventsByDate } = useEventStore();
  const today = new Date();
  const [selectedEvent, setSelectedEvent] = useState<Event | null>(null);
  const [modalMode, setModalMode] = useState<'add' | 'edit' | null>(null);
  const [selectedDate, setSelectedDate] = useState<string | null>(null);

  const handleDateClick = (date: Date) => {
    setSelectedDate(formatDateToString(date));
    setModalMode('add');
  };

  const handleEventClick = (event: Event) => {
    setSelectedEvent(event);
    setModalMode('edit');
  };

  const handleCloseModal = () => {
    setModalMode(null);
    setSelectedEvent(null);
    setSelectedDate(null);
  };

  // 그룹화: 주당 7일씩
  const weeks = [];
  for (let i = 0; i < twoWeeks.length; i += 7) {
    weeks.push(twoWeeks.slice(i, i + 7));
  }

  return (
    <>
      <div className="grid grid-cols-7 gap-2 mb-8">
        {weeks.map((week, weekIndex) => (
          <React.Fragment key={weekIndex}>
            {week.map((date) => {
              const dateStr = formatDateToString(date);
              const events = getEventsByDate(dateStr);
              const isToday = isSameDay(date, today);
              const dayName = DAY_NAMES_FULL[date.getDay()];

              return (
                <div
                  key={dateStr}
                  onClick={() => handleDateClick(date)}
                  className={`border-2 rounded-xl p-3 min-h-[200px] cursor-pointer transition-all ${
                    isToday
                      ? 'bg-sage-50 border-sage-400 shadow-md'
                      : 'bg-white border-muted-200 hover:border-sage-300 hover:shadow-sm'
                  }`}
                >
                  {/* 날짜 헤더 */}
                  <div className="mb-3 pb-2 border-b border-muted-200">
                    <div className="font-bold text-muted-900 text-lg">
                      {date.getDate()}
                    </div>
                    <div className="text-xs text-muted-500">{dayName}</div>
                  </div>

                  {/* 이벤트 목록 */}
                  <div className="space-y-1">
                    {events.map((event) => (
                      <div
                        key={event.id}
                        onClick={(e) => {
                          e.stopPropagation();
                          handleEventClick(event);
                        }}
                      >
                        <EventBlock event={event} />
                      </div>
                    ))}
                  </div>
                </div>
              );
            })}
          </React.Fragment>
        ))}
      </div>

      {/* 이벤트 모달 */}
      {modalMode && (
        <EventModal
          isOpen={true}
          mode={modalMode}
          event={selectedEvent}
          selectedDate={selectedDate}
          onClose={handleCloseModal}
        />
      )}
    </>
  );
};

export default CalendarGrid;
