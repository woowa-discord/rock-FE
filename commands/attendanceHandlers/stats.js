// commands/attendanceHandlers/stats.js
import { ATTENDANCE } from '../../constants/messages.js';
import { getStats } from './attendanceData.js';

export async function getAttendanceStats(interaction) {
  try {
    const stats = await getStats(interaction.user.id);

    if (!stats) {
      return interaction.reply(ATTENDANCE.NO_RECORD);
    }

    const message =
      `## 출석 통계\n` +
      `총 출석 : ${stats.total_attendance}회 \n` +
      `현재 연속 ${stats.streak_days}회 출석\n` +
      `최대 연속 ${stats.max_streak}일 출석`;

    return interaction.reply(message);
  } catch (error) {
    console.error('출석통계 오류', error);
    return interaction.reply(ATTENDANCE.ERROR_ATTENDSTATS);
  }
}
