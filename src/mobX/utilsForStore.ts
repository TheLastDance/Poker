import { IBot, IPlayer, TurnsEnum } from "../types";
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

export function checkAllIns(arr: (IBot | IPlayer)[]) {
  const filteredArr = arr.filter(item => item.turn !== fold && item.turn !== allIn);

  if (filteredArr.length > 1) {
    return false;
  }
  return true;
}