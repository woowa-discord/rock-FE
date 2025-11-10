import { SlashCommandBuilder } from 'discord.js';
import pool from '../db/database.js';
import { attendanceQueries } from '../db/queries/attendance.js';

export default {
  data: new SlashCommandBuilder()
    .setName('출석통계')
    .setDescription('출석 현황을 확인합니다.'),

  async execute(interaction) {
    try {
      const result = await pool.query(attendanceQueries.attendanceState, [interaction.user.id])

      if(result.rows.length === 0) {
        return interaction.reply('출석 기록이 없습니다요!')
      }

      const state = result.rows[0];

      
    }
  },
};
