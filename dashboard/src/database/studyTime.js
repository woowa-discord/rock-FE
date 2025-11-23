import { supabase } from "./supabaseClient";

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
