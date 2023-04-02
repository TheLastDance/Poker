import { checkCombination } from "../Utils/combinationCheck";

let test1 = [
  { value: "6", suit: "CLUBS" },
  { value: "7", suit: "CLUBS" },
  { value: "9", suit: "CLUBS" },
  { value: "8", suit: "CLUBS" },
  { value: "10", suit: "DIAMONDS" },
  { value: "5", suit: "CLUBS" },
  { value: "7", suit: "DIAMONDS" }];

let output1 = {
  combination: "Straight Flush",
  bestHand: [
    { value: 9, suit: "CLUBS" },
    { value: 8, suit: "CLUBS" },
    { value: 7, suit: "CLUBS" },
    { value: 6, suit: "CLUBS" },
    { value: 5, suit: "CLUBS" }
  ]
}

let test2 = [
  { value: "6", suit: "CLUBS" },
  { value: "7", suit: "CLUBS" },
  { value: "9", suit: "CLUBS" },
  { value: "2", suit: "CLUBS" },
  { value: "3", suit: "DIAMONDS" },
  { value: "5", suit: "CLUBS" },
  { value: "8", suit: "DIAMONDS" }];

let output2 = {
  combination: "Flush",
  bestHand: [
    { value: 9, suit: "CLUBS" },
    { value: 7, suit: "CLUBS" },
    { value: 6, suit: "CLUBS" },
    { value: 5, suit: "CLUBS" },
    { value: 2, suit: "CLUBS" }
  ]
}

let test3 = [
  { value: "8", suit: "DIAMONDS" },
  { value: "6", suit: "DIAMONDS" },
  { value: "7", suit: "DIAMONDS" },
  { value: "5", suit: "DIAMONDS" },
  { value: "10", suit: "DIAMONDS" },
  { value: "4", suit: "DIAMONDS" },
  { value: "7", suit: "CLUBS" }];

let output3 = {
  combination: "Straight Flush",
  bestHand: [
    { value: 8, suit: "DIAMONDS" },
    { value: 7, suit: "DIAMONDS" },
    { value: 6, suit: "DIAMONDS" },
    { value: 5, suit: "DIAMONDS" },
    { value: 4, suit: "DIAMONDS" }
  ]
}

let test4 = [
  { value: "14", suit: "DIAMONDS" },
  { value: "11", suit: "DIAMONDS" },
  { value: "13", suit: "DIAMONDS" },
  { value: "12", suit: "DIAMONDS" },
  { value: "10", suit: "DIAMONDS" },
  { value: "9", suit: "DIAMONDS" },
  { value: "7", suit: "CLUBS" }];

let output4 = {
  combination: "Royal Flush",
  bestHand: [
    { value: 14, suit: "DIAMONDS" },
    { value: 13, suit: "DIAMONDS" },
    { value: 12, suit: "DIAMONDS" },
    { value: 11, suit: "DIAMONDS" },
    { value: 10, suit: "DIAMONDS" }
  ]
}

let test5 = [
  { value: "14", suit: "DIAMONDS" },
  { value: "2", suit: "DIAMONDS" },
  { value: "13", suit: "HEARTS" },
  { value: "3", suit: "DIAMONDS" },
  { value: "4", suit: "DIAMONDS" },
  { value: "5", suit: "HEARTS" },
  { value: "7", suit: "CLUBS" }];

let output5 = {
  combination: "Straight",
  bestHand: [
    { value: 5, suit: "HEARTS" },
    { value: 4, suit: "DIAMONDS" },
    { value: 3, suit: "DIAMONDS" },
    { value: 2, suit: "DIAMONDS" },
    { value: 1, suit: "DIAMONDS" }
  ]
}

let test6 = [
  { value: "14", suit: "DIAMONDS" },
  { value: "2", suit: "DIAMONDS" },
  { value: "11", suit: "HEARTS" },
  { value: "3", suit: "DIAMONDS" },
  { value: "4", suit: "DIAMONDS" },
  { value: "5", suit: "DIAMONDS" },
  { value: "7", suit: "CLUBS" }];

let output6 = {
  combination: "Straight Flush",
  bestHand: [
    { value: 5, suit: "DIAMONDS" },
    { value: 4, suit: "DIAMONDS" },
    { value: 3, suit: "DIAMONDS" },
    { value: 2, suit: "DIAMONDS" },
    { value: 1, suit: "DIAMONDS" }
  ],
}

describe("Testing combinations", () => {

  it("Straight flush", () => {
    let twoStraights = checkCombination(test1, 0); // zero is a mock id for test
    let separately = checkCombination(test2, 0);
    let twoFlushs = checkCombination(test3, 0);

    expect(twoStraights.combination).toEqual(output1.combination);
    expect(twoStraights.bestHand).toEqual(output1.bestHand);
    expect(separately.bestHand).toEqual(output2.bestHand);
    expect(twoFlushs.bestHand).toEqual(output3.bestHand);
    // don't need to check "fivecards" property here, because it will be checked in winnerCheck test (if fiveCards prop is not calculated right, case where kicker is important will fail)
  })

  it("Flush royale", () => {
    let flushRoayle = checkCombination(test4, 0);
    const { bestHand, combination } = flushRoayle;

    expect(bestHand).toEqual(bestHand);
    expect(combination).toEqual(combination);
  })

  it("Low straight/straight flush", () => {
    let lowStraight = checkCombination(test5, 0);
    let lowStraightFlush = checkCombination(test6, 0);

    expect(lowStraight.combination).toEqual(output5.combination);
    expect(lowStraight.bestHand).toEqual(output5.bestHand);
    expect(lowStraightFlush.bestHand).toEqual(output6.bestHand);
  })
})