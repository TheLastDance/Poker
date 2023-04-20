import { IBot, ICombination, IPlayer, TurnsEnum } from "../types";
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

} // right now will not work on second round of bidding

export function sameBids(arr: (IBot | IPlayer)[]): boolean {
  const filterByFold = arr.filter(item => item.turn !== fold && item.turn !== allIn);
  const same = filterByFold.every(item => item.bet === gameStore.maxBet);

  return same;
}

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
}