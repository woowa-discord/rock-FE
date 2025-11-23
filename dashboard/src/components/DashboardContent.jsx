import AttendanceCalendar from './AttendanceCalendar.jsx';
import { AttendanceCard } from './AttendanceCard.jsx';
import { StudyTimeCard } from './StudyTimeCard.jsx';

export default function DashboardContent({ userId, selectedGuild}){ 
    return (
        <>
            <AttendanceCalendar guildId={selectedGuild.id} userId={userId} />
            <div className="flex justify-center gap-12 flex-wrap text-black mt-6">
                <AttendanceCard userId = { userId } selectedGuild = { selectedGuild } />
                <StudyTimeCard userId = { userId } selectedGuild = { selectedGuild } />
            </div>
        </>
    );
}