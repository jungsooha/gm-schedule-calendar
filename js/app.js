// 색상 팔레트
const COLORS = ['#667eea', '#dc3545', '#28a745', '#ffc107', '#9b59b6', '#17a2b8'];

// 전역 변수
let teamMembers = [];
let schedules = [];
let currentWeekStart = new Date(2026, 3, 6); // 2026년 4월 6일 월요일
let currentModalSchedule = null;

// 초기화
function init() {
    loadDataFromStorage();
    if (teamMembers.length === 0) {
        // 기본 팀원 6명 추가
        const defaultMembers = ['김팀장', '이사원', '박사원', '최사원', '정사원', '윤사원'];
        defaultMembers.forEach(name => {
            teamMembers.push({
                id: Date.now() + Math.random(),
                name: name,
                color: COLORS[teamMembers.length]
            });
        });
        saveDataToStorage();
    }
    updateTeamList();
    updateTeamSelect();
    setTodayDate();
    renderCalendar();
}

// 팀원 추가
function addTeamMember() {
    const input = document.getElementById('teamMemberInput');
    const name = input.value.trim();

    if (!name) {
        alert('팀원 이름을 입력해주세요.');
        return;
    }

    if (teamMembers.length >= 6) {
        alert('최대 6명까지만 추가할 수 있습니다.');
        return;
    }

    const newMember = {
        id: Date.now(),
        name: name,
        color: COLORS[teamMembers.length % COLORS.length]
    };

    teamMembers.push(newMember);
    saveDataToStorage();
    input.value = '';
    updateTeamList();
    updateTeamSelect();
}

// 팀원 삭제
function deleteTeamMember(id) {
    if (confirm('정말 이 팀원을 삭제하시겠습니까?')) {
        teamMembers = teamMembers.filter(m => m.id !== id);
        schedules = schedules.filter(s => s.teamMemberId !== id);
        saveDataToStorage();
        updateTeamList();
        updateTeamSelect();
        renderCalendar();
    }
}

// 팀원 목록 업데이트
function updateTeamList() {
    const teamList = document.getElementById('teamList');
    teamList.innerHTML = '';

    teamMembers.forEach(member => {
        const div = document.createElement('div');
        div.className = 'team-member';
        div.innerHTML = `
            <div style="display: flex; align-items: center; flex: 1;">
                <div class="team-member-color" style="background-color: ${member.color}"></div>
                <span class="team-member-name">${member.name}</span>
            </div>
            <button class="team-member-delete" onclick="deleteTeamMember(${member.id})">삭제</button>
        `;
        teamList.appendChild(div);
    });
}

// 팀원 선택 드롭다운 업데이트
function updateTeamSelect() {
    const select = document.getElementById('teamSelect');
    select.innerHTML = '<option value="">-- 팀원을 선택하세요 --</option>';

    teamMembers.forEach(member => {
        const option = document.createElement('option');
        option.value = member.id;
        option.textContent = member.name;
        select.appendChild(option);
    });
}

// 오늘 날짜 설정
function setTodayDate() {
    const today = new Date(2026, 3, 7); // 2026년 4월 7일
    const year = today.getFullYear();
    const month = String(today.getMonth() + 1).padStart(2, '0');
    const date = String(today.getDate()).padStart(2, '0');
    document.getElementById('scheduleDate').value = `${year}-${month}-${date}`;
}

// 일정 추가
function addSchedule() {
    const teamMemberId = document.getElementById('teamSelect').value;
    const scheduleDate = document.getElementById('scheduleDate').value;
    const scheduleTitle = document.getElementById('scheduleTitle').value.trim();
    const scheduleDescription = document.getElementById('scheduleDescription').value.trim();

    if (!teamMemberId) {
        alert('팀원을 선택해주세요.');
        return;
    }

    if (!scheduleDate) {
        alert('날짜를 선택해주세요.');
        return;
    }

    if (!scheduleTitle) {
        alert('일정을 입력해주세요.');
        return;
    }

    const newSchedule = {
        id: Date.now(),
        teamMemberId: parseInt(teamMemberId),
        date: scheduleDate,
        title: scheduleTitle,
        description: scheduleDescription
    };

    schedules.push(newSchedule);
    saveDataToStorage();

    // 폼 초기화
    document.getElementById('teamSelect').value = '';
    document.getElementById('scheduleTitle').value = '';
    document.getElementById('scheduleDescription').value = '';
    setTodayDate();

    alert('일정이 추가되었습니다.');
    renderCalendar();
}

// 일정 삭제
function deleteSchedule(id) {
    schedules = schedules.filter(s => s.id !== id);
    saveDataToStorage();
    closeModal();
    renderCalendar();
}

// 현재 모달의 일정 삭제
function deleteCurrentSchedule() {
    if (currentModalSchedule) {
        if (confirm('이 일정을 삭제하시겠습니까?')) {
            deleteSchedule(currentModalSchedule.id);
        }
    }
}

// 모달 열기
function openModal(schedule) {
    const member = teamMembers.find(m => m.id === schedule.teamMemberId);
    currentModalSchedule = schedule;

    document.getElementById('modalTitle').textContent = `[${member.name}] ${schedule.title}`;
    document.getElementById('modalTeam').textContent = member.name;
    document.getElementById('modalDate').textContent = formatDate(schedule.date);
    document.getElementById('modalSchedule').textContent = schedule.title;
    document.getElementById('modalDescription').textContent = schedule.description || '없음';

    document.getElementById('scheduleModal').style.display = 'block';
}

// 모달 닫기
function closeModal() {
    document.getElementById('scheduleModal').style.display = 'none';
    currentModalSchedule = null;
}

// 날짜 포맷팅
function formatDate(dateString) {
    const date = new Date(dateString);
    const year = date.getFullYear();
    const month = date.getMonth() + 1;
    const day = date.getDate();
    const weekday = ['일', '월', '화', '수', '목', '금', '토'][date.getDay()];
    return `${year}년 ${month}월 ${day}일 (${weekday})`;
}

// 주간 시작 날짜 계산
function getWeekStart(date) {
    const d = new Date(date);
    const day = d.getDay();
    const diff = d.getDate() - day;
    return new Date(d.setDate(diff));
}

// 이전주
function previousWeek() {
    currentWeekStart = new Date(currentWeekStart.getTime() - 7 * 24 * 60 * 60 * 1000);
    renderCalendar();
}

// 다음주
function nextWeek() {
    currentWeekStart = new Date(currentWeekStart.getTime() + 7 * 24 * 60 * 60 * 1000);
    renderCalendar();
}

// 오늘로 이동
function goToToday() {
    const today = new Date(2026, 3, 7); // 2026년 4월 7일
    currentWeekStart = getWeekStart(today);
    renderCalendar();
}

// 캘린더 렌더링
function renderCalendar() {
    const calendar = document.getElementById('calendar');
    calendar.innerHTML = '';

    // 주간 제목 업데이트
    const weekEnd = new Date(currentWeekStart.getTime() + 6 * 24 * 60 * 60 * 1000);
    const monthStart = currentWeekStart.getMonth() + 1;
    const monthEnd = weekEnd.getMonth() + 1;
    const yearStart = currentWeekStart.getFullYear();
    const weekNum = Math.ceil((currentWeekStart.getDate() + new Date(yearStart, monthStart - 1, 1).getDay()) / 7);
    
    if (monthStart === monthEnd) {
        document.getElementById('weekTitle').textContent = `${yearStart}년 ${monthStart}월 ${weekNum}주`;
    } else {
        document.getElementById('weekTitle').textContent = `${yearStart}년 ${monthStart}월-${monthEnd}월`;
    }

    // 7일 렌더링 (월~일)
    for (let i = 0; i < 7; i++) {
        const date = new Date(currentWeekStart.getTime() + i * 24 * 60 * 60 * 1000);
        const dateString = date.toISOString().split('T')[0];
        
        const dayDiv = document.createElement('div');
        dayDiv.className = 'calendar-day';

        // 오늘인지 확인
        const today = new Date(2026, 3, 7);
        const isToday = dateString === today.toISOString().split('T')[0];
        if (isToday) {
            dayDiv.classList.add('today');
        }

        // 요일 헤더
        const weekdays = ['일', '월', '화', '수', '목', '금', '토'];
        const dayHeader = document.createElement('div');
        dayHeader.className = 'day-header';
        dayHeader.innerHTML = `<div class="day-weekday">${weekdays[date.getDay()]}</div><div class="day-date">${date.getDate()}</div>`;
        dayDiv.appendChild(dayHeader);

        // 이 날짜의 일정들
        const daySchedules = schedules.filter(s => s.date === dateString);
        daySchedules.forEach(schedule => {
            const member = teamMembers.find(m => m.id === schedule.teamMemberId);
            const scheduleDiv = document.createElement('div');
            scheduleDiv.className = `schedule-item color-${COLORS.indexOf(member.color)}`;
            scheduleDiv.style.borderLeftColor = member.color;
            scheduleDiv.textContent = `${member.name}: ${schedule.title}`;
            scheduleDiv.onclick = () => openModal(schedule);
            dayDiv.appendChild(scheduleDiv);
        });

        calendar.appendChild(dayDiv);
    }
}

// 로컬 스토리지 저장
function saveDataToStorage() {
    localStorage.setItem('gm-team-members', JSON.stringify(teamMembers));
    localStorage.setItem('gm-schedules', JSON.stringify(schedules));
}

// 로컬 스토리지 로드
function loadDataFromStorage() {
    const savedMembers = localStorage.getItem('gm-team-members');
    const savedSchedules = localStorage.getItem('gm-schedules');

    if (savedMembers) {
        teamMembers = JSON.parse(savedMembers);
    }

    if (savedSchedules) {
        schedules = JSON.parse(savedSchedules);
    }
}

// 모달 외부 클릭시 닫기
window.onclick = function(event) {
    const modal = document.getElementById('scheduleModal');
    if (event.target === modal) {
        closeModal();
    }
};

// Enter 키로 팀원 추가
document.addEventListener('DOMContentLoaded', function() {
    document.getElementById('teamMemberInput').addEventListener('keypress', function(e) {
        if (e.key === 'Enter') {
            addTeamMember();
        }
    });

    document.getElementById('scheduleTitle').addEventListener('keypress', function(e) {
        if (e.key === 'Enter') {
            addSchedule();
        }
    });

    init();
});
