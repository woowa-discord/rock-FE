import { useEffect, useRef } from 'react';
import AttendanceCalendar from './AttendanceCalendar.jsx';
import { AttendanceCard } from './AttendanceCard.jsx';
import { RankingCard } from './RankingCard.jsx';
import { getWeeklyStudyTime } from '../database/studyTime.js';

export default function DashboardContent({ userId, selectedGuild}){
    // mock 데이터
    const rankingData = [
        { username: '여빈', hours: 45 },
        { username: '희주', hours: 38 },
        { username: '돌쇠', hours: 32 },
        { username: '이슬', hours: 30 },
    ];

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
        <>
            <AttendanceCalendar guildId={selectedGuild.id} userId={userId} />
            <div className="flex justify-center gap-12 flex-wrap text-black mt-6">
                <AttendanceCard userId = { userId } selectedGuild = { selectedGuild } />
                <RankingCard ranking={rankingData} />
            </div>
        </>
    );
}