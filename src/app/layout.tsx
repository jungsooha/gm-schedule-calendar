import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: '총무처 구매관재팀 캘린더',
  description: '팀 일정을 관리하는 실시간 공유 캘린더',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="ko">
      <body>{children}</body>
    </html>
  );
}
