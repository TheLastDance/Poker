import { ICombination, CombinationEnum } from "../types";

const { RoyalFlush, HighCard, Flush, FullHouse, FourofaKind, ThreeofaKind, TwoPair, Straight, StraightFlush, OnePair } = CombinationEnum;

export const POKER_RANKINGS = {
  [RoyalFlush]: 9,
  [StraightFlush]: 8,
  [FourofaKind]: 7,
  [FullHouse]: 6,
  [Flush]: 5,
  [Straight]: 4,
  [ThreeofaKind]: 3,
  [TwoPair]: 2,
  [OnePair]: 1,
  [HighCard]: 0,
};

export function checkWinner(players: ICombination[]): ICombination[] {
  const arr = [...players].sort((a, b) => POKER_RANKINGS[b.combination] - POKER_RANKINGS[a.combination]); // sort by high combination
  let filterOnEqual = arr.filter(item => item.combination === arr[0].combination); // will leave only players with high combination
  const maxComb = filterOnEqual[0].combination;

  const needKicker = [HighCard, OnePair, TwoPair, ThreeofaKind, FourofaKind, Flush];

  if (filterOnEqual.length !== 1 && maxComb !== RoyalFlush) {
    const compareHighHand = highHand(filterOnEqual, "bestHand");

    if (compareHighHand.length !== 1) {
      if (maxComb === FullHouse) return highHand(filterOnEqual, "bestHand", 3); // if set of full house that players had was equal, will check their pair.
      if (maxComb === TwoPair) return checkKicker(compareHighHand); // if high pair that players had was equal, will check low pair and then fifth card (kicker).
      if (needKicker.includes(maxComb)) return checkKicker(compareHighHand); // checks kicker in combs where it needed. Will return few players only if board kicker is higher.
    }

    return compareHighHand; // will return if case is straight/flush combs, or one winner was detected by higher card in his comb.
  }
  return filterOnEqual; // will return this if only one player has high combination or royal flush detected on board.
}

function highHand(arr: ICombination[], option: "bestHand" | "fiveCards", index = 0) {
  const sortByHigh = [...arr].sort((a, b) => b[option][index].value - a[option][index].value);
  // sort by highest card in the hand by default, but we can use other index instead.

  let filterHigh = sortByHigh.filter(item => item[option][index].value === sortByHigh[0][option][index].value);
  // leaves only those players who have high hand, works perfectly for 5 card combination and sorting with 0 index
  // for checking kickers also works great, but need to be used inside loop to check every possible kicker step by step

  return filterHigh;
}

function checkKicker(arr: ICombination[]) {
  let winners = arr;

  for (let i = 1; i < 5; i++) { // starts from 1 because if this function runs we know that first high card already was checked before
    if (winners.length === 1) return winners;
    winners = highHand(winners, "fiveCards", i);
  }
  return winners;
}