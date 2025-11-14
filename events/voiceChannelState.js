import { Events } from "discord.js";
import { User } from "./studyTimeHandlers/User.js";
import { StudyTimeCountError } from "../error/Errors.js";
import { CHANNEL } from "../constants/messages.js";
import { send2VoiceChannel } from "./studyTimeHandlers/Message.js";

const studyChannelId = process.env.STUDY_TRACK_VOICE_CHANNEL_ID;

export default {
  name: Events.VoiceStateUpdate,
  //client는 voiceStateUpdate를 일으킨 member의 VoiceState를 반환
  execute(oldState, newState) {
    try {
      //스터디를 진행하는 음성채널에 변동이 있는 경우 (= 입/퇴장)
      if (
        oldState.channelId === studyChannelId ||
        newState.channelId === studyChannelId
      ) {
        const client = newState.client;
        const user = getStudyUser(newState, client);
        checkStudy(client, user); //현재 사용자의 입/퇴장 상태에 따라 공부시간 측정/종료
      }
    } catch (error) {
      if (error instanceof StudyTimeCountError) {
        send2VoiceChannel(
          newState,
          studyChannelId,
          `${newState.member.user.displayName} 마님..\n${error.message} \n다시 한 번 나갔다 들어오셔유...`
        );
        return;
      }

      send2VoiceChannel(
        newState,
        studyChannelId,
        `${newState.member.user.displayName} 마님.. 문제가 생긴 것 같슈.\n다시 해보셔야 쓰것는디?`
      );
      return;
    }
  },
};

const getStudyUser = (newState, client) => {
  if (!client.studyUsers) client.studyUsers = new Map(); //만약 client에 studyUsers라는 저장소가 없다면 만들어주기
  //만약 client의 studyUsersMap에 해당 사용자의 인스턴스가 저장되어 있지 않다면, 새로 만들어서 추가하고
  //만약 저장이 되어 있다면 해당 value를 꺼내와서 할당
  const studyUsersMap = client.studyUsers;
  const userId = newState.member.user.id;
  if (studyUsersMap.has(userId)) {
    const user = studyUsersMap.get(userId);
    user.updateState(newState);
    return user;
  }
  return new User(newState);
};

const checkStudy = (client, user) => {
  const curChannelId = user.curState.channelId;
  const curState = user.curState;
  if (curChannelId === studyChannelId) {
    //입장
    user.startTimer();
    const msg = user.makeMessage(CHANNEL.ENTER_MSG);
    send2VoiceChannel(curState, studyChannelId, msg);
  } else {
    //퇴장
    user.endTimer();
    const msg = user.makeMessage(CHANNEL.EXIT_MSG);
    send2VoiceChannel(curState, studyChannelId, msg);
  }
  client.studyUsers.set(user.userId, user); //client에 해당 사용자의 상태 업데이트
};
