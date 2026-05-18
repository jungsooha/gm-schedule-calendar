'use client';

import React, { useState, useEffect } from 'react';
import { Event } from '@/types';
import { useEventStore } from '@/store/eventStore';
import { useTeamStore } from '@/store/teamStore';
import Modal from './ui/Modal';
import Button from './ui/Button';
import Input from './ui/Input';

interface EventModalProps {
  isOpen: boolean;
  mode: 'add' | 'edit';
  event: Event | null;
  selectedDate: string | null;
  onClose: () => void;
}

const EventModal: React.FC<EventModalProps> = ({
  isOpen,
  mode,
  event,
  selectedDate,
  onClose,
}) => {
  const { teamMembers } = useTeamStore();
  const { addEvent, updateEvent, deleteEvent } = useEventStore();

  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [startTime, setStartTime] = useState('');
  const [endTime, setEndTime] = useState('');
  const [teamMemberId, setTeamMemberId] = useState(teamMembers[0]?.id || '');

  useEffect(() => {
    if (mode === 'edit' && event) {
      setTitle(event.title);
      setDescription(event.description || '');
      setStartTime(event.startTime || '');
      setEndTime(event.endTime || '');
      setTeamMemberId(event.teamMemberId);
    } else {
      resetForm();
      if (teamMembers.length > 0) {
        setTeamMemberId(teamMembers[0].id);
      }
    }
  }, [mode, event, isOpen, teamMembers]);

  const resetForm = () => {
    setTitle('');
    setDescription('');
    setStartTime('');
    setEndTime('');
  };

  const handleSave = () => {
    if (!title.trim() || !teamMemberId) return;

    if (mode === 'add') {
      addEvent({
        teamMemberId,
        title,
        description,
        date: selectedDate || new Date().toISOString().split('T')[0],
        startTime: startTime || undefined,
        endTime: endTime || undefined,
      });
    } else if (mode === 'edit' && event) {
      updateEvent(event.id, {
        title,
        description,
        startTime: startTime || undefined,
        endTime: endTime || undefined,
        teamMemberId,
      });
    }

    onClose();
  };

  const handleDelete = () => {
    if (mode === 'edit' && event) {
      deleteEvent(event.id);
      onClose();
    }
  };

  const title_text = mode === 'add' ? '새 일정 추가' : '일정 수정';

  return (
    <Modal
      isOpen={isOpen}
      title={title_text}
      onClose={onClose}
      footer={
        <>
          {mode === 'edit' && (
            <Button
              variant="danger"
              size="sm"
              onClick={handleDelete}
              className="mr-auto"
            >
              삭제
            </Button>
          )}
          <Button
            variant="secondary"
            size="sm"
            onClick={onClose}
          >
            취소
          </Button>
          <Button
            variant="primary"
            size="sm"
            onClick={handleSave}
            disabled={!title.trim()}
          >
            저장
          </Button>
        </>
      }
    >
      <div className="space-y-4">
        {/* 팀원 선택 */}
        <div>
          <label className="block text-sm font-medium text-muted-900 mb-2">
            담당자
          </label>
          <select
            value={teamMemberId}
            onChange={(e) => setTeamMemberId(e.target.value)}
            className="w-full px-3 py-2 border border-muted-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-sage-500 text-muted-900"
          >
            {teamMembers.map((member) => (
              <option key={member.id} value={member.id}>
                {member.name}
              </option>
            ))}
          </select>
        </div>

        {/* 제목 */}
        <div>
          <label className="block text-sm font-medium text-muted-900 mb-2">
            일정명 *
          </label>
          <Input
            placeholder="일정명을 입력하세요"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            autoFocus
          />
        </div>

        {/* 설명 */}
        <div>
          <label className="block text-sm font-medium text-muted-900 mb-2">
            설명
          </label>
          <textarea
            placeholder="설명을 입력하세요 (선택)"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className="w-full px-3 py-2 border border-muted-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-sage-500 text-muted-900 resize-none"
            rows={3}
          />
        </div>

        {/* 시간 */}
        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="block text-sm font-medium text-muted-900 mb-2">
              시작 시간
            </label>
            <Input
              type="time"
              value={startTime}
              onChange={(e) => setStartTime(e.target.value)}
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-muted-900 mb-2">
              종료 시간
            </label>
            <Input
              type="time"
              value={endTime}
              onChange={(e) => setEndTime(e.target.value)}
            />
          </div>
        </div>
      </div>
    </Modal>
  );
};

export default EventModal;
