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

export async function processAttendance(userId, username) {
  // 유저 등록
  await registerUser(userId, username);

  // 시간 정보
  const koreanTime = getKoreanTime();
  const today = formatKSTDate(koreanTime);
  const currentTime = formatKSTTime(koreanTime);
  const yesterday = getYesterdayKST();
  const isMorning = isMorningTime();

  // 출석 등록
  const isNewAttendance = await registerAttendance(
    userId,
    today,
    currentTime,
    isMorning
  );

  if (!isNewAttendance) {
    return { success: false, alreadyChecked: true };
  }

  // 통계 업데이트
  const streakDays = await updateAttendanceStats(userId, yesterday);

  return {
    success: true,
    streakDays,
    isMorning,
  };
}
