import pool from "../../db/database.js";
import { STUDY_TIME_QUERIES } from "../../db/queries/studyTimeQueries.js";
import { getKoreanTime, formatKSTDate } from "../../utils/time.js";
import { formatStudyTime } from "../../utils/time.js";

const todayDate = formatKSTDate(getKoreanTime());

export const getStudyTime = async (interaction, range) => {
  const userDisplayName = interaction.member.displayName;
  try {
    let response = "";

    if (range === "day") {
      response = await dailyStudyTimeMsg(todayDate, userDisplayName);
    } else if (range === "month") {
      const monthPattern = `${todayDate.substring(0, 7)}%`;

      response = await monthlyStudyTimeMsg(monthPattern, userDisplayName);
    }

    await interaction.reply(response);
  } catch (error) {
    console.log(error.message);
  }
};

const dailyStudyTimeMsg = async (date, userDisplayName) => {
  const dailyStudyTime = await getStudyTimeFromDB(
    STUDY_TIME_QUERIES.FETCH_DAILY_STUDY_TIME,
    date
  );
  const formattedStudyTime = formatStudyTime(dailyStudyTime);
  return `[${userDisplayName}] 마님의 오늘(${date}) 공부시간은 ${formattedStudyTime} 여유!`;
};

const monthlyStudyTimeMsg = async (datePattern, userDisplayName) => {
  const monthlyStudyTime = await getStudyTimeFromDB(
    STUDY_TIME_QUERIES.FETCH_MONTHLY_STUDY_TIME,
    datePattern
  );
  const formattedStudyTime = formatStudyTime(monthlyStudyTime);

  const dateOnlyMonth = datePattern.substring(5, 7);
  return `[${userDisplayName}] 마님의 ${dateOnlyMonth}월의 공부시간은 ${formattedStudyTime} 여유!`;
};

const getStudyTimeFromDB = async (query, date) => {
  const queryResult = await pool.query(query, [date]);
  const totalStudyTime = queryResult.rows[0].total_study_time;
  return totalStudyTime;
};
