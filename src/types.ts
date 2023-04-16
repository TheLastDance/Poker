import { PixiRef, Container } from "@pixi/react";

export type IContainer = PixiRef<typeof Container>;

export interface IAppSizes {
  appHeight: number;
  appWidth: number;
};

export interface IHand {
  value: string;
  suit: string;
} // type for testing, will remove in future I think.

export interface ICombination {
  combination: CombinationEnum;
  bestHand: valueNumber[];
  fiveCards: valueNumber[];
  id: number;
}

export type valueNumber = Omit<IHand, "value"> & { value: number; };

export enum TurnsEnum {
  fold = "fold",
  call = "call",
  check = "check",
  raise = "raise",
  allIn = "All-in"
}

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

export interface IDataStore {
  cards: ICardsForPlay[];
  cardsForPlay: ICardsForPlay[];
  handsCount: number;
  assetsLoaded: boolean;
  selectCards(): ICardsForPlay[];
  onProgress(progress: number): number;
  fetch(): void;
  shuffleArr(): void;
  handIncrement(): void;
}

export interface IFormStore {
  isStarted: boolean;
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
  turn: TurnsEnum | false;
  isBot: boolean;
  id: number;
  dataStore: IDataStore;
  formStore: IFormStore;
  animation: boolean;
  runAnimation: () => void;
  finishAnimation: () => void;
  clearStates: () => void;
  cardDistribution: () => void;
  winner: () => void;
  splitPot: (length: number) => void;
  ai: () => void;
  callCalculation: () => void;
  allInCalculation: () => void;
  raiseCalculation: () => void;
  blindsCalculation: () => void;
  combination: () => ICombination;
}

export interface IPlayer extends IBot {
  //raiseAmount: string;
  raiseInput: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

export interface IGameStore {
  players: IBot[] | IPlayer[];
  bigBlindCost: number;
  smallBlindCost: number;
  bank: number;
  round: string;
  maxBet: number;
  formStore: IFormStore;
  dataStore: IDataStore;
}

