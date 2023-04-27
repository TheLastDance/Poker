import { IPlayer, TurnsEnum } from "../types";
import { Bot } from "./botStore";
import gameStore from "./gameStore";
import avatar from "../assets/incognito_avatar.jpg";

const { call } = TurnsEnum;

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

  playerCallCalculation() {
    if (gameStore.maxBet < this.stack + this.bet) {
      this.turn = call;
      this.stack -= gameStore.maxBet - this.bet;
      gameStore.bank += gameStore.maxBet - this.bet;
      this.betSum += gameStore.maxBet - this.bet;
      this.bet += gameStore.maxBet - this.bet;
    } else {
      this.allInCalculation();
    }
  }

  playerRaiseCalculation(): void {
    this.bet += gameStore.playerRaiseAmount;
    this.betSum += gameStore.playerRaiseAmount;
    this.stack -= gameStore.playerRaiseAmount;
    gameStore.bank += gameStore.playerRaiseAmount;
    gameStore.maxBet = this.bet;
    gameStore.playerRaiseAmount = gameStore.maxBet + 1;
  }
}