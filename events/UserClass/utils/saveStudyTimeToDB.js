import pool from "../../../db/database.js";
import { STUDY_TIME_QUERIES } from "../../../db/queries/studyTime.js";
import { SaveStudyTimeToDBFailError } from "../../../error/Errors.js";

export const saveStudyTimeToDB = async (
  newState,
  user_id,
  study_date,
  start_time,
  end_time,
  total_study_time
) => {
  try {
    await pool.query(STUDY_TIME_QUERIES.SAVE_STUDY_TIME, [
      user_id,
      study_date,
      start_time,
      end_time,
      total_study_time,
    ]);
  } catch (error) {
    throw new SaveStudyTimeToDBFailError(newState, user_id, error);
  }
};
