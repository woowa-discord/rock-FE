// commands/attendanceHandlers/check.js
import { ATTENDANCE } from '../../constants/messages.js';
import {
  registerUser,
  registerAttendance,
  updateAttendanceStats,
} from './attendanceData.js';
import {
  getKoreanTime,
  formatKSTDate,
  formatKSTTime,
  getYesterdayKST,
  isMorningTime,
} from '../../utils/time.js';

export async function checkAttendance(interaction) {
  const userId = interaction.user.id;
  const username = interaction.user.username;

  try {
    // 유저 등록
    await registerUser(userId, username);

    // 시간 정보 가져오기
    const timeInfo = getTimeInfo();

    // 출석 등록
    const isNewAttendance = await registerAttendance(
      userId,
      timeInfo.today,
      timeInfo.currentTime,
      timeInfo.isMorning
    );

    // 통계 업데이트
    if (isNewAttendance) {
      const streakDays = await updateAttendanceStats(
        userId,
        timeInfo.yesterday
      );

      // 메시지 생성 및 응답
      const morning = timeInfo.isMorning ? ATTENDANCE.MORNING_ATTEND : '';
      const message =
        `<@${userId}> 마님, 출석이 완료 됐습니다요! ${morning}\n\n` +
        `연속 출석 ${streakDays}일 째입니다요!`;

      await interaction.reply(message);
    } else {
      await interaction.reply(ATTENDANCE.ALREADY_CHECKED);
    }
  } catch (error) {
    console.error('출석 오류', error);
    await interaction.reply(ATTENDANCE.ERROR_ATTEND);
  }
}

function getTimeInfo() {
  const koreanTime = getKoreanTime();
  return {
    today: formatKSTDate(koreanTime),
    currentTime: formatKSTTime(koreanTime),
    yesterday: getYesterdayKST(),
    isMorning: isMorningTime(),
  };
}
