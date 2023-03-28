import { Bot } from "./botStore";

export class Player extends Bot {

  constructor() {
    super();
    this.name = this.formStore.name;
    this.isBot = false;
  }
}