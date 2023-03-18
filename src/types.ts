
export interface IHand {
  value: string;
  suit: string;
}

export interface ICombination {
  combination: CombinationEnum;
  bestHand: valueNumber[];
  fiveCards: valueNumber[];
}

export type valueNumber = Omit<IHand, "value"> & { value: number; };

export enum CombinationEnum {
  RoyalFlush = "Royal Flush",
  StraightFlush = "Straight Flush",
  FourofaKind = "Four of a Kind",
  FullHouse = "Full House",
  Flush = "Flush",
  Straight = "Straight",
  ThreeofaKind = "Three of a Kind",
  TwoPair = "Two Pair",
  OnePair = "One Pair",
  HighCard = "High Card",
}
