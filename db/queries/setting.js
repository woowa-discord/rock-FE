export const SETTING_QUERY = {
  // 채널 등록
  REGISTER_CHANNEL: `INSERT INTO attendance_setting (guild_id, channel_id) VALUES ($1, $2)`,

  CHECK_UNIQUE: `SELECT id FROM attendance_setting WHERE guild_id = $1`,

  UPDATE_CHANNEL: `UPDATE attendance_setting
    SET channel_id = $1 
    WHERE guild_id = $2`,
};
