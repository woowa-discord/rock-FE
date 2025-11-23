// 공부시간 순위 카드

import { StatCard } from './StatCard.jsx';
import { useEffect, useRef } from 'react';
import { getWeeklyStudyTime } from '../database/studyTime.js';


export function StudyTimeCard({userId, selectedGuild}) {
  const hasFetchedData = useRef(false);
    useEffect(()=>{
        hasFetchedData.current = false
        const weeklyStudyTime = async() => {
            const studyTimeData = await getWeeklyStudyTime(hasFetchedData, userId, selectedGuild);
            if(studyTimeData) console.log('weekly studyTimeData : ', studyTimeData);
        }
    
    weeklyStudyTime();
    }, [selectedGuild])

  return (
    <StatCard title="공부시간 순위">
      <ul>
        
      </ul>
    </StatCard>
  );
}
