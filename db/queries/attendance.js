// 출석처리 쿼리

export const attendanceQueries = {
  // 사용자 등록
  registerUser: `INSERT INTO users (user_id, username)
  VALUES ($1, $2)
  ON CONFLICT (user_id) DO UPDATE SET username = $2`,

  // 출석 등록
  registerAttendance: `INSERT INTO attendance (user_id, attendance_date, attendance_time, is_morning)
  VALUES ($1, $2, CURRENT_TIME, $3)
  ON CONFLICT (user_id, attendance_date) DO NOTHING
  RETURNING attendance_id`,

  // 통계 업데이트
  updateStats: `INSERT INTO states (user_id, total_attendance)
  VALUES ($1, 1)
  ON CONFLICT (user_id) DO UPDATE 
  SET total_attendance = states.total_attendance + 1,
  updated_at = NOW()`,

  // 연속 출석일 수 구하기
  getStreakDays: `SELECT streak_days FROM states WHERE user_id=$1`,
};
