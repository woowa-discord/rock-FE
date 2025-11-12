import { Events } from "discord.js";
import { CHANNEL_ENTER_MSG, CHANNEL_EXIT_MSG } from "../constants/messages.js";
import { User } from "./UserClass/User.js";

const studyChannelId = process.env.STUDY_TRACK_VOICE_CHANNEL_ID;

export default {
  name: Events.VoiceStateUpdate,
  //client는 voiceStateUpdate를 일으킨 member의 VoiceState를 반환
  execute(oldState, newState) {
    const client = newState.client;
    //음성채널 위치의 변동이 있는 경우 (= 입/퇴장)
    if (oldState.channelId !== newState.channelId) {
      const user = getStudyUser(newState, client);
      checkStudy(client, user); //현재 사용자의 입/퇴장 상태에 따라 공부시간 측정/종료
    }
  },
};

const getStudyUser = (newState, client) => {
  if (!client.studyUsers) client.studyUsers = new Map(); //만약 client에 studyUsers라는 저장소가 없다면 만들어주기
  //만약 client의 studyUsersMap에 해당 사용자의 인스턴스가 저장되어 있지 않다면, 새로 만들어서 추가하고
  //만약 저장이 되어 있다면 해당 value를 꺼내와서 할당
  const studyUsersMap = client.studyUsers;
  const userId = newState.member.user.id;
  return studyUsersMap.has(userId)
    ? studyUsersMap.get(userId)
    : new User(newState);
};

const checkStudy = (client, user) => {
  const curChannelId = user.curState.channelId;
  //현재 State의 입/퇴장 구분
  if (curChannelId === studyChannelId) {
    //입장 시간 저장
    user.startTimer();
    //입장 메세지 전송
    const msg = user.makeMessage(CHANNEL_ENTER_MSG);
    sendMessage(user, msg);
  }
  if (curChannelId !== studyChannelId) {
    user.endTimer();
    //퇴장 메세지 전송
    const msg = user.makeMessage(CHANNEL_EXIT_MSG);
    sendMessage(user, msg);
  }
  client.studyUsers.set(user.userId, user);
};

const sendMessage = (user, msg) => {
  const channelCollection = user.curState.guild.channels.cache; //서버에 존재하는 모든 채널을 Collection 형태로 리턴
  //Collection을 순회하여 동일한 voice Channel id를 가진 객체를 찾은 뒤, 해당 객체.send('메세지') 해야 함
  const voiceChannel = channelCollection.get(studyChannelId);
  voiceChannel.send(msg);
};
