import { StudyTimeCountError, SendingDMFailError } from "../../error/Errors.js";

export class User {
  #newState;

  #userId;
  #userDisplayName;

  #isStudying;
  #studyTimeStart;
  #studyTimeEnd;
  #studyTime;
  #totalStudyTime;
  #yymmdd;

  constructor(newState) {
    this.#initializeUser(newState);
  }

  #initializeUser(newState) {
    this.#newState = newState;
    this.#userDisplayName = newState.member.user.displayName;
    this.#userId = newState.member.user.id;
    this.#isStudying = false;
    this.#yymmdd = this.#getDate();
    this.#studyTimeStart = 0;
    this.#studyTimeEnd = 0;
    this.#studyTime = 0;
    this.#totalStudyTime = 0;
  }
  #getDate() {
    const today = new Date();
    const year = today.getFullYear() % 100;
    const month = (today.getMonth() + 1).toString().padStart(2, "0");
    const date = today.getDate();
    return `${year}${month}${date}`;
  }

  updateState(newState) {
    this.#newState = newState;
    this.#userDisplayName = newState.member.user.displayName;
    this.#userId = newState.member.user.id;
  }

  get userId() {
    return this.#userId;
  }

  get curState() {
    return this.#newState;
  }

  makeMessage(msg) {
    return this.#userDisplayName + msg;
  }

  startTimer() {
    this.#studyTimeStart = Date.now();
    this.#isStudying = true;
  }

  endTimer() {
    if (this.#isStudying && this.#studyTimeStart > 0) {
      this.#studyTimeEnd = Date.now();
      this.#isStudying = false;
      this.#saveTime();
      this.#sendDM();
      return;
    }
    throw new StudyTimeCountError();
  }

  #saveTime() {
    if (this.#studyTimeStart > 0 && this.#studyTimeEnd > 0) {
      this.#studyTime = this.#calculateStudyTime();
      this.#totalStudyTime += this.#studyTime;
      return;
    }
    throw new StudyTimeCountError();
  }

  #sendDM() {
    try {
      const membersMap = this.#newState.guild.members.cache;
      const member = membersMap.get(this.#userId);
      member.send(
        `${this.#userDisplayName} 마님 방금 ${
          this.#studyTime
        }초 공부하셨습니다요!\n오늘 총 공부 시간은 ${
          this.#totalStudyTime
        }초 여유!!`
      );
    } catch (error) {
      new SendingDMFailError(this.#newState, error);
    }
  }

  #calculateStudyTime() {
    const studiedSeconds = Math.floor(
      (this.#studyTimeEnd - this.#studyTimeStart) / 1000
    );
    return studiedSeconds;
  }
}
