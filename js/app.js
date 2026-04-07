// 상수
const TEAM_COLORS = {
    '김팀장': '#FF6B6B',
    '이사원': '#4ECDC4',
    '박사원': '#45B7D1',
    '최사원': '#FFA07A',
    '정사원': '#98D8C8',
    '윤사원': '#F7DC6F'
};

const DEFAULT_TEAMS = ['김팀장', '이사원', '박사원', '최사원', '정사원', '윤사원'];

// 전역 변수
let teamMembers = [];
let schedules = [];
let currentWeekStart = new Date(2026, 3, 6); // 2026년 4월 6일 (월요일)
let currentSchedule = null;

// 초기화
function init() {
    loadFromStorage();
    
    // 기본 팀원 설정
    if (teamMembers.length === 0) {
        teamMembers = DEFAULT_TEAMS.map(name => ({
            id: Date.now() + Math.random(),
            name: name
        }));
        saveToStorage();
    }
    
    // 오늘 날짜 설정
    const today = new Date(2026, 3, 7); // 2026년 4월 7일
    const year = today.getFullYear();
    const month = String(today.getMonth() + 1).padStart(2, '0');
    const day = String(today.getDate()).padStart(2, '0');
    document.getElementById('scheduleDate').value = `${year}-${month}-${day}`;
    
    renderTeamList();
    updateTeamSelect();
    renderCalendar();
}

// 팀원 추가
function addTeamMember() {
    const input = document.getElementById('teamMemberInput');
    const name = input.value.trim();
    
    if (!name) {
        alert('팀원 이름을 입력하세요');
        return;
    }
    
    if (teamMembers.length >= 10) {
        alert('최대 10명까지만 추가 가능합니다');
        return;
    }
    
    teamMembers.push({
        id: Date.now(),
        name: name
    });
    
    saveToStorage();
    input.value = '';
    renderTeamList();
    updateTeamSelect();
}

// 팀원 삭제
function deleteTeamMember(id) {
    if (confirm('정말 삭제하시겠습니까?')) {
        teamMembers = teamMembers.filter(t => t.id !== id);
        schedules = schedules.filter(s => s.teamId !== id);
        saveToStorage();
        renderTeamList();
        updateTeamSelect();
        renderCalendar();
    }
}

// 팀원 목록 렌더링
function renderTeamList() {
    const list = document.getElementById('teamList');
    list.innerHTML = '';
    
    teamMembers.forEach(team => {
        const color = TEAM_COLORS[team.name] || '#999';
        const div = document.createElement('div');
        div.className = 'team-member';
        div.style.borderLeftColor = color;
        
        div.innerHTML = `
            <div style="display: flex; align-items: center; flex: 1;">
                <div class="team-member-color" style="background-color: ${color}"></div>
                <span class="team-member-name">${team.name}</span>
            </div>
            <button class="team-member-delete" onclick="deleteTeamMember(${team.id})">삭제</button>
        `;
        
        list.appendChild(div);
    });
}

// 팀원 선택 업데이트
function updateTeamSelect() {
    const select = document.getElementById('teamSelect');
    select.innerHTML = '<option value="">-- 팀원을 선택하세요 --</option>';
    
    teamMembers.forEach(team => {
        const option = document.createElement('option');
        option.value = team.id;
        option.textContent = team.name;
        select.appendChild(option);
    });
}

// 일정 추가
function addSchedule() {
    const teamId = parseInt(document.getElementById('teamSelect').value);
    const date = document.getElementById('scheduleDate').value;
    const title = document.getElementById('scheduleTitle').value.trim();
    const description = document.getElementById('scheduleDescription').value.trim();
    
    if (!teamId) {
        alert('팀원을 선택하세요');
        return;
    }
    
    if (!date) {
        alert('날짜를 선택하세요');
        return;
    }
    
    if (!title) {
        alert('일정을 입력하세요');
        return;
    }
    
    const team = teamMembers.find(t => t.id === teamId);
    
    schedules.push({
        id: Date.now(),
        teamId: teamId,
        teamName: team.name,
        date: date,
        title: title,
        description: description
    });
    
    saveToStorage();
    
    // 폼 초기화
    document.getElementById('teamSelect').value = '';
    document.getElementById('scheduleTitle').value = '';
    document.getElementById('scheduleDescription').value = '';
    
    const today = new Date(2026, 3, 7);
    const year = today.getFullYear();
    const month = String(today.getMonth() + 1).padStart(2, '0');
    const day = String(today.getDate()).padStart(2, '0');
    document.getElementById('scheduleDate').value = `${year}-${month}-${day}`;
    
    renderCalendar();
}

// 일정 삭제
function deleteCurrentSchedule() {
    if (currentSchedule && confirm('정말 삭제하시겠습니까?')) {
        schedules = schedules.filter(s => s.id !== currentSchedule.id);
        saveToStorage();
        closeModal();
        renderCalendar();
    }
}

// 모달 열기
function showScheduleDetail(id) {
    const schedule = schedules.find(s => s.id === id);
    if (!schedule) return;
    
    currentSchedule = schedule;
    
    document.getElementById('modalTitle').textContent = schedule.title;
    document.getElementById('modalTeam').textContent = schedule.teamName;
    document.getElementById('modalDate').textContent = schedule.date;
    document.getElementById('modalSchedule').textContent = schedule.title;
    document.getElementById('modalDescription').textContent = schedule.description || '없음';
    
    const modal = document.getElementById('scheduleModal');
    modal.style.display = 'block';
}

// 모달 닫기
function closeModal() {
    document.getElementById('scheduleModal').style.display = 'none';
    currentSchedule = null;
}

// 주간 네비게이션
function previousWeek() {
    currentWeekStart = new Date(currentWeekStart.getTime() - 7 * 24 * 60 * 60 * 1000);
    renderCalendar();
}

function nextWeek() {
    currentWeekStart = new Date(currentWeekStart.getTime() + 7 * 24 * 60 * 60 * 1000);
    renderCalendar();
}

function goToToday() {
    currentWeekStart = new Date(2026, 3, 6); // 2026년 4월 6일 (이 주의 월요일)
    renderCalendar();
}

// 캘린더 렌더링
function renderCalendar() {
    const calendar = document.getElementById('calendar');
    calendar.innerHTML = '';
    
    // 주간 시작 (월요일로 설정)
    const weekStart = new Date(currentWeekStart);
    const dayOfWeek = weekStart.getDay();
    const diff = weekStart.getDate() - dayOfWeek + (dayOfWeek === 0 ? -6 : 1);
    weekStart.setDate(diff);
    
    // 주간 제목
    const weekEnd = new Date(weekStart);
    weekEnd.setDate(weekEnd.getDate() + 6);
    const year = weekStart.getFullYear();
    const month = weekStart.getMonth() + 1;
    const weekNum = Math.ceil((weekStart.getDate() + new Date(year, month - 1, 1).getDay()) / 7);
    
    document.getElementById('weekTitle').textContent = `${year}년 ${month}월 ${weekNum}주 (${weekStart.getDate()}~${weekEnd.getDate()}일)`;
    
    // 요일 이름
    const dayNames = ['월', '화', '수', '목', '금', '토', '일'];
    const today = new Date(2026, 3, 7);
    
    // 7일 렌더링
    for (let i = 0; i < 7; i++) {
        const date = new Date(weekStart);
        date.setDate(date.getDate() + i);
        
        const dateStr = date.toISOString().split('T')[0];
        const isToday = dateStr === today.toISOString().split('T')[0];
        
        // 날짜 셀
        const cell = document.createElement('div');
        cell.className = 'day-cell';
        if (isToday) cell.classList.add('today');
        
        // 헤더 (요일, 날짜)
        const header = document.createElement('div');
        header.className = 'day-header';
        header.innerHTML = `
            <span class="day-weekday">${dayNames[i]}</span>
            <span class="day-date">${date.getDate()}</span>
        `;
        cell.appendChild(header);
        
        // 일정들
        const schedulesDiv = document.createElement('div');
        schedulesDiv.className = 'day-schedules';
        
        const daySchedules = schedules.filter(s => s.date === dateStr);
        daySchedules.forEach(schedule => {
            const color = TEAM_COLORS[schedule.teamName] || '#999';
            const item = document.createElement('div');
            item.className = 'schedule-item';
            item.style.backgroundColor = color;
            item.textContent = `${schedule.teamName}: ${schedule.title}`;
            item.onclick = () => showScheduleDetail(schedule.id);
            schedulesDiv.appendChild(item);
        });
        
        cell.appendChild(schedulesDiv);
        calendar.appendChild(cell);
    }
}

// 저장/로드
function saveToStorage() {
    localStorage.setItem('gm-team-members', JSON.stringify(teamMembers));
    localStorage.setItem('gm-schedules', JSON.stringify(schedules));
}

function loadFromStorage() {
    const teams = localStorage.getItem('gm-team-members');
    const scheds = localStorage.getItem('gm-schedules');
    
    if (teams) teamMembers = JSON.parse(teams);
    if (scheds) schedules = JSON.parse(scheds);
}

// 모달 외부 클릭 닫기
window.onclick = function(event) {
    const modal = document.getElementById('scheduleModal');
    if (event.target === modal) {
        closeModal();
    }
};

// 페이지 로드
document.addEventListener('DOMContentLoaded', init);
