import { IPlayer } from "../types";
import { Bot } from "./botStore";
import gameStore from "./gameStore";
import avatar from "../assets/incognito_avatar.jpg"

// not mobX class
export class Player extends Bot implements IPlayer {
  constructor() {
    super();
    this.info = {
      name: this.formStore.name,
      avatar: avatar,
    };
    this.isBot = false;
  }

  raiseInput(e: number): void {
    gameStore.playerRaiseAmount = e;
  }

  override raiseCalculation(): void {
    this.bet += gameStore.playerRaiseAmount;
    this.betSum += gameStore.playerRaiseAmount;
    this.stack -= gameStore.playerRaiseAmount;
    gameStore.bank += gameStore.playerRaiseAmount;
    gameStore.maxBet = this.bet;
    gameStore.playerRaiseAmount = gameStore.maxBet + 1;
  }
}