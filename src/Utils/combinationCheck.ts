import { IHand, ICombination, valueNumber, CombinationEnum } from "../types";

const { RoyalFlush, HighCard, Flush, FullHouse, FourofaKind, ThreeofaKind, TwoPair, Straight, StraightFlush, OnePair } = CombinationEnum;

export function checkCombination(cards: IHand[]): ICombination {
  const values = cards.map(card => ({ ...card, value: Number(card.value) })).sort((a, b) => b.value - a.value);
  const suits = [...values].sort((a, b) => a.suit === b.suit ? 0 : a.suit < b.suit ? -1 : 1); // should be used where we need check by suit (flush/straight flush)
  console.log(values)
  console.log(suits)

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

  const fiveCards = (arr: valueNumber[]) => arr.concat(values.filter(item => !arr.includes(item)).slice(0, 5 - arr.length)); //kicker 5-arr.length if we need 5 cards and not kicker
  // kicker could be from board in one pair, two pairs, and so on. concat with arr if we need whole 5 cards comb


  if (isFlushRoyale) {
    return { combination: RoyalFlush, bestHand: isStarightFlush, fiveCards: isStarightFlush };
  }

  if (isStarightFlush) {
    return { combination: StraightFlush, bestHand: isStarightFlush, fiveCards: isStarightFlush };
  }

  // Check for four of a kind
  if (isFourOfAKind) {
    return { combination: FourofaKind, bestHand: isFourOfAKind, fiveCards: fiveCards(isFourOfAKind) };
  }

  // Check for full house
  if (isFullHouse) {
    return { combination: FullHouse, bestHand: isFullHouse, fiveCards: isFullHouse };
  }

  // Check for flush
  if (isFlush) {
    return { combination: Flush, bestHand: isFlush, fiveCards: isFlush };
  }

  // Check for straight
  if (isStraight) {
    return { combination: Straight, bestHand: isStraight, fiveCards: isStraight };
  }

  // Check for three of a kind
  if (isThreeOfAKind) {
    return { combination: ThreeofaKind, bestHand: isThreeOfAKind, fiveCards: fiveCards(isThreeOfAKind) };
  }

  // Check for two pairs
  if (isTwoPairs) {
    return { combination: TwoPair, bestHand: isTwoPairs, fiveCards: fiveCards(isTwoPairs) };
  }

  // Check for one pair
  if (isOnePair) {
    return { combination: OnePair, bestHand: isOnePair, fiveCards: fiveCards(isOnePair) };
  }

  // If no other combination is found, return High card
  return { combination: HighCard, bestHand: isHighCard, fiveCards: fiveCards(isHighCard) };
}

function checkIdentical<T extends keyof IHand>(arr: valueNumber[], option: T, num: number) {
  let countSuits = [arr[0]];

  for (let i = 0; i < arr.length - 1; i++) {
    if (arr[i][option] === arr[i + 1][option]) countSuits.push(arr[i + 1]);
    if (countSuits.length === num) return countSuits;
    if (arr[i][option] !== arr[i + 1][option]) countSuits = [arr[i + 1]];
  }

  return false;
}

function checkFullHouseOrTwoPairs(arr: valueNumber[], num = 2) {
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
}

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
}

function straightLoop(arr: valueNumber[]) {
  let countSuits = [arr[0]];
  for (let i = 0; i < arr.length - 1; i++) {
    if (arr[i].value === arr[i + 1].value + 1) countSuits.push(arr[i + 1]);
    if (countSuits.length === 5) return countSuits;
    if (arr[i].value !== arr[i + 1].value + 1 && arr[i].value !== arr[i + 1].value) countSuits = [arr[i + 1]];
  }
}

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
}

function straightFlushLoop(arr: valueNumber[]) {
  let countSuits = [arr[0]];
  for (let i = 0; i < arr.length - 1; i++) {
    if (arr[i].value === arr[i + 1].value + 1 && arr[i].suit === arr[i + 1].suit) countSuits.push(arr[i + 1]);
    if (countSuits.length === 5) return countSuits;
    if (arr[i].value !== arr[i + 1].value + 1 || arr[i].suit !== arr[i + 1].suit) countSuits = [arr[i + 1]];
  }
}


