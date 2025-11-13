import { processAttendance } from './attendanceService.js';
import { ATTENDANCE } from '../../constants/messages.js';

export async function checkAttendance(interaction) {
  const userId = interaction.user.id;
  const username = interaction.user.username;

  try {
    const result = await processAttendance(userId, username);

    if (result.alreadyChecked) {
      await interaction.reply(ATTENDANCE.ALREADY_CHECKED);
      return;
    }

    const morning = result.isMorning ? ATTENDANCE.MORNING_ATTEND : '';
    const message =
      `<@${userId}> 마님, 출석이 완료 됐습니다요! ${morning}\n\n` +
      `연속 출석 ${result.streakDays}일 째입니다요!`;

    await interaction.reply(message);
  } catch (error) {
    console.error('출석 오류', error);
    await interaction.reply(ATTENDANCE.ERROR_ATTEND);
  }
}
