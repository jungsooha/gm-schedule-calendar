import { create } from 'zustand';
import { Event } from '@/types';

interface EventStore {
  events: Event[];
  addEvent: (event: Omit<Event, 'id' | 'createdAt' | 'updatedAt'>) => void;
  updateEvent: (id: string, updates: Partial<Event>) => void;
  deleteEvent: (id: string) => void;
  getEventsByDate: (date: string) => Event[];
  getEventsByTeamMember: (teamMemberId: string) => Event[];
}

// 목업 이벤트 데이터
const MOCK_EVENTS: Event[] = [
  {
    id: '1',
    teamMemberId: '1',
    title: '회의',
    description: '월간 회의',
    date: '2026-05-18',
    startTime: '10:00',
    endTime: '11:00',
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    id: '2',
    teamMemberId: '2',
    title: '프레젠테이션',
    description: '분기 리뷰',
    date: '2026-05-18',
    startTime: '14:00',
    endTime: '15:30',
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    id: '3',
    teamMemberId: '3',
    title: '작업',
    description: '개발 작업',
    date: '2026-05-19',
    startTime: '09:00',
    endTime: '12:00',
    createdAt: new Date(),
    updatedAt: new Date(),
  },
];

export const useEventStore = create<EventStore>((set, get) => ({
  events: MOCK_EVENTS,

  addEvent: (event: Omit<Event, 'id' | 'createdAt' | 'updatedAt'>) => {
    const newEvent: Event = {
      ...event,
      id: Date.now().toString(),
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    set((state) => ({
      events: [...state.events, newEvent],
    }));
  },

  updateEvent: (id: string, updates: Partial<Event>) => {
    set((state) => ({
      events: state.events.map((event) =>
        event.id === id
          ? { ...event, ...updates, updatedAt: new Date() }
          : event
      ),
    }));
  },

  deleteEvent: (id: string) => {
    set((state) => ({
      events: state.events.filter((event) => event.id !== id),
    }));
  },

  getEventsByDate: (date: string) => {
    return get().events.filter((event) => event.date === date);
  },

  getEventsByTeamMember: (teamMemberId: string) => {
    return get().events.filter((event) => event.teamMemberId === teamMemberId);
  },
}));
