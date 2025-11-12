import { BotError } from "./BotError.js";
import { ERROR_MESSAGES } from "../constants/errorMessages.js";

export class StudyTimeCountError extends BotError {
  constructor() {
    super(ERROR_MESSAGES.ERROR_STUDY_TIME_CONUT);
  }
}
