import { makeAutoObservable, reaction } from "mobx";
import dataStore from "./dataStore";
import formStore from "./formStore";
import gameStore from "./gameStore";
import { ICardsForPlay, IFormStore, IDataStore, IGameStore, IBot } from "../types";

let botNames = ["Mark", "Eduard", "Travis", "Anna", "Nelson", "Vinnie", "Nancy", "Bella"];


export class Bot implements IBot {
  hand: ICardsForPlay[] = [];
  name = this.randomName;
  stack = 0;
  bigBlind = false;
  smallBlind = false;
  isDiller = false;
  dataStore: IDataStore;
  formStore: IFormStore;
  gameStore: IGameStore;

  constructor() {
    makeAutoObservable(this);
    this.dataStore = dataStore;
    this.formStore = formStore;
    this.gameStore = gameStore;
    this.hand = this.dataStore.selectCards();
    this.stack = +this.formStore.playerBank;
    reaction(
      () => this.gameStore.isRunning,
      () => {
        this.payForBigBlind();
        this.payForSmallBlind();
      }
    ); // for first hand
    reaction(
      () => this.bigBlind,
      () => {
        this.payForBigBlind();
      }
    );
    reaction(
      () => this.smallBlind,
      () => {
        this.payForSmallBlind();
      }
    );
    reaction(
      () => this.dataStore.handsCount,
      () => {
        this.hand = this.dataStore.selectCards();
      } // takes cards
    );
  }

  payForBigBlind(): void {
    if (this.bigBlind) {
      this.stack -= this.gameStore.bigBlindCost;
      this.gameStore.bank += this.gameStore.bigBlindCost;
    }
  }

  payForSmallBlind(): void {
    if (this.smallBlind) {
      this.stack -= this.gameStore.smallBlindCost;
      this.gameStore.bank += this.gameStore.smallBlindCost;
    }
  } // small/big blinds calculation functions should separate functions, because after big blind always comes small and it will cause small blind calculation twice.

  get randomName(): string {
    const index: number = Math.floor(Math.random() * botNames.length);
    const name: string = botNames[index];
    botNames.splice(index, 1);
    return `Bot-${name}`;
  } // randomizes name of bot at the start of the game.
}

