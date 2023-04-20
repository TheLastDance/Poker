import { IHand, ICombination, valueNumber, CombinationEnum } from "../types";

const { RoyalFlush, HighCard, Flush, FullHouse, FourofaKind, ThreeofaKind, TwoPair, Straight, StraightFlush, OnePair } = CombinationEnum;

// This function is going to take as an argument a concatenated array of players hand and a board + an id of player for easier calculations in game logic.
// With this function we can check a combination at any time, at pre-flop, flop, turn or river. It will be useful for Bot AI.
export function checkCombination(cards: IHand[], id: number, betSum: number): ICombination {
  const values = cards.map(card => ({ ...card, value: Number(card.value) })).sort((a, b) => b.value - a.value);
  const suits = [...values].sort((a, b) => a.suit === b.suit ? 0 : a.suit < b.suit ? -1 : 1); // should be used where we need check by suit (flush/straight flush)
  // console.log(values)
  // console.log(suits)

  // Check for Straight flush
  const isStarightFlush = checkStraightFlush(suits);

  // Check for flush royale
  const check = typeof isStarightFlush === "object" ? isStarightFlush.filter(item => item.value === 14).length === 1 : false;
  const isFlushRoyale = isStarightFlush && check;

  const isFourOfAKind = checkIdentical(values, "value", 4);
  const isFullHouse = checkFullHouseOrTwoPairs(values, 3);
  const isFlush = checkIdentical(suits, "suit", 5);
  const isStraight = checkStraight(values);
  const isThreeOfAKind = checkIdentical(values, "value", 3);
  const isTwoPairs = checkFullHouseOrTwoPairs(values);
  const isOnePair = checkIdentical(values, "value", 2);
  const isHighCard = [values[0]];

  const fiveCards = (arr: valueNumber[]) => arr.concat(values.filter(item => !arr.includes(item)).slice(0, 5 - arr.length)); // for kicker, 5-arr.length if we need 5 cards comb
  // kicker could be from board in one pair, two pairs, and so on. concat with arr if we need whole 5 cards comb and not only possible kicker cards.

  if (isFlushRoyale) {
    return { combination: RoyalFlush, bestHand: isStarightFlush, fiveCards: isStarightFlush, id: id, betSum: betSum };
  }

  if (isStarightFlush) {
    return { combination: StraightFlush, bestHand: isStarightFlush, fiveCards: isStarightFlush, id: id, betSum: betSum };
  }

  if (isFourOfAKind) {
    return { combination: FourofaKind, bestHand: isFourOfAKind, fiveCards: fiveCards(isFourOfAKind), id: id, betSum: betSum };
  }

  if (isFullHouse) {
    return { combination: FullHouse, bestHand: isFullHouse, fiveCards: isFullHouse, id: id, betSum: betSum };
  }

  if (isFlush) {
    return { combination: Flush, bestHand: isFlush, fiveCards: isFlush, id: id, betSum: betSum };
  }

  if (isStraight) {
    return { combination: Straight, bestHand: isStraight, fiveCards: isStraight, id: id, betSum: betSum };
  }

  if (isThreeOfAKind) {
    return { combination: ThreeofaKind, bestHand: isThreeOfAKind, fiveCards: fiveCards(isThreeOfAKind), id: id, betSum: betSum };
  }

  if (isTwoPairs) {
    return { combination: TwoPair, bestHand: isTwoPairs, fiveCards: fiveCards(isTwoPairs), id: id, betSum: betSum };
  }

  if (isOnePair) {
    return { combination: OnePair, bestHand: isOnePair, fiveCards: fiveCards(isOnePair), id: id, betSum: betSum };
  }

  // If no other combination is found, return High card
  return { combination: HighCard, bestHand: isHighCard, fiveCards: fiveCards(isHighCard), id: id, betSum: betSum };
}

function checkIdentical<T extends keyof IHand>(arr: valueNumber[], option: T, num: number) {
  let countSuits = [arr[0]];

  for (let i = 0; i < arr.length - 1; i++) {
    if (arr[i][option] === arr[i + 1][option]) countSuits.push(arr[i + 1]);
    if (countSuits.length === num) return countSuits;
    if (arr[i][option] !== arr[i + 1][option]) countSuits = [arr[i + 1]];
  }

  return false;
} // checks identical cards by suit or value. 
// first arg for an array (need to use values for value checks and suits for flush), second - property which should be checked, third - number of same values/suits.

function checkFullHouseOrTwoPairs(arr: valueNumber[], num: 2 | 3 = 2) {
  let countSuits: valueNumber[] = [];
  const isSet = checkIdentical(arr, "value", num);
  if (isSet) {
    const newArr = arr.filter(item => item.value !== isSet[0].value);
    const isPair = checkIdentical(newArr, "value", 2);
    countSuits = countSuits.concat(isSet);
    if (isPair) {
      countSuits = countSuits.concat(isPair);
      return countSuits;
    }
  }
  return false;
} // first checks for identical values by default 2 values (for two pairs), for full house we can set this arg to 3.
// than if we found in hand 3 or 2 same values we will continue checking and do the same thing to check if we have in hand one more pair.

function checkStraight(arr: valueNumber[]) {
  const isAce = arr.some(item => item.value === 14);
  let loop = straightLoop(arr);
  if (loop) return loop;

  if (isAce) {
    const aceLow = arr.map(item => item.value === 14 ? ({ ...item, value: 1 }) : item).sort((a, b) => b.value - a.value);
    let aceLoop = straightLoop(aceLow);
    if (aceLoop) return aceLoop;
  }

  return false;
} // if we have in our potential combination card with value 14 (ACE) we will check for possible low straight, but firstly we will check for higher straight,
// if we have higher straight we don't need to check low straight. Ace will have value 14 by default, and only in we would have low straight thatn it will be converted to value 1.


function straightLoop(arr: valueNumber[]) {
  let countSuits = [arr[0]];
  for (let i = 0; i < arr.length - 1; i++) {
    if (arr[i].value === arr[i + 1].value + 1) countSuits.push(arr[i + 1]);
    if (countSuits.length === 5) return countSuits;
    if (arr[i].value !== arr[i + 1].value + 1 && arr[i].value !== arr[i + 1].value) countSuits = [arr[i + 1]];
  }
} // loop for straight, uses only value checking unlike to straight flush loop.

function checkStraightFlush(arr: valueNumber[]) {
  const isAce = arr.some(item => item.value === 14);
  let loop = straightFlushLoop(arr);
  if (loop) return loop;

  if (isAce) {
    const aceLow = arr.map(item => item.value === 14 ? ({ ...item, value: 1 }) : item).sort((a, b) => b.value - a.value);
    let aceLoop = straightFlushLoop(aceLow);
    if (aceLoop) return aceLoop;
  }

  return false;
} // needs to be used with suits value sorted array to check the suits and values correctly. 

function straightFlushLoop(arr: valueNumber[]) {
  let countSuits = [arr[0]];
  for (let i = 0; i < arr.length - 1; i++) {
    if (arr[i].value === arr[i + 1].value + 1 && arr[i].suit === arr[i + 1].suit) countSuits.push(arr[i + 1]);
    if (countSuits.length === 5) return countSuits;
    if (arr[i].value !== arr[i + 1].value + 1 || arr[i].suit !== arr[i + 1].suit) countSuits = [arr[i + 1]];
  }
} // checks values like previous straight functions, but also checks that suits are same.


