import { ATTENDANCE } from '../../constants/messages.js';
import pool from '../../db/database.js';
import { ATTENDANCE_QUERIES } from '../../db/queries/attendance.js';
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
    await pool.query(ATTENDANCE_QUERIES.REGISTER_USER, [userId, username]); // 유저 등록

    const timeInfo = getTimeInfo(); // 한국 시간 가져오기
    const result = await pool.query(ATTENDANCE_QUERIES.REGISTER_ATTENDANCE, [
      userId,
      timeInfo.today,
      timeInfo.currentTime,
      timeInfo.isMorning,
    ]); // 한국 시간으로 출석 등록

    if (result.rows.length > 0) {
      const message = await processAttendance(
        userId,
        timeInfo.yesterday,
        timeInfo.isMorning
      ); // 통계 업데이트, message 생성
      await interaction.reply(message);
    } else {
      await interaction.reply(ATTENDANCE.ALREADY_CHECKED);
    }
  } catch (error) {
    console.error('출석 오류', error);
    await interaction.reply(ATTENDANCE.ERROR_ATTEND);
  }
}

// 시간 변환
function getTimeInfo() {
  const koreanTime = getKoreanTime();
  return {
    today: formatKSTDate(koreanTime),
    currentTime: formatKSTTime(koreanTime),
    yesterday: getYesterdayKST(),
    isMorning: isMorningTime(),
  };
}

// 통계 업데이트하고, message 생성
async function processAttendance(userId, yesterday, isMorning) {
  await pool.query(ATTENDANCE_QUERIES.UPDATE_STATS, [userId, yesterday]);

  const streakCount = await getStreakDays(userId);
  const morning = isMorning ? ATTENDANCE.MORNING_ATTEND : '';

  return (
    `<@${userId}> 마님, 출석이 완료 됐습니다요! ${morning}\n\n` +
    `연속 출석 ${streakCount}일 째입니다요!`
  );
}

// 연속 출석일 수 가져오기
async function getStreakDays(userId) {
  const stats = await pool.query(ATTENDANCE_QUERIES.GET_STREAKDAYS, [userId]);

  if (stats.rows[0] && stats.rows[0].streak_days) {
    return stats.rows[0].streak_days;
  } else {
    return 1;
  }
  //streak_days가 있으면 반환, 없으면 1
}
