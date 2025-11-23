//개인 통계 카드

import { StatCard } from './StatCard.jsx';
import { useRef, useEffect } from 'react';
import { getWeeklyAttendance } from '../database/attendance.js';
export function AttendanceCard({userId, selectedGuild}) {
  
  const hasFetchedData = useRef(false);
      useEffect(()=>{
        if (!userId || !selectedGuild) return;
          hasFetchedData.current = false
          const weeklyStudyTime = async() => {
              const studyTimeData = await getWeeklyAttendance(hasFetchedData, userId, selectedGuild);
              if(studyTimeData) console.log('Attendance Data : ', studyTimeData);
          }
      
      weeklyStudyTime();
      }, [selectedGuild])

  return (
    <StatCard title="개인 통계">
      <p>총 출석일: {}일</p>
      <p>연속 출석일: {}일</p>
      <p>오늘 총 공부시간: {}시간</p>
    </StatCard>
  );
}

