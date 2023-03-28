
export interface IHand {
  value: string;
  suit: string;
} // type for testing, will remove in future I think.

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

export interface ICardsForPlay {
  image: string;
  value: string;
  suit: string;
}

export interface ICard {
  code: string;
  image: string;
  images: {
    svg: string;
    png: string;
  };
  value: string;
  suit: string;
}

export interface IDeck {
  success: boolean;
  cards: ICard[];
  deck_id: string;
  remaining: number;
}

export interface IDataStore {
  cards: ICardsForPlay[];
  cardsForPlay: ICardsForPlay[];
  handsCount: number;
  selectCards(): ICardsForPlay[];
  fetch(): void;
  shuffleArr(): void;
  handIncrement(): void;
}

export interface IFormStore {
  isStarted: boolean
  name: string;
  opponents: string;
  playerBank: string;
  start(e: React.FormEvent<HTMLFormElement>): void;
  changeName(e: React.ChangeEvent<HTMLInputElement>): void;
  chooseOpponents(e: React.ChangeEvent<HTMLSelectElement>): void;
  chooseBank(e: React.ChangeEvent<HTMLInputElement>): void;
}

export interface IBot {
  hand: ICardsForPlay[];
  name: string;
  stack: number;
  bet: number;
  bigBlind: boolean;
  smallBlind: boolean;
  isDiller: boolean;
  isMoving: boolean;
  turn: string | false;
  isBot: boolean;
  id: number;
  dataStore: IDataStore;
  formStore: IFormStore;
  clearStates: () => void;
  cardDistribution: () => void;
  winner: () => void;
  ai: () => void;
}

export interface IGameStore {
  players: IBot[];
  bigBlindCost: number;
  smallBlindCost: number;
  bank: number;
  round: string;
  maxBet: number;
  formStore: IFormStore;
  dataStore: IDataStore;
}

