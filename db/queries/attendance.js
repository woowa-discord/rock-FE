// 출석처리 쿼리

export const ATTENDANCE_QUERIES = {
  // 사용자 등록
  REGISTER_USER: `INSERT INTO users (user_id, username)
  VALUES ($1, $2)
  ON CONFLICT (user_id) DO NOTHING -- 기존 유저면 아무것도 안해도 됨`,

  // 출석 등록
  REGISTER_ATTENDANCE: `INSERT INTO attendance (user_id, attendance_date, attendance_time, is_morning)
  VALUES ($1, $2, $3, $4) -- 변수로 4개 다 전달 
  ON CONFLICT (user_id, attendance_date) DO NOTHING -- 기존에 출석했으면 아무것도 안해도 됨
  RETURNING attendance_id`,

  // 통계 업데이트
  UPDATE_STATS: `
  WITH yesterday_attendance AS (
    SELECT EXISTS ( -- 결과가 존재하면 TRUE, 없으면 FALSE
      SELECT 1 FROM attendance -- attendance 테이블에 레코드가 있는가
      WHERE user_id = $1 
      AND attendance_date = $2
      -- 유저 아이디와 출석 날짜 변수로 제공
    ) AS attended_yesterday -- {attended_yesterday: true(or false)} 형식으로
  ),
  new_streak AS (
    SELECT 
      CASE  
        WHEN (SELECT attended_yesterday FROM yesterday_attendance) -- 위에서 가져온 attended_yesterday의 불리언 값 확인
        THEN COALESCE((SELECT streak_days FROM states WHERE user_id = $1), 0) + 1 -- 유저 아이디 변수로 제공
        -- 어제 출석했으면 연속 출석일 수(streak_days)에 +1
        ELSE 1 -- 안했으면 1
      END AS streak_value -- 결과를 streak_value로
  )

  INSERT INTO states (user_id, total_attendance, streak_days, max_streak)
  -- states 테이블에 새 데이터 추가

  VALUES ($1, 1, (SELECT streak_value FROM new_streak), (SELECT streak_value FROM new_streak))
  ON CONFLICT (user_id) DO UPDATE -- 이 유저의 정보가 없으면 위의 내용 삽입, 있으면 업데이트  
  SET -- 유저의 정보가 있을 때(기존 유저일 때)
    total_attendance = states.total_attendance + 1, -- 총 출석일 +1
    streak_days = (SELECT streak_value FROM new_streak), -- 연속 출석일 위에서 계산한 streak_value로
    max_streak = GREATEST(states.max_streak, (SELECT streak_value FROM new_streak)), -- 현재 연속 vs 기존 최대 연속 중 큰 수
    updated_at = NOW()
`,

  GET_STREAKDAYS: `SELECT streak_days FROM states WHERE user_id=$1`,

  // 이번달 통계
  ATTENDANCE_STATS: `SELECT user_id, total_attendance, streak_days, max_streak
  FROM states
  WHERE user_id = $1`,
};
