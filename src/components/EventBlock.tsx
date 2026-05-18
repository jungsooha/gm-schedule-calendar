'use client';

import React from 'react';
import { Event } from '@/types';
import { useTeamStore } from '@/store/teamStore';
import { getContrastTextColor } from '@/utils/colorUtils';

interface EventBlockProps {
  event: Event;
  onClick?: () => void;
}

const EventBlock: React.FC<EventBlockProps> = ({ event, onClick }) => {
  const { getTeamMemberById } = useTeamStore();
  const teamMember = getTeamMemberById(event.teamMemberId);

  if (!teamMember) return null;

  const textColor = getContrastTextColor(teamMember.color);

  return (
    <div
      onClick={onClick}
      className="event-block mb-1 cursor-pointer hover:shadow-md transition-shadow"
      style={{
        backgroundColor: teamMember.color,
        color: textColor,
      }}
      title={event.description || event.title}
    >
      <div className="text-xs font-semibold truncate">{event.title}</div>
      {event.startTime && (
        <div className="text-xs opacity-90">{event.startTime}</div>
      )}
    </div>
  );
};

export default EventBlock;
