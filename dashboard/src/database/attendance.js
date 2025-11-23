import { getWeekStart, getWeekEnd } from "../utils/weekDate";
import { supabase } from "./supabaseClient";

export const getWeeklyAttendance = async (
  hasFetchedData,
  userId,
  selectedGuild
) => {
  if (hasFetchedData.current) return;
  try {
    hasFetchedData.current = true;

    const weekStartDate = getWeekStart(new Date());
    const weekEndDate = getWeekEnd(weekStartDate);

    const { data, error } = await supabase
      .from("attendance")
      .select("*")
      .eq("user_id", userId)
      .eq("guild_id", selectedGuild.id)
      .gte("created_at", weekStartDate.toISOString()) // 시작일보다 크거나 같고
      .lte("created_at", weekEndDate.toISOString()); // 종료일보다 작거나 같음

    if (error) throw Error(error.message);
    if (data) return data;
  } catch (error) {
    console.log("db error : ", error);
  }
  return false;
};
