//@ts-nocheck
// need no check, because tests were implemented much earlier than I changed type in these functions, but still don't need other properties for this test, they work fine.

import { checkWinner } from "../Utils/winnerCheck";
import { checkCombination } from "../Utils/combinationCheck";

let TEST_1_PLAYER_1 = [
  { value: "12", suit: "CLUBS" },
  { value: "14", suit: "HEARTS" },
  { value: "12", suit: "DIAMONDS" },
  { value: "4", suit: "DIAMONDS" },
  { value: "14", suit: "DIAMONDS" },
  { value: "9", suit: "DIAMONDS" },
  { value: "5", suit: "CLUBS" }
]; // data to test check winner from some players

let TEST_1_PLAYER_2 = [
  { value: "12", suit: "CLUBS" },
  { value: "14", suit: "HEARTS" },
  { value: "12", suit: "DIAMONDS" },
  { value: "2", suit: "DIAMONDS" },
  { value: "14", suit: "DIAMONDS" },
  { value: "9", suit: "DIAMONDS" },
  { value: "2", suit: "CLUBS" }
];

let TEST_1_PLAYER_3 = [
  { value: "12", suit: "CLUBS" },
  { value: "14", suit: "HEARTS" },
  { value: "12", suit: "DIAMONDS" },
  { value: "7", suit: "DIAMONDS" },
  { value: "14", suit: "DIAMONDS" },
  { value: "9", suit: "DIAMONDS" },
  { value: "7", suit: "CLUBS" }
];

let TEST_2_PLAYER_1 = [
  { value: "10", suit: "DIAMONDS" },
  { value: "11", suit: "DIAMONDS" },
  { value: "12", suit: "DIAMONDS" },
  { value: "13", suit: "DIAMONDS" },
  { value: "2", suit: "CLUBS" },
  { value: "10", suit: "HEARTS" },
  { value: "14", suit: "DIAMONDS" }
];

let TEST_2_PLAYER_2 = [
  { value: "10", suit: "DIAMONDS" },
  { value: "11", suit: "DIAMONDS" },
  { value: "12", suit: "DIAMONDS" },
  { value: "13", suit: "DIAMONDS" },
  { value: "2", suit: "CLUBS" },
  { value: "9", suit: "SPADES" },
  { value: "14", suit: "DIAMONDS" }
];

let TEST_3_PLAYER_1 = [
  { value: "10", suit: "DIAMONDS" },
  { value: "11", suit: "DIAMONDS" },
  { value: "13", suit: "DIAMONDS" },
  { value: "13", suit: "CLUBS" },
  { value: "2", suit: "CLUBS" },
  { value: "14", suit: "HEARTS" },
  { value: "13", suit: "HEARTS" }
];

let TEST_3_PLAYER_2 = [
  { value: "10", suit: "DIAMONDS" },
  { value: "11", suit: "DIAMONDS" },
  { value: "13", suit: "DIAMONDS" },
  { value: "13", suit: "SPADES" },
  { value: "2", suit: "CLUBS" },
  { value: "9", suit: "SPADES" },
  { value: "13", suit: "HEARTS" }
];

let TEST_4_PLAYER_1 = [
  { value: "10", suit: "DIAMONDS" },
  { value: "11", suit: "DIAMONDS" },
  { value: "12", suit: "DIAMONDS" },
  { value: "13", suit: "DIAMONDS" },
  { value: "2", suit: "CLUBS" },
  { value: "9", suit: "DIAMONDS" },
  { value: "13", suit: "HEARTS" }
];

let TEST_4_PLAYER_2 = [
  { value: "10", suit: "DIAMONDS" },
  { value: "11", suit: "DIAMONDS" },
  { value: "12", suit: "DIAMONDS" },
  { value: "9", suit: "DIAMONDS" },
  { value: "2", suit: "CLUBS" },
  { value: "8", suit: "DIAMONDS" },
  { value: "13", suit: "HEARTS" }
];

let TEST_5_PLAYER_1 = [
  { value: "10", suit: "DIAMONDS" },
  { value: "11", suit: "DIAMONDS" },
  { value: "12", suit: "DIAMONDS" },
  { value: "2", suit: "CLUBS" },
  { value: "9", suit: "CLUBS" },
  { value: "6", suit: "DIAMONDS" },
  { value: "5", suit: "DIAMONDS" }
];

let TEST_5_PLAYER_2 = [
  { value: "10", suit: "DIAMONDS" },
  { value: "11", suit: "DIAMONDS" },
  { value: "12", suit: "DIAMONDS" },
  { value: "2", suit: "CLUBS" },
  { value: "9", suit: "CLUBS" },
  { value: "9", suit: "HEARTS" },
  { value: "8", suit: "DIAMONDS" }
];

let TEST_6_PLAYER_1 = [
  { value: "10", suit: "DIAMONDS" },
  { value: "11", suit: "DIAMONDS" },
  { value: "12", suit: "DIAMONDS" },
  { value: "2", suit: "CLUBS" },
  { value: "4", suit: "CLUBS" },
  { value: "14", suit: "CLUBS" },
  { value: "6", suit: "CLUBS" }
];

let TEST_6_PLAYER_2 = [
  { value: "10", suit: "DIAMONDS" },
  { value: "11", suit: "DIAMONDS" },
  { value: "12", suit: "DIAMONDS" },
  { value: "2", suit: "CLUBS" },
  { value: "4", suit: "CLUBS" },
  { value: "7", suit: "HEARTS" },
  { value: "14", suit: "DIAMONDS" }
];

let TEST_7_PLAYER_1 = [
  { value: "14", suit: 'DIAMONDS' },
  { value: "14", suit: 'HEARTS' },
  { value: "13", suit: 'SPADES' },
  { value: "11", suit: 'DIAMONDS' },
  { value: "9", suit: 'DIAMONDS' }
];

let TEST_7_PLAYER_2 = [
  { value: "14", suit: 'DIAMONDS' },
  { value: "14", suit: 'HEARTS' },
  { value: "13", suit: 'SPADES' },
  { value: "10", suit: 'HEARTS' },
  { value: "9", suit: 'DIAMONDS' }
];

let TEST_8_PLAYER_1 = [
  { value: "13", suit: 'DIAMONDS' },
  { value: "11", suit: 'DIAMONDS' },
  { value: "9", suit: 'DIAMONDS' },
  { value: "8", suit: 'DIAMONDS' },
  { value: "4", suit: 'DIAMONDS' },
]

let TEST_8_PLAYER_2 = [
  { value: "13", suit: 'DIAMONDS' },
  { value: "11", suit: 'DIAMONDS' },
  { value: "9", suit: 'DIAMONDS' },
  { value: "4", suit: 'DIAMONDS' },
  { value: "3", suit: 'DIAMONDS' },
]

describe("Testing winner checker", () => {

  it("split pot with kicker on a board (two pairs)", () => {
    let players = [checkCombination(TEST_1_PLAYER_1, 0, 0), checkCombination(TEST_1_PLAYER_2, 1, 0), checkCombination(TEST_1_PLAYER_3, 2, 0)];
    let test = checkWinner(players);

    expect(test).toEqual([players[0], players[1], players[2]])
  })

  it("royal flush check", () => {
    let players = [checkCombination(TEST_2_PLAYER_1, 0, 0), checkCombination(TEST_2_PLAYER_2, 1, 0)];
    let test = checkWinner(players);

    expect(test).toEqual([players[0], players[1]])
  })

  it("first player wins with high kicker in hand (set)", () => {
    let players = [checkCombination(TEST_3_PLAYER_1, 0, 0), checkCombination(TEST_3_PLAYER_2, 1, 0)];
    let test = checkWinner(players);

    expect(test).toEqual([players[0]]);
  })

  it("first player wins with higher straight flush", () => {
    let players = [checkCombination(TEST_4_PLAYER_1, 0, 0), checkCombination(TEST_4_PLAYER_2, 1, 0)];
    let test = checkWinner(players);

    expect(test).toEqual([players[0]]);
  })

  it("first player wins with higher combination (flush vs straight)", () => {
    let players = [checkCombination(TEST_5_PLAYER_1, 0, 0), checkCombination(TEST_5_PLAYER_2, 1, 0)];
    let test = checkWinner(players);

    expect(test).toEqual([players[0]]);
  })

  it("second player wins with higher second kicker (High card, 5th card higher)", () => {
    let players = [checkCombination(TEST_6_PLAYER_1, 0, 0), checkCombination(TEST_6_PLAYER_2, 1, 0)];
    let test = checkWinner(players);

    expect(test).toEqual([players[1]]);
  })

  it("kicker", () => {
    let players = [checkCombination(TEST_7_PLAYER_1, 0, 0), checkCombination(TEST_7_PLAYER_2, 1, 0)];
    let test = checkWinner(players);

    expect(test).toEqual([players[0]]);
  })

  it("High Flush", () => {
    let players = [checkCombination(TEST_8_PLAYER_1, 0, 0), checkCombination(TEST_8_PLAYER_2, 1, 0)];
    let test = checkWinner(players);

    expect(test).toEqual([players[0]]);
  })
})