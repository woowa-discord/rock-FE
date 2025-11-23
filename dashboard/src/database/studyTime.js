import { supabase } from "./supabaseClient";
import { getWeekStart, getWeekEnd } from "../utils/weekDate.js";

export const getTotalStudyTime = async (
  hasFetchedData,
  userId,
  selectedGuild
) => {
  if (hasFetchedData.current) return;
  try {
    hasFetchedData.current = true;
    const { data, error } = await supabase
      .from("session")
      .select("study_time")
      .eq("user_id", userId)
      .eq("guild_id", selectedGuild.id);

    if (error) throw Error(error.message);
    if (data) return data;
  } catch (error) {
    console.log("db error : ", error);
  }
  return false;
};

export const getWeeklyStudyTime = async (
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
      .from("session")
      .select("*")
      .eq("user_id", userId)
      .eq("guild_id", selectedGuild.id)
      .gte("start_time", weekStartDate.toISOString()) // 시작일보다 크거나 같고
      .lte("end_time", weekEndDate.toISOString()); // 종료일보다 작거나 같음

    if (error) throw Error(error.message);
    if (data) return data;
  } catch (error) {
    console.log("db error : ", error);
  }
  return false;
};
