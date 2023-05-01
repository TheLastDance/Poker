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
import { checkCloseCards, checkSumCards, checkSuitsCards, isBoardComb } from "./utilsForStore";

const { fold, call, check, raise, allIn } = TurnsEnum;
const { pre_flop, flop, turn, river, finish } = RoundEnum;

const round_multiplier = {
  [pre_flop]: 1,
  [flop]: 1.5,
  [turn]: 2,
  [river]: 3,
  [finish]: 1,
}

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
  private reRaiseQuantity = 1; // need for ai to avoid much re-raises.

  // low all-in and all-in split pots was tested with argument inside constructor, where we could put specific hand to mock specific situation.
  constructor() {
    this.dataStore = dataStore;
    this.formStore = formStore;
    this.hand = this.dataStore.selectCards();
    this.stack = +this.formStore.playerBank
    this.info = this.randomBot();
  }

  clearSumOfBets(): void {
    this.betSum = 0;
  }

  clearStates(): void {
    this.bet = 0;
    this.isMoving = false;
    this.reRaiseQuantity = 1;

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

  giveBackRemaining(remainder: number): void {
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
      const preFlopComb = checkCombination(this.hand, this.id, this.betSum);
      const postFlopComb = this.combination();
      // maybe will add random human effect coefficient in future. To make decisions a little unexpectable.

      let accumulator = 0; // this variable will accumulate inside a number step by step, and then based on that number will make a decision.

      if (gameStore.round === pre_flop) {
        accumulator = this.handPowerCalculator(preFlopComb);

        const maxBetCoef = this.maxbetCoefCalculator(accumulator);

        const ratio = accumulator * this.bluffCoef * maxBetCoef;
        console.log(accumulator, maxBetCoef, this.bluffCoef, ratio);

        this.decisionMaker(ratio);
      } else {
        if (gameStore.round !== finish) {
          accumulator = this.handPowerCalculator(preFlopComb) / round_multiplier[gameStore.round]; // with each round hand power will be less important
        }
        const maxBetCoef = this.maxbetCoefCalculator(accumulator);
        const combCoef = this.combPowerCalculator(postFlopComb);
        const ratio = (accumulator * this.bluffCoef * maxBetCoef) + (combCoef * this.bluffCoef);
        console.log(accumulator, maxBetCoef, this.bluffCoef, ratio);
        this.decisionMaker(ratio);
      }
    })
  }

  handPowerCalculator(comb: ICombination): number {
    let accumulator = 0;
    const sumCards = checkSumCards(this.hand);
    accumulator += sumCards;

    if (checkCloseCards(this.hand) && sumCards >= 0.1) accumulator += 0.15;

    if (checkCloseCards(this.hand) && sumCards < 0.1) accumulator += 0.1;

    if (checkSuitsCards(this.hand)) accumulator += 0.2;

    if (POKER_RANKINGS[comb.combination] === 1) accumulator += 0.5;

    return accumulator;
  } // calculates the power coefficient of hand. Need for ai decisions. Used also in pre flop ai decision.

  combPowerCalculator(comb: ICombination): number {
    const board = checkCombination(gameStore.board, this.id, this.betSum);
    const isFromBoard = isBoardComb(board, comb);
    const kickerValue = [...this.hand].sort((a, b) => Number(b.value) - Number(a.value))[0].value;

    if (isFromBoard && POKER_RANKINGS[comb.combination] > 0) { // has combination from board
      if (Number(kickerValue) > 12) { // high kicker check
        return 0.06;
      }
      return -0.1;
    } else if (isFromBoard && POKER_RANKINGS[comb.combination] < 1) { // don't have a combination at all
      return -(round_multiplier[gameStore.round] * 0.1);
    } else { // no combination from board
      if (POKER_RANKINGS[comb.combination] > 0) {
        return POKER_RANKINGS[comb.combination] * 0.1; // will return combination value multiplied by 0.1, the higher combination - higher points for possible raise/call.
      } else {
        return -(round_multiplier[gameStore.round] * 0.1); // high card combination will reduce points for possible raise/call, so fold possibility increases.
      }
    }
  } // post flop ai

  maxbetCoefCalculator(acc: number): number {
    const averageBank = Number(this.formStore.playerBank) * (Number(this.formStore.opponents) + 1) / gameStore.players.length;
    console.log(averageBank);

    let maxBetCoef = 1;

    //all-in case
    if (gameStore.maxBet > this.stack + this.bet) {
      if (this.bet / averageBank > 0.6) {
        maxBetCoef += 0.2;
      } else {
        maxBetCoef -= 0.2;
      } // if you have already placed more than 60% of average bank per person
      if (this.bet / this.stack > 1.5) {
        maxBetCoef += 0.2;
      } else {
        maxBetCoef -= 0.2;
      }// if your already placed bet is 1.5 higher than remaining stack
      if (this.stack / averageBank < 0.35) {
        maxBetCoef += 0.1;
      } else {
        maxBetCoef -= 0.1;
      }// if your stack is only 35% or less than average stack on table per player.
      if (acc > 0.5) {
        maxBetCoef += 0.2;
      } else {
        maxBetCoef -= 0.2;
      } // if your hand coef is more than 0.35
    } else {
      if (this.stack / averageBank < 0.35) {
        maxBetCoef += 0.1;
      } else {
        maxBetCoef -= 0.1;
      }
      if (gameStore.maxBet / this.stack > 0.3) {
        maxBetCoef -= 0.2;
      } else {
        maxBetCoef += 0.2;
      } // if someone raises more than 40% of your stack.
      if (acc > 0.35) {
        maxBetCoef += 0.2;
      } else {
        maxBetCoef -= 0.2;
      } // if your hand coef is more than 0.35
      const isLowest = maxBetCoef - (0.2 * this.reRaiseQuantity);
      if (this.turn === raise && isLowest > 0.2 || this.reRaiseQuantity > 1 && isLowest > 0.2) {
        console.log("reRaise", maxBetCoef);

        maxBetCoef -= (0.2 * this.reRaiseQuantity);
        this.reRaiseQuantity += 1;
      } // if previous turn was raise
    }

    return maxBetCoef;
  } // calculates the situation on table and returns a coefficient based on it.

  decisionMaker(ratio: number): void {
    if (ratio < 0.15 && this.bet !== gameStore.maxBet) {
      this.turn = fold;
      soundController(this.dataStore.isSoundOn, () => sounds.fold.play());
      return;
    }
    else if (ratio >= 0.15 && ratio < 0.5 && this.bet < gameStore.maxBet) {
      this.callCalculation();
      return;
    }
    else if (ratio >= 0.5) {
      this.raiseCalculation(ratio);
      return;
    } else {
      this.turn = check;
      soundController(this.dataStore.isSoundOn, () => sounds.check.play());
    }
  } // takes a ratio which was calculated before and based on it makes a decision.

  async callCalculation(): Promise<void> {
    const lessThanBB = this.stack + this.bet - gameStore.maxBet < gameStore.bigBlindCost;
    if (gameStore.maxBet < this.stack + this.bet && !lessThanBB) {
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
      if (gameStore.maxBet < this.bet) gameStore.maxBet = this.bet;
    }
  }

  allInCalculation(): void {
    this.turn = allIn;
    gameStore.bank += this.stack;
    this.betSum += this.stack;
    this.bet += this.stack;
    this.stack = 0;
  }

  async raiseCalculation(ratio: number): Promise<void> {
    let raiseBet = (ratio + 1) * gameStore.maxBet; // multiples current maxbet by ratio + 1. So raises more if ratio is high and opposite.

    if (gameStore.maxBet === 0) {
      raiseBet = (ratio + 1) * gameStore.bigBlindCost; // mostly this will be needed when maxBet could be cleared (flop,turn,river stages), so we need to use something different than 0.
    }

    if (raiseBet < this.stack) {
      if (this.turn === raise) {
        this.turn = false;
        await new Promise(resolve => setTimeout(() => resolve(this.turn = raise), 500));
      } else {
        this.turn = raise;
      }
      this.betSum += raiseBet;
      this.bet = this.bet + raiseBet;
      this.stack -= raiseBet;
      runInAction(() => {
        gameStore.bank += raiseBet;
        gameStore.maxBet = this.bet;
      });
      soundController(this.dataStore.isSoundOn, () => sounds.raise.play());
    } else {
      this.allInCalculation();
      soundController(this.dataStore.isSoundOn, () => sounds["All-in"].play());
      if (gameStore.maxBet < this.bet) gameStore.maxBet = this.bet;
    }
  }

  blinds(blindCost: number): void {
    this.stack -= blindCost;
    gameStore.bank += blindCost;
    this.bet += blindCost;
    this.betSum += blindCost;
  }

  blindsCalculation(): void {
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
  } // randomizes bot from the array of bots at the start of the game.
}

