import { CHANNEL } from "../../constants/messages.js";
import { sendMessage2Channel, sendDM } from "./messageManager.js";
import { formatKSTDate } from "../../utils/time.js";
import { DBsaveStartTime, DBsaveEndTime } from "./DBManager.js";

export const checkStudy = async (newState, studyChannelId) => {
  const curChannelId = newState.channelId;
  const userDisplayName = newState.member.user.displayName;
  if (curChannelId === studyChannelId) {
    //입장
    await startTimer(newState);
    const msg = userDisplayName + CHANNEL.ENTER_MSG;
    sendMessage2Channel(newState, msg, studyChannelId);
  } else {
    //퇴장
    await endTimer(newState);
    const msg = userDisplayName + CHANNEL.EXIT_MSG;
    sendMessage2Channel(newState, msg, studyChannelId);
  }
};

const startTimer = async (newState) => {
  const startTime = new Date();
  const date = formatKSTDate(new Date());
  await DBsaveStartTime(newState, startTime, date);
};

const endTimer = async (newState) => {
  const endTime = new Date();
  const date = formatKSTDate(new Date());
  await DBsaveEndTime(newState, endTime, date);
};
