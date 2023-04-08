import { IPlayer } from "../types";
import { Bot } from "./botStore";
import gameStore from "./gameStore";

export class Player extends Bot implements IPlayer {
  constructor() {
    super();
    this.name = this.formStore.name;
    this.isBot = false;
  }

  raiseInput(e: React.ChangeEvent<HTMLInputElement>): void {
    gameStore.playerRaiseAmount = Number(e.target.value);
  }

  override raiseCalculation(): void {
    this.bet += gameStore.playerRaiseAmount;
    this.stack -= gameStore.playerRaiseAmount;
    gameStore.bank += gameStore.playerRaiseAmount;
    gameStore.maxBet = this.bet;
    gameStore.playerRaiseAmount = gameStore.maxBet + 1;
  }
}