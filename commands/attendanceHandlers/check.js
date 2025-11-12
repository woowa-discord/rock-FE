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
    await pool.query(ATTENDANCE_QUERIES.REGISTER_USER, [userId, username]);

    const koreaTime = getKoreanTime();
    const today = formatKSTDate(koreaTime);
    const currentTime = formatKSTTime(koreaTime);
    const yesterday = getYesterdayKST();
    const isMorning = isMorningTime();

    const result = await pool.query(ATTENDANCE_QUERIES.REGISTER_ATTENDANCE, [
      userId,
      today,
      currentTime,
      isMorning,
    ]); // 출석 데이터 id return 됨

    if (result.rows.length > 0) {
      await pool.query(ATTENDANCE_QUERIES.UPDATE_STATS, [userId, yesterday]); // 통계 업데이트

      const streakCount = await getStreakDays(userId);
      const morning = isMorning ? '아침 출석에 성공했습니다요!🎉' : '';

      await interaction.reply(
        `<@${userId}> 마님, 출석이 완료 됐습니다요! ${morning}\n\n` +
          `연속 출석 ${streakCount}일 째입니다요!`
      );
    } else {
      await interaction.reply(`마님, 오늘 건 이미 찍었슈!`);
    }
  } catch (error) {
    console.error('출석 오류', error);
    await interaction.reply('이런, 뭔가 꼬였는갑네… 출석이 안 됐습니다요!');
  }
}

async function getStreakDays(userId) {
  const stats = await pool.query(ATTENDANCE_QUERIES.GET_STREAKDAYS, [userId]);

  if (stats.rows[0] && stats.rows[0].streak_days) {
    return stats.rows[0].streak_days;
  } else {
    return 1;
  }
  //streak_days가 있으면 반환, 없으면 1
}
