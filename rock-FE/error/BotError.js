export class BotError extends Error {
  constructor(data) {
    super(data);
    this.name = this.constructor.name;
  }
}
