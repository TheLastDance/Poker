import dataStore from "./dataStore";
import formStore from "./formStore";
import gameStore from "./gameStore";
import { ICardsForPlay, IFormStore, IDataStore, IGameStore, IBot, ICombination } from "../types";
import { checkCombination } from "../Utils/combinationCheck";

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
  // private random = 0.1;

  constructor() {
    this.dataStore = dataStore;
    this.formStore = formStore;
    this.hand = this.dataStore.selectCards();
    this.stack = +this.formStore.playerBank;
    this.name = this.randomName;
  }

  clearStates(): void {
    this.bet = 0;
    this.isMoving = false;

    if (this.turn !== "fold" || gameStore.round === "finish") {
      console.log("clear turn!!!");
      this.turn = false;
    }
  }

  cardDistribution(): void {
    this.hand = this.dataStore.selectCards();
  }

  winner(): void {
    this.stack += gameStore.bank;
  }

  splitPot(length: number): void {
    this.stack += gameStore.bank / length;
  }

  combination(): ICombination {
    const board = gameStore.board;
    return checkCombination(board.concat(this.hand), this.id);
  }

  ai(): void {
    const random = Math.random();
    // better to make a getter function with returns

    if (random < 0.2) {
      this.turn = "fold";
      return;
    }
    else if (random >= 0.2 && random < 0.5 && this.bet < gameStore.maxBet) {
      this.turn = "call";
      this.callCalculation();
      return;
    }
    else if (random >= 0.5 && this.bet === gameStore.maxBet) {
      this.turn = "check";
      return;
    } else if (this.turn !== "raise") {
      this.turn = "raise";
      this.raiseCalculation(); // also could be a bug here, when bot raises on flop/turn/river calculation is not working, maybe because maxBet === 0;
      return;
    } else {
      this.turn = "fold";
    }
  }

  callCalculation() {
    this.stack -= gameStore.maxBet - this.bet;
    gameStore.bank += gameStore.maxBet - this.bet;
    this.bet += gameStore.maxBet - this.bet;
  }

  raiseCalculation() {
    let raiseBet = gameStore.maxBet;

    if (gameStore.maxBet === 0) {
      raiseBet = 1; // mostly this will be needed when maxBet could be cleared (flop,turn,river stages), so we need to use something different than 0.
    }

    this.bet = this.bet + raiseBet * 2;
    this.stack -= raiseBet * 2;
    gameStore.bank += raiseBet * 2;
    gameStore.maxBet = this.bet;
  }

  blindsCalculation() {
    if (this.bigBlind) {
      this.stack -= gameStore.bigBlindCost;
      gameStore.bank += gameStore.bigBlindCost;
      this.bet += gameStore.bigBlindCost;
    }
    if (this.smallBlind) {
      this.stack -= gameStore.smallBlindCost;
      gameStore.bank += gameStore.smallBlindCost;
      this.bet += gameStore.smallBlindCost;
    }
  }

  private get randomName(): string {
    const index: number = Math.floor(Math.random() * botNames.length);
    const name: string = botNames[index];
    botNames.splice(index, 1);
    return `Bot-${name}`;
  } // randomizes name of bot at the start of the game.
}

