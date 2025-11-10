import { SlashCommandBuilder } from 'discord.js';
import pool from '../db/database.js';
import { attendanceQueries } from '../db/queries/attendance.js';

export default {
  data: new SlashCommandBuilder()
    .setName('출석')
    .setDescription('오늘의 출석을 체크합니다'),

  async execute(interaction) {
    const userId = interaction.user.id;
    const username = interaction.user.username;

    try {
      // 사용자 등록
      await pool.query(attendanceQueries.registerUser, [userId, username]);

      // 출석 체크
      const now = new Date();
      const koreaTime = new Date(now.getTime() + 9 * 60 * 60 * 1000);
      const todayKST = koreaTime.toISOString().split('T')[0];

      // 9시 이전 출석시 아침 출석으로 인정
      const isMorning = koreaTime.getHours() >= 6 || koreaTime.getHours() < 9;

      const result = await pool.query(attendanceQueries.registerAttendance, [
        userId,
        todayKST,
        isMorning,
      ]);

      // 통계 업데이트
      if (result.rows.length > 0) {
        // 새 기록인 경우
        await pool.query(attendanceQueries.updateStats, [userId]);

        // 연속 출석일 수 조회
        const stats = await pool.query(attendanceQueries.getStreakDays, [
          userId,
        ]);
        const streakCount = stats.rows[0]?.streak_days || 1;

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
  },
};
