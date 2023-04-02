import { IBot } from "../types";
import gameStore from "./gameStore";

export function handleTurn(arr: IBot[], move: string): IBot[] {
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

export function allFold(arr: IBot[]): boolean {
  const filterByFold = arr.filter(item => item.turn === "fold");

  if (filterByFold.length === arr.length - 1) {
    return true;
  }
  return false;

} // right now will not work on second round of bidding

export function sameBids(arr: IBot[]): boolean {
  const filterByFold = arr.filter(item => item.turn !== "fold");
  const same = filterByFold.every(item => item.bet === gameStore.maxBet);

  return same;
}