import { useState } from 'react';
import CalendarView from './components/CalendarView';
import './components/calendar.css';
import { Button } from './components/Button';
import GuildDropdown from './components/GuildDropdown';
import Header from './components/Header';

export function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [attendanceDates, setAttendanceDates] = useState([
    '2025-11-17',
    '2025-11-19',
  ]);

  return (
    <>
      <Header
        isLoggedIn={isLoggedIn}
        onLogin={() => setIsLoggedIn(true)}
        onLogout={() => setIsLoggedIn(false)}
      />

      {/* 메인 콘텐츠 - Header 높이만큼 padding 추가 */}
      <main>
        <h1 className="text-2xl mb-4">출석 캘린더</h1>
        <div className="space-y-4">
          <CalendarView attendanceDates={attendanceDates} />
          <GuildDropdown />
        </div>
      </main>
    </>
  );
}

export default App;
