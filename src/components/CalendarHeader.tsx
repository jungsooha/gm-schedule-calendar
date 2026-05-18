'use client';

import React from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import Button from './ui/Button';
import { formatDateToMonthDay, getWeekRange } from '@/utils/dateUtils';

interface CalendarHeaderProps {
  currentDate: Date;
  onPrevious: () => void;
  onNext: () => void;
  onToday: () => void;
}

const CalendarHeader: React.FC<CalendarHeaderProps> = ({
  currentDate,
  onPrevious,
  onNext,
  onToday,
}) => {
  const [weekStart, weekEnd] = getWeekRange(currentDate);
  const weekStartStr = formatDateToMonthDay(weekStart);
  const weekEndStr = formatDateToMonthDay(weekEnd);

  return (
    <div className="flex items-center justify-between mb-8">
      {/* 타이틀 및 날짜 범위 */}
      <div>
        <h1 className="text-3xl font-bold text-muted-900 mb-2">
          캘린더
        </h1>
        <p className="text-muted-600">
          {weekStartStr} ~ {weekEndStr}
        </p>
      </div>

      {/* 네비게이션 버튼 */}
      <div className="flex items-center gap-3">
        <Button
          variant="secondary"
          size="md"
          onClick={onPrevious}
          className="flex items-center gap-1"
        >
          <ChevronLeft size={20} />
          이전
        </Button>
        <Button
          variant="ghost"
          size="md"
          onClick={onToday}
        >
          오늘
        </Button>
        <Button
          variant="secondary"
          size="md"
          onClick={onNext}
          className="flex items-center gap-1"
        >
          다음
          <ChevronRight size={20} />
        </Button>
      </div>
    </div>
  );
};

export default CalendarHeader;
