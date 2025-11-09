import { Events } from "discord.js";
import { CHANNEL_ENTER_MSG, CHANNEL_EXIT_MSG } from "../constants/messages.js";

const studyChannelId = process.env.STUDY_TRACK_VOICE_CHANNEL_ID;

export default {
  name: Events.VoiceStateUpdate,
  //client는 voiceStateUpdate를 일으킨 member의 VoiceState를 반환
  execute(oldState, newState) {
    const msg = getMessage(newState);
    sendMessage(newState, msg);
  },
};

const getMessage = (newState) => {
  const userDisplayName = newState.member.user.displayName; //사용자 별명
  // newState.member.user.username = 사용자 이름 (=id)
  // newState.member.user.id = 사용자 id 번호

  if (newState.channelId === null) {
    return userDisplayName + CHANNEL_EXIT_MSG;
  } else if (newState.channelId === studyChannelId) {
    return userDisplayName + CHANNEL_ENTER_MSG;
  }
};

const sendMessage = (state, msg) => {
  const channelCollection = state.guild.channels.cache; //서버에 존재하는 모든 채널을 Collection 형태로 리턴
  //Collection을 순회하여 동일한 voice Channel id를 가진 객체를 찾은 뒤, 해당 객체.send('메세지') 해야 함
  for (const channel of channelCollection) {
    const channelId = channel[0];
    if (channelId === studyChannelId) {
      const voiceChannelObject = channel[1];
      voiceChannelObject.send(msg);
    }
  }
};
