# 총무처 구매관재팀 캘린더

URL 기반 공유 캘린더 - 실시간 일정 관리 시스템

## 🎯 프로젝트 개요

- **목표**: URL만 있으면 별도의 로그인 없이 누구나 접속해서 일정을 조회, 등록, 수정, 삭제할 수 있는 공유 캘린더
- **실시간 동기화**: 한 사용자가 편집하면 다른 접속자들의 화면에도 실시간으로 반영

## 🛠️ 기술 스택

- **Frontend**: Next.js 14 (App Router) + TypeScript
- **Styling**: Tailwind CSS (Muted/Pastel Tone)
- **Icons**: Lucide React
- **State Management**: Zustand
- **Backend/DB**: Firebase (Firestore + Realtime Database)

## 📁 프로젝트 구조

```
src/
├── app/                    # Next.js App Router
├── components/             # React 컴포넌트
├── store/                  # Zustand 상태 관리
├── types/                  # TypeScript 타입 정의
├── utils/                  # 유틸리티 함수
└── services/               # Firebase 함수
```

## 🚀 시작하기

### 1. 환경 변수 설정

`.env.local` 파일을 생성하고 Firebase 설정값을 입력하세요:

```bash
NEXT_PUBLIC_FIREBASE_API_KEY=your_api_key
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your_auth_domain
NEXT_PUBLIC_FIREBASE_PROJECT_ID=your_project_id
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your_storage_bucket
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your_messaging_sender_id
NEXT_PUBLIC_FIREBASE_APP_ID=your_app_id
NEXT_PUBLIC_FIREBASE_DATABASE_URL=your_database_url
```

### 2. 의존성 설치

```bash
npm install
```

### 3. 개발 서버 실행

```bash
npm run dev
```

브라우저에서 [http://localhost:3000](http://localhost:3000) 접속

## 📋 구현 일정

- [x] 1단계: 프로젝트 초기 세팅 및 기술 스택 확정
- [ ] 2단계: 메인 UI 레이아웃 및 2주 단위 캘린더 뷰
- [ ] 3단계: 팀원 관리 기능 및 일정 CRUD
- [ ] 4단계: Firebase 실시간 동기화 완성

## 📝 주요 기능

### 1. 팀원 관리
- 새로운 팀원 추가/삭제
- 자동 색상 및 아이콘 할당

### 2. 개인별 일정 관리 (CRUD)
- 일정 추가/수정/삭제
- 팀원별로 구분되는 색상 지정

### 3. 캘린더 뷰 (2주 단위)
- 2주 간의 일정을 한눈에 표시
- 네비게이션 기능
- 오늘 날짜 하이라이트

### 4. 디자인 가이드
- Muted/Pastel Tone 색상 사용
- 직관적이고 모던한 UI/UX

## 🎨 색상 팔레트

- **Sage Green**: 채도 낮은 녹색
- **Dusty Rose**: 부드러운 분홍색
- **Slate Blue**: 차분한 파랑
- **Warm Gray**: 따뜻한 회색
- **Soft Amber, Cyan, Purple, Pink**: 추가 색상

---

**상태**: 개발 중 (1단계 완료)
