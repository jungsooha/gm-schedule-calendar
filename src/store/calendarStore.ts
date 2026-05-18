import { create } from 'zustand';
import { getWeekRange, getPreviousWeekStart, getNextWeekStart } from '@/utils/dateUtils';

interface CalendarStore {
  currentDate: Date;
  weekStart: Date;
  weekEnd: Date;
  goToToday: () => void;
  goToPreviousWeek: () => void;
  goToNextWeek: () => void;
  setCurrentDate: (date: Date) => void;
}

export const useCalendarStore = create<CalendarStore>((set) => {
  const today = new Date();
  const [weekStart, weekEnd] = getWeekRange(today);

  return {
    currentDate: today,
    weekStart,
    weekEnd,

    goToToday: () => {
      const today = new Date();
      const [weekStart, weekEnd] = getWeekRange(today);
      set({
        currentDate: today,
        weekStart,
        weekEnd,
      });
    },

    goToPreviousWeek: () => {
      set((state) => {
        const previousWeekStart = getPreviousWeekStart(state.weekStart);
        const [_, weekEnd] = getWeekRange(previousWeekStart);
        return {
          weekStart: previousWeekStart,
          weekEnd,
        };
      });
    },

    goToNextWeek: () => {
      set((state) => {
        const nextWeekStart = getNextWeekStart(state.weekStart);
        const [_, weekEnd] = getWeekRange(nextWeekStart);
        return {
          weekStart: nextWeekStart,
          weekEnd,
        };
      });
    },

    setCurrentDate: (date: Date) => {
      const [weekStart, weekEnd] = getWeekRange(date);
      set({
        currentDate: date,
        weekStart,
        weekEnd,
      });
    },
  };
});
