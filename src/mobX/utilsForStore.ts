import { Howl } from "howler";
import { IBot, ICombination, IPlayer, TurnsEnum, IMoneyWinners, ICardsForPlay } from "../types";
import gameStore from "./gameStore";
const { fold, allIn } = TurnsEnum;

export function handleTurn(arr: (IBot | IPlayer)[], move: TurnsEnum): IBot[] {
  return arr.map((item, index) => {
    if (index === 0) {
      item.turn = move;
      item.isMoving = false;
    }
    if (index === 1) {
      item.isMoving = true;
    }
    return item;
  })
}

export function allFold(arr: (IBot | IPlayer)[]): boolean {
  const filterByFold = arr.filter(item => item.turn === fold);

  if (filterByFold.length === arr.length - 1) {
    return true;
  }
  return false;
} // checks that everyone folded except last person.

export function sameBids(arr: (IBot | IPlayer)[]): boolean {
  const filterByFold = arr.filter(item => item.turn !== fold && item.turn !== allIn);
  const same = filterByFold.every(item => item.bet === gameStore.maxBet);

  return same;
} // checks if everyone who still play have same bets.

export function checkAllIns(arr: (IBot | IPlayer)[]): boolean {
  const filteredArr = arr.filter(item => item.turn !== fold && item.turn !== allIn);

  if (filteredArr.length > 1) {
    return false;
  }
  return true;
}

export function potAmount(arr: (IBot | IPlayer)[], player: (IBot | IPlayer | ICombination)): number {
  const playerAmount = player.betSum;

  return arr.reduce((acc: number, item: IBot) => {
    if (item.betSum <= playerAmount) {
      const amount = item.betSum;
      item.betSum = 0;
      return acc + amount;
    } else {
      item.betSum = item.betSum - playerAmount;
      return acc + playerAmount;
    }
  }, 0);
}// will calculate the pot which first winner should take, need only if winner had lower bet than at least one player (all-in case for example).

export function giveBack(arr: (IBot | IPlayer)[], playersMaxBet: (IBot | IPlayer)[]): void {
  const remainder = playersMaxBet[0].betSum - playersMaxBet[1].betSum;
  arr.map(item => {
    if (item.id === playersMaxBet[0].id) {
      item.giveBackRemaining(remainder);
    }
    return item;
  });
}// gives remaining from the raise back to the player who has placed it.

export function showdownTime(arr: (IBot | IPlayer)[]): number {
  const quantity = arr.filter(item => item.turn !== fold).length;
  let minTime = 10000;

  if (quantity !== 2) {
    const addedTime = `${(quantity - 2) * 2}000`;
    minTime = minTime + Number(addedTime);
    return minTime;
  } else {
    return minTime;
  }
} // this function will generate time for showdown stage where player will be able to see/check combinations of other players at the showdown.
// after this time showdown will be ended and winner will take a bank. Idea of this function is to give more time for showdown if there are more players on this stage.
// if there are min quantity - 2, time will be 10sec, if other quantity - time will be increased by 2sec for each + 1player.

export function checkMoneyWinners(arr: IMoneyWinners[], id: number, amount: number): IMoneyWinners[] {
  const filtered = arr.filter(item => item.id === id);
  if (filtered.length === 1) {
    return arr.map(item => item.id === id ? ({ ...item, winningAmount: item.winningAmount + amount }) : item);
  } else {
    arr.push({ id: id, winningAmount: amount });
    return arr;
  }
} // with this function moneyWinners array from gameStore will be updated, we need this to show amount of winners winnings.

export function soundController(isOn: boolean, sound: () => number | Howl): void {
  if (isOn) {
    sound();
  }
}

export function checkCloseCards(hand: ICardsForPlay[]): boolean {
  let soarted = [...hand].sort((a, b) => Number(b.value) - Number(a.value));
  let difference = Number(soarted[0].value) - Number(soarted[1].value);

  if (difference <= 3 && difference > 0) {
    return true
  }
  return false;
} // checks if cards are close by value to each other, so possible straight could happened.

export function checkSumCards(hand: ICardsForPlay[]): number {
  const reduce = hand.reduce((accum, item) => accum + Number(item.value), 0);
  const isPair = hand.every(item => item.value === hand[0].value);
  if (reduce > 15 && reduce <= 20) {
    if (isPair) return 0.2; //bonus points for pair
    if (+hand[0].value >= 13 || +hand[1].value >= 13) return 0.15;
    return 0.1;
  }
  if (reduce > 20 && reduce <= 25) {
    if (isPair) return 0.35;
    return 0.2;
  }
  if (reduce > 25) {
    if (isPair) return 0.45;
    return 0.3;
  }
  return 0;
}// returns points which are used for hand power checker. Checks the power of hand by card values.

export function checkSuitsCards(hand: ICardsForPlay[]): boolean {
  return hand.every(item => item.suit === hand[0].suit);
} // checks that pocket cards have the same suit

export function isBoardComb(board: ICombination, arr: ICombination): boolean {
  return JSON.stringify(board.bestHand) === JSON.stringify(arr.bestHand);
} // checks if the combination was fully made from board cards.