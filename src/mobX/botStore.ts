import dataStore from "./dataStore";
import formStore from "./formStore";
import gameStore from "./gameStore";
import { ICardsForPlay, IFormStore, IDataStore, IBot, ICombination, TurnsEnum, IBotInfo } from "../types";
import { checkCombination } from "../Utils/combinationCheck";
import { runInAction } from "mobx";
import { botInfo } from "../data/botInfoData";

const { fold, call, check, raise, allIn } = TurnsEnum;


// not mobX class
export class Bot implements IBot {
  info: IBotInfo = {
    name: "",
    avatar: "",
  };

  hand: ICardsForPlay[] = [];
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
    this.info = this.randomBot();
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
      else if (random >= 0.2 && random < 0.7 && this.bet < gameStore.maxBet) {
        this.callCalculation();
        return;
      }
      else if (random >= 0.2 && this.bet === gameStore.maxBet) {
        this.turn = check;
        return;
      } else if (random > 0.5) {
        this.raiseCalculation();
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

  private randomBot(): IBotInfo {
    const index: number = Math.floor(Math.random() * botInfo.length);
    botInfo[index].name = `Bot-${botInfo[index].name}`;
    const info = botInfo[index];
    botInfo.splice(index, 1);
    return info;
  } // randomizes name of bot at the start of the game.
}

