import dataStore from "./dataStore";
import formStore from "./formStore";
import gameStore from "./gameStore";
import { ICardsForPlay, IFormStore, IDataStore, IBot, ICombination, TurnsEnum, IBotInfo, RoundEnum } from "../types";
import { checkCombination } from "../Utils/combinationCheck";
import { runInAction } from "mobx";
import { botInfo } from "../data/botInfoData";
import { sounds } from "../data/assetsData";
import { soundController } from "./utilsForStore";
import { POKER_RANKINGS } from "../Utils/winnerCheck";
import { checkCloseCards, checkSumCards, checkSuitsCards } from "./utilsForStore";

const { fold, call, check, raise, allIn } = TurnsEnum;
const { pre_flop, finish } = RoundEnum;


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
  private bluffCoef = Math.random() + 0.5; // risk coef should be from 0.5 to 1.5 to increase or decrease hand power

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

    if (this.turn !== fold && this.turn !== allIn || gameStore.round === finish) {
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
      const comb = this.combination();
      const random = Math.random();


      let accumulator = 0; // this variable will accumulate inside a number step by step, and then based on that number will make a decision.

      if (gameStore.round === pre_flop) {
        const sumCards = checkSumCards(this.hand);
        accumulator += sumCards;

        if (checkCloseCards(this.hand) && sumCards >= 0.1) accumulator += 0.15;

        if (checkCloseCards(this.hand) && sumCards < 0.1) accumulator += 0.1;

        if (checkSuitsCards(this.hand)) accumulator += 0.2;

        if (POKER_RANKINGS[comb.combination] === 1) accumulator += 0.5;

        const maxBetCoef = this.maxbetCoefCalculator(accumulator);

        const test = accumulator * this.bluffCoef * maxBetCoef;
        console.log(accumulator, maxBetCoef, this.bluffCoef, test);

        this.decisionMaker(test);
      } else {
        this.decisionMaker(random);
      }
    })
  }

  maxbetCoefCalculator(acc: number) {
    const averageBank = Number(this.formStore.playerBank) * (Number(this.formStore.opponents) + 1) / gameStore.players.length;
    console.log(averageBank);

    let maxBetCoef = 1;

    if (gameStore.maxBet > this.stack + this.bet) {
      if (this.bet / averageBank > 0.6) {
        maxBetCoef += 0.2;
      } else {
        maxBetCoef -= 0.2;
      }
      if (this.bet / this.stack > 1.5) {
        maxBetCoef += 0.2;
      } else {
        maxBetCoef -= 0.2;
      }
      if (this.stack / averageBank < 0.35) {
        maxBetCoef += 0.1;
      } else {
        maxBetCoef -= 0.1;
      }
    } else {
      if (this.stack / averageBank < 0.35) {
        maxBetCoef += 0.1;
      } else {
        maxBetCoef -= 0.1;
      }
      if (gameStore.maxBet / this.stack > 0.4) {
        maxBetCoef -= 0.2;
      } else {
        maxBetCoef += 0.2;
      }
      if (acc > 0.3) {
        maxBetCoef += 0.2;
      } else {
        maxBetCoef -= 0.2;
      }
    }

    return maxBetCoef;

  }

  decisionMaker(random: number): void {
    if (random < 0.15 && this.bet !== gameStore.maxBet) {
      this.turn = fold;
      soundController(this.dataStore.isSoundOn, () => sounds.fold.play());
      return;
    }
    else if (random >= 0.15 && random < 0.5 && this.bet < gameStore.maxBet) {
      this.callCalculation();
      return;
    }
    else if (random >= 0.5) {
      this.raiseCalculation();
      return;
    } else {
      this.turn = check;
      soundController(this.dataStore.isSoundOn, () => sounds.check.play());
    }
  }

  async callCalculation() {
    if (gameStore.maxBet < this.stack + this.bet) {
      if (this.turn === call) {
        this.turn = false;
        await new Promise(resolve => setTimeout(() => resolve(this.turn = call), 500));
      } else {
        this.turn = call;
      }
      this.stack -= gameStore.maxBet - this.bet;
      runInAction(() => gameStore.bank += gameStore.maxBet - this.bet);
      this.betSum += gameStore.maxBet - this.bet;
      this.bet += gameStore.maxBet - this.bet;
      soundController(this.dataStore.isSoundOn, () => sounds.call.play());
    } else {
      this.allInCalculation();
      soundController(this.dataStore.isSoundOn, () => sounds["All-in"].play());
    }
  }

  allInCalculation() {
    this.turn = allIn;
    gameStore.bank += this.stack;
    this.betSum += this.stack;
    this.bet += this.stack;
    this.stack = 0;
  }

  async raiseCalculation() {
    let raiseBet = gameStore.maxBet;

    if (gameStore.maxBet === 0) {
      raiseBet = 1; // mostly this will be needed when maxBet could be cleared (flop,turn,river stages), so we need to use something different than 0.
    }

    if (raiseBet * 2 < this.stack) {
      if (this.turn === raise) {
        this.turn = false;
        await new Promise(resolve => setTimeout(() => resolve(this.turn = raise), 500));
      } else {
        this.turn = raise;
      }
      this.betSum += raiseBet * 2;
      this.bet = this.bet + raiseBet * 2;
      this.stack -= raiseBet * 2;
      runInAction(() => {
        gameStore.bank += raiseBet * 2;
        gameStore.maxBet = this.bet;
      });
      soundController(this.dataStore.isSoundOn, () => sounds.raise.play());
    } else {
      this.allInCalculation();
      soundController(this.dataStore.isSoundOn, () => sounds["All-in"].play());
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

