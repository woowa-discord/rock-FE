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
      const today = new Date();
      const isMorning = today.getHours() < 9;

      const result = await pool.query(attendanceQueries.registerAttendance, [
        userId,
        isMorning,
      ]);

      if (result.rows.length > 0) {
        // 통계 업데이트
        await pool.query(attendanceQueries.updateStats, [userId]);

        await interaction.reply(`출석 완료!`);
      } else {
        await interaction.reply(`오늘은 이미 출석하셨습니다.`);
      }
    } catch (error) {
      console.error('출석 오류', error);
      await interaction.reply('출석 처리 중 오류가 발생했습니다.');
    }
  },
};
