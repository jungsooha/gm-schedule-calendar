// 팀원 타입
export interface TeamMember {
  id: string;
  name: string;
  color: string;
  icon: string;
  createdAt: Date;
}

// 일정 타입
export interface Event {
  id: string;
  teamMemberId: string;
  title: string;
  description?: string;
  date: string; // YYYY-MM-DD 형식
  startTime?: string; // HH:mm 형식
  endTime?: string; // HH:mm 형식
  createdAt: Date;
  updatedAt: Date;
}

// 캘린더 상태 타입
export interface CalendarState {
  currentDate: Date;
  selectedWeek: [Date, Date]; // [시작날, 끝날]
}

// 모달 상태 타입
export interface ModalState {
  isOpen: boolean;
  mode: 'add' | 'edit' | null;
  event: Event | null;
  selectedDate: string | null;
}
