'use client';

import React, { useState } from 'react';
import { Plus, Trash2 } from 'lucide-react';
import { useTeamStore } from '@/store/teamStore';
import { useEventStore } from '@/store/eventStore';
import Button from './ui/Button';
import Input from './ui/Input';
import Modal from './ui/Modal';
import { getContrastTextColor } from '@/utils/colorUtils';

const TeamPanel: React.FC = () => {
  const { teamMembers, addTeamMember, removeTeamMember } = useTeamStore();
  const { getEventsByTeamMember } = useEventStore();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newMemberName, setNewMemberName] = useState('');

  const handleAddMember = () => {
    if (newMemberName.trim()) {
      addTeamMember(newMemberName);
      setNewMemberName('');
      setIsModalOpen(false);
    }
  };

  return (
    <>
      <div className="bg-white rounded-xl shadow-md p-6">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-bold text-muted-900">팀원</h2>
          <Button
            variant="primary"
            size="sm"
            onClick={() => setIsModalOpen(true)}
            className="flex items-center gap-1"
          >
            <Plus size={18} />
            추가
          </Button>
        </div>

        {/* 팀원 목록 */}
        <div className="space-y-3">
          {teamMembers.map((member) => {
            const memberEvents = getEventsByTeamMember(member.id);
            const textColor = getContrastTextColor(member.color);

            return (
              <div
                key={member.id}
                className="flex items-center justify-between p-3 rounded-lg border border-muted-200 hover:shadow-sm transition-shadow"
              >
                {/* 색상 표시 및 이름 */}
                <div className="flex items-center gap-3 flex-1">
                  <div
                    className="w-4 h-4 rounded-full flex-shrink-0"
                    style={{ backgroundColor: member.color }}
                  />
                  <div className="flex-1">
                    <div className="font-semibold text-muted-900">
                      {member.name}
                    </div>
                    <div className="text-xs text-muted-500">
                      {memberEvents.length}개 일정
                    </div>
                  </div>
                </div>

                {/* 삭제 버튼 */}
                <button
                  onClick={() => removeTeamMember(member.id)}
                  className="text-muted-400 hover:text-rose-500 transition-colors flex-shrink-0"
                  title="팀원 삭제"
                >
                  <Trash2 size={18} />
                </button>
              </div>
            );
          })}
        </div>

        {teamMembers.length === 0 && (
          <div className="text-center py-6 text-muted-500">
            팀원을 추가하세요
          </div>
        )}
      </div>

      {/* 팀원 추가 모달 */}
      <Modal
        isOpen={isModalOpen}
        title="새 팀원 추가"
        onClose={() => {
          setIsModalOpen(false);
          setNewMemberName('');
        }}
        footer={
          <>
            <Button
              variant="secondary"
              size="sm"
              onClick={() => {
                setIsModalOpen(false);
                setNewMemberName('');
              }}
            >
              취소
            </Button>
            <Button
              variant="primary"
              size="sm"
              onClick={handleAddMember}
              disabled={!newMemberName.trim()}
            >
              추가
            </Button>
          </>
        }
      >
        <Input
          placeholder="팀원 이름을 입력하세요"
          value={newMemberName}
          onChange={(e) => setNewMemberName(e.target.value)}
          onKeyPress={(e) => e.key === 'Enter' && handleAddMember()}
          autoFocus
        />
      </Modal>
    </>
  );
};

export default TeamPanel;
