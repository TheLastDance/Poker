import dataStore from "./dataStore";
import formStore from "./formStore";
import gameStore from "./gameStore";
import { ICardsForPlay, IFormStore, IDataStore, IBot, ICombination, TurnsEnum } from "../types";
import { checkCombination } from "../Utils/combinationCheck";
import { runInAction } from "mobx";

const { fold, call, check, raise, allIn } = TurnsEnum;

let botNames = ["Mark", "Eduard", "Travis", "Anna", "Nelson", "Vinnie", "Nancy", "Bella"];

export class Bot implements IBot {
  hand: ICardsForPlay[] = [];
  name: string;
  stack = 0;
  bet = 0;
  betSum = 0;
  bigBlind = false;
  smallBlind = false;
  isDiller = false;
  isMoving = false;
  turn: TurnsEnum | false = false;
  isBot = true;
  id = 0;
  dataStore: IDataStore;
  formStore: IFormStore;
  // private random = 0.1;

  // low all-in and all-in split pots was tested with argument inside constructor, where we could put specific hand to mock specific situation.
  constructor() {
    this.dataStore = dataStore;
    this.formStore = formStore;
    this.hand = this.dataStore.selectCards();
    this.stack = +this.formStore.playerBank
    this.name = this.randomName;
  }

  clearSumOfBets() {
    this.betSum = 0;
  }

  clearStates(): void {
    this.bet = 0;
    this.isMoving = false;

    if (this.turn !== fold && this.turn !== allIn || gameStore.round === "finish") {
      console.log("clear turn!!!");
      this.turn = false;
    }
  }

  cardDistribution(): void {
    this.hand = this.dataStore.selectCards();
  }

  winner(): void {
    this.stack += gameStore.bank;
    console.log("winner");
  }

  winnerByLowAllIn(pot: number): void {
    this.stack += pot;
    gameStore.bank -= pot;
  }

  giveBackRemaining(remainder: number) {
    this.stack += remainder;
    this.betSum -= remainder;
    gameStore.bank -= remainder;
  }

  splitPot(length: number): void {
    this.stack += gameStore.bank / length;
  }

  combination(): ICombination {
    const board = gameStore.board;
    return checkCombination(board.concat(this.hand), this.id, this.betSum);
  }

  ai(): void { //changed
    runInAction(() => {
      const random = Math.random();
      // better to make a getter function with returns

      if (random < 0.1) {
        this.turn = fold;
        return;
      }
      else if (random >= 0.2 && random < 0.3 && this.bet < gameStore.maxBet) {
        this.callCalculation();
        return;
      }
      else if (random >= 0.9 && this.bet === gameStore.maxBet) {
        this.turn = check;
        return;
      } else if (random > 0) {
        this.raiseCalculation(); // also could be a bug here, when bot raises on flop/turn/river calculation is not working, maybe because maxBet === 0;
        return;
      } else {
        this.turn = fold;
      }
    })
  }

  callCalculation() {
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

  allInCalculation() {
    this.turn = allIn;
    gameStore.bank += this.stack;
    this.betSum += this.stack;
    this.bet += this.stack;
    this.stack = 0;
  }

  raiseCalculation() {
    let raiseBet = gameStore.maxBet;

    if (gameStore.maxBet === 0) {
      raiseBet = 1; // mostly this will be needed when maxBet could be cleared (flop,turn,river stages), so we need to use something different than 0.
    }

    if (raiseBet * 2 < this.stack) {
      this.turn = raise;
      this.betSum += raiseBet * 2;
      this.bet = this.bet + raiseBet * 2;
      this.stack -= raiseBet * 2;
      gameStore.bank += raiseBet * 2;
      gameStore.maxBet = this.bet;
    } else {
      this.allInCalculation();
      if (gameStore.maxBet < this.bet) gameStore.maxBet = this.bet;
    }
  }

  blinds(blindCost: number) {
    this.stack -= blindCost;
    gameStore.bank += blindCost;
    this.bet += blindCost;
    this.betSum += blindCost;
  }

  blindsCalculation() {
    if (this.bigBlind) {
      this.blinds(gameStore.bigBlindCost);
    }
    if (this.smallBlind) {
      this.blinds(gameStore.smallBlindCost);
    }
    if (this.stack === 0) this.turn = allIn;
  }

  private get randomName(): string {
    const index: number = Math.floor(Math.random() * botNames.length);
    const name: string = botNames[index];
    botNames.splice(index, 1);
    return `Bot-${name}`;
  } // randomizes name of bot at the start of the game.
}

