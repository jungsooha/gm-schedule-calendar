import { TeamMember } from '@/types';

// 색상 팔레트 (뮤트톤)
export const COLOR_PALETTE = [
  { name: 'Sage Green', hex: '#8CB97D', tailwind: 'bg-sage-500' },
  { name: 'Dusty Rose', hex: '#E1ADA5', tailwind: 'bg-rose-500' },
  { name: 'Slate Blue', hex: '#828DAB', tailwind: 'bg-slate-500' },
  { name: 'Warm Amber', hex: '#FAC770', tailwind: 'bg-amber-500' },
  { name: 'Soft Cyan', hex: '#26C6DA', tailwind: 'bg-cyan-500' },
  { name: 'Muted Purple', hex: '#B5AE9F', tailwind: 'bg-muted-500' },
];

// 아이콘 목록
export const ICON_LIST = [
  'User',
  'Users',
  'UserCheck',
  'UserCog',
  'Briefcase',
  'Zap',
  'Star',
  'Heart',
  'Archive',
  'AlertCircle',
];

// 요일 이름
export const DAY_NAMES = ['일', '월', '화', '수', '목', '금', '토'];
export const DAY_NAMES_FULL = ['일요일', '월요일', '화요일', '수요일', '목요일', '금요일', '토요일'];

// 목업 팀원 데이터
export const MOCK_TEAM_MEMBERS: TeamMember[] = [
  {
    id: '1',
    name: '김철수',
    color: '#8CB97D',
    icon: 'User',
    createdAt: new Date(),
  },
  {
    id: '2',
    name: '이영희',
    color: '#E1ADA5',
    icon: 'Users',
    createdAt: new Date(),
  },
  {
    id: '3',
    name: '박준호',
    color: '#828DAB',
    icon: 'Briefcase',
    createdAt: new Date(),
  },
];
