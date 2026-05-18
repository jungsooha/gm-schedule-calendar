import { create } from 'zustand';
import { TeamMember } from '@/types';
import { getColorByIndex, getIconByIndex } from '@/utils/colorUtils';
import { MOCK_TEAM_MEMBERS } from '@/utils/constants';

interface TeamStore {
  teamMembers: TeamMember[];
  addTeamMember: (name: string) => void;
  removeTeamMember: (id: string) => void;
  updateTeamMember: (id: string, updates: Partial<TeamMember>) => void;
  getTeamMemberById: (id: string) => TeamMember | undefined;
}

export const useTeamStore = create<TeamStore>((set, get) => ({
  teamMembers: MOCK_TEAM_MEMBERS,

  addTeamMember: (name: string) => {
    const newMember: TeamMember = {
      id: Date.now().toString(),
      name,
      color: getColorByIndex(get().teamMembers.length),
      icon: getIconByIndex(get().teamMembers.length),
      createdAt: new Date(),
    };
    set((state) => ({
      teamMembers: [...state.teamMembers, newMember],
    }));
  },

  removeTeamMember: (id: string) => {
    set((state) => ({
      teamMembers: state.teamMembers.filter((member) => member.id !== id),
    }));
  },

  updateTeamMember: (id: string, updates: Partial<TeamMember>) => {
    set((state) => ({
      teamMembers: state.teamMembers.map((member) =>
        member.id === id ? { ...member, ...updates } : member
      ),
    }));
  },

  getTeamMemberById: (id: string) => {
    return get().teamMembers.find((member) => member.id === id);
  },
}));
