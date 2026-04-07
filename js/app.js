// 상수
const TEAM_COLORS = {
    '김윤수': '#FF6B6B',
    '최민재': '#4ECDC4',
    '하정수': '#45B7D1',
    '이승연': '#FFA07A',
    '설희진': '#98D8C8',
    '김미선': '#F7DC6F',
    '추가1': '#B19CD9',
    '추가2': '#FFB347'
};

const DEFAULT_TEAMS = ['김윤수', '최민재', '하정수', '이승연', '설희진', '김미선'];

// 전역 변수
let teamMembers = [];
let schedules = [];
let lunchUnavailable = {}; // {teamId: {YYYY-MM-DD: true}}
let currentWeekStart = new Date(2026, 3, 6); // 2026년 4월 6일 (월요일)
let currentSchedule = null;

// 날짜를 YYYY-MM-DD 형식으로 변환 (타임존 무시)
function formatDateString(date) {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
}

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
    
    // 오늘 날짜 설정 (2026년 4월 7일)
    const today = new Date(2026, 3, 7);
    document.getElementById('scheduleDate').value = formatDateString(today);
    
    renderTeamList();
    updateTeamSelect();
    renderCalendar();
    renderLunchCheckboxes();
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
    renderLunchCheckboxes();
}

// 팀원 삭제
function deleteTeamMember(id) {
    if (confirm('정말 삭제하시겠습니까?')) {
        teamMembers = teamMembers.filter(t => t.id !== id);
        schedules = schedules.filter(s => s.teamId !== id);
        delete lunchUnavailable[id];
        saveToStorage();
        renderTeamList();
        updateTeamSelect();
        renderCalendar();
        renderLunchCheckboxes();
    }
}

// 팀원 목록 렌더링
function renderTeamList() {
    const list = document.getElementById('teamList');
    list.innerHTML = '';
    
    teamMembers.forEach(team => {
        const color = TEAM_COLORS[team.name] || '#999999';
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

// 점심 약속 체크박스 렌더링
function renderLunchCheckboxes() {
    const container = document.getElementById('lunchCheckboxes');
    if (!container) return;
    
    container.innerHTML = '';
    
    const today = new Date(2026, 3, 7);
    const todayStr = formatDateString(today);
    
    teamMembers.forEach(team => {
        const color = TEAM_COLORS[team.name] || '#999999';
        const isUnavailable = lunchUnavailable[team.id]?.[todayStr] || false;
        
        const div = document.createElement('div');
        div.style.display = 'flex';
        div.style.alignItems = 'center';
        div.style.gap = '8px';
        div.style.marginBottom = '10px';
        div.style.padding = '10px';
        div.style.backgroundColor = '#f9f9f9';
        div.style.borderRadius = '6px';
        div.style.borderLeft = `4px solid ${color}`;
        
        const checkbox = document.createElement('input');
        checkbox.type = 'checkbox';
        checkbox.id = `lunch-${team.id}`;
        checkbox.checked = isUnavailable;
        checkbox.style.cursor = 'pointer';
        checkbox.style.width = '18px';
        checkbox.style.height = '18px';
        
        checkbox.addEventListener('change', (e) => {
            toggleLunchUnavailable(team.id, todayStr, e.target.checked);
        });
        
        const label = document.createElement('label');
        label.htmlFor = `lunch-${team.id}`;
        label.textContent = `${team.name} - 점심 불가`;
        label.style.cursor = 'pointer';
        label.style.margin = '0';
        label.style.fontWeight = '500';
        label.style.flex = '1';
        
        div.appendChild(checkbox);
        div.appendChild(label);
        container.appendChild(div);
    });
}

// 점심 불가 토글
function toggleLunchUnavailable(teamId, date, unavailable) {
    if (!lunchUnavailable[teamId]) {
        lunchUnavailable[teamId] = {};
    }
    
    if (unavailable) {
        lunchUnavailable[teamId][date] = true;
    } else {
        delete lunchUnavailable[teamId][date];
    }
    
    saveToStorage();
    renderCalendar();
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
    document.getElementById('scheduleDate').value = formatDateString(today);
    
    alert('일정이 추가되었습니다!');
    renderCalendar();
}

// 일정 삭제
function deleteCurrentSchedule() {
    if (currentSchedule && confirm('정말 삭제하시겠습니까?')) {
        schedules = schedules.filter(s => s.id !== currentSchedule.id);
        saveToStorage();
        closeModal();
        renderCalendar();
        alert('일정이 삭제되었습니다!');
    }
}

// 모달 열기
function showScheduleDetail(id) {
    const schedule = schedules.find(s => s.id === id);
    if (!schedule) return;
    
    currentSchedule = schedule;
    
    document.getElementById('modalTitle').textContent = `[${schedule.teamName}] ${schedule.title}`;
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
    renderLunchCheckboxes();
}

function nextWeek() {
    currentWeekStart = new Date(currentWeekStart.getTime() + 7 * 24 * 60 * 60 * 1000);
    renderCalendar();
    renderLunchCheckboxes();
}

function goToToday() {
    currentWeekStart = new Date(2026, 3, 6); // 2026년 4월 6일 (이 주의 월요일)
    renderCalendar();
    renderLunchCheckboxes();
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
    const year = weekStart.getFullYear();
    const month = weekStart.getMonth() + 1;
    const weekNum = Math.ceil((weekStart.getDate() + new Date(year, month - 1, 1).getDay()) / 7);
    
    document.getElementById('weekTitle').textContent = `${year}년 ${month}월 ${weekNum}주`;
    
    // 요일 이름
    const dayNames = ['월', '화', '수', '목', '금', '토', '일'];
    const today = new Date(2026, 3, 7);
    const todayStr = formatDateString(today);
    
    // 7일 렌더링
    for (let i = 0; i < 7; i++) {
        const date = new Date(weekStart);
        date.setDate(date.getDate() + i);
        
        const dateStr = formatDateString(date);
        const isToday = dateStr === todayStr;
        
        // 날짜 셀
        const cell = document.createElement('div');
        cell.className = 'calendar-day';
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
        const daySchedules = schedules.filter(s => s.date === dateStr);
        daySchedules.forEach(schedule => {
            const color = TEAM_COLORS[schedule.teamName] || '#999999';
            const item = document.createElement('div');
            item.className = 'schedule-item';
            item.style.backgroundColor = color;
            item.style.color = 'white';
            item.innerHTML = `
                <div style="font-weight: bold; font-size: 0.85em; margin-bottom: 3px; text-shadow: 0 1px 2px rgba(0,0,0,0.2);">${schedule.teamName}</div>
                <div style="font-size: 0.9em; text-shadow: 0 1px 2px rgba(0,0,0,0.2);">${schedule.title}</div>
            `;
            item.onclick = () => showScheduleDetail(schedule.id);
            cell.appendChild(item);
        });
        
        // 점심 불가 표시
        const unavailableLunches = [];
        teamMembers.forEach(team => {
            if (lunchUnavailable[team.id]?.[dateStr]) {
                unavailableLunches.push(team.name);
            }
        });
        
        if (unavailableLunches.length > 0) {
            const lunchItem = document.createElement('div');
            lunchItem.style.padding = '8px 10px';
            lunchItem.style.backgroundColor = '#FFE4E1';
            lunchItem.style.borderRadius = '6px';
            lunchItem.style.fontSize = '0.8em';
            lunchItem.style.color = '#C41E3A';
            lunchItem.style.fontWeight = '600';
            lunchItem.style.marginTop = '4px';
            lunchItem.style.textShadow = '0 1px 2px rgba(255,255,255,0.3)';
            lunchItem.innerHTML = `🍽️ 점심불가: ${unavailableLunches.join(', ')}`;
            cell.appendChild(lunchItem);
        }
        
        calendar.appendChild(cell);
    }
}

// 저장/로드
function saveToStorage() {
    localStorage.setItem('gm-team-members', JSON.stringify(teamMembers));
    localStorage.setItem('gm-schedules', JSON.stringify(schedules));
    localStorage.setItem('gm-lunch-unavailable', JSON.stringify(lunchUnavailable));
}

function loadFromStorage() {
    const teams = localStorage.getItem('gm-team-members');
    const scheds = localStorage.getItem('gm-schedules');
    const lunch = localStorage.getItem('gm-lunch-unavailable');
    
    if (teams) teamMembers = JSON.parse(teams);
    if (scheds) schedules = JSON.parse(scheds);
    if (lunch) lunchUnavailable = JSON.parse(lunch);
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
