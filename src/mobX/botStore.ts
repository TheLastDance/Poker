import dataStore from "./dataStore";
import formStore from "./formStore";
import gameStore from "./gameStore";
import { ICardsForPlay, IFormStore, IDataStore, IGameStore, IBot } from "../types";

let botNames = ["Mark", "Eduard", "Travis", "Anna", "Nelson", "Vinnie", "Nancy", "Bella"];

export class Bot implements IBot {
  hand: ICardsForPlay[] = [];
  name: string;
  stack = 0;
  bet = 0;
  bigBlind = false;
  smallBlind = false;
  isDiller = false;
  isMoving = false;
  turn: string | false = false;
  isBot = true;
  id = 0;
  dataStore: IDataStore;
  formStore: IFormStore;
  maxBet: number;
  // private random = 0.1;

  constructor() {
    this.dataStore = dataStore;
    this.formStore = formStore;
    this.maxBet = gameStore.maxBet;
    this.hand = this.dataStore.selectCards();
    this.stack = +this.formStore.playerBank;
    this.name = this.randomName;
  }

  clearStates(): void {
    this.bet = 0;
    this.isMoving = false;
    this.turn = false;
  }

  cardDistribution(): void {
    this.hand = this.dataStore.selectCards();
  }

  winner(): void {
    this.stack += gameStore.bank;
    //handsCount++ and clearstates
  }

  ai(): void {
    const random = Math.random(); // change to Math.random() then
    // better to make a getter function with returns

    if (random < 0.2) {
      this.turn = "fold";
      return;
    }
    else if (random >= 0.2 && random < 0.5 && this.bet < gameStore.maxBet) {
      this.turn = "call";
      this.stack -= gameStore.maxBet - this.bet;
      gameStore.bank += gameStore.maxBet - this.bet;
      this.bet += gameStore.maxBet - this.bet;
      return;
    }
    else if (random >= 0.5 && this.bet === gameStore.maxBet) {
      this.turn = "check";
      return;
    } else if (this.turn !== "raise") {
      this.turn = "raise";
      this.bet = this.bet + gameStore.maxBet * 2;
      this.stack -= gameStore.maxBet * 2;
      gameStore.bank += gameStore.maxBet * 2;
      gameStore.maxBet = this.bet;
      return;
    } else {
      this.turn = "fold";
    }
  }

  private get randomName(): string {
    const index: number = Math.floor(Math.random() * botNames.length);
    const name: string = botNames[index];
    botNames.splice(index, 1);
    return `Bot-${name}`;
  } // randomizes name of bot at the start of the game.
}

