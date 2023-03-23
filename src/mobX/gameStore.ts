import { makeAutoObservable, reaction } from "mobx";
import formStore from "./formStore";
import { Bot } from "./botStore";
import dataStore from "./dataStore";
import { IFormStore, IDataStore, IBot, IGameStore } from "../types";


class Game implements IGameStore {
  players: IBot[] = [];
  bigBlindCost = 2;
  smallBlindCost = 1;
  bank = 0;
  isRunning = false;
  formStore: IFormStore;
  dataStore: IDataStore;

  constructor() {
    makeAutoObservable(this);
    this.formStore = formStore;
    this.dataStore = dataStore;
    reaction(
      () => this.formStore.isStarted,
      () => {
        this.addPlayers();
        this.blind();
      }
    );
    reaction(
      () => this.players,
      () => {
        this.isRunning = true;
      }
    );
    reaction(
      () => this.dataStore.handsCount,
      () => {
        this.blind();
        this.blindRising();
      }
    );
  }

  addPlayers() {
    this.players = new Array(Number(this.formStore.opponents)).fill(0).map(() => new Bot());
  } // for now adds only bots in game, in future will add also a player.

  blindRising() {
    if (this.dataStore.handsCount % 10 === 0) {
      this.bigBlindCost = this.bigBlindCost * 2;
      this.smallBlindCost = this.smallBlindCost * 2;
    }
  } // will rise blinds after each 10 hands 

  blind() {
    const firstHand = this.players.every(item => !item.bigBlind);
    const random = Math.floor(Math.random() * (this.players.length - 1)) + 1;
    // will cause error if user will select 1 opponent, this is because I did not implement player yet. 
    // In future in the array of players will be minimum 2 persons, not just bots.

    if (firstHand) {
      if (random === this.players.length - 1) {
        this.players[0].isDiller = true;
      } else {
        this.players[random + 1].isDiller = true;
      }
      this.players[random].bigBlind = true;
      // this.players[random].stack -= this.bigBlindCost;
      this.players[random - 1].smallBlind = true;
      // this.players[random - 1].stack -= this.smallBlindCost;
    } else {
      const bigIndex = this.players.findIndex(item => item.bigBlind);
      const smallIndex = this.players.findIndex(item => item.smallBlind);
      const diller = this.players.findIndex(item => item.isDiller);

      this.players[bigIndex].bigBlind = false;
      this.players[smallIndex].smallBlind = false;
      this.players[diller].isDiller = false;

      if (diller === this.players.length - 1) {
        this.players[0].isDiller = true;
      } else {
        this.players[diller + 1].isDiller = true;
      }

      if (bigIndex === this.players.length - 1) {
        this.players[0].bigBlind = true;
        // this.players[0].stack -= this.bigBlindCost;
      } else {
        this.players[bigIndex + 1].bigBlind = true;
        // this.players[bigIndex + 1].stack -= this.bigBlindCost;
      }

      if (smallIndex === this.players.length - 1) {
        this.players[0].smallBlind = true;
        // this.players[0].stack -= this.smallBlindCost;
      } else {
        this.players[smallIndex + 1].smallBlind = true;
        // this.players[smallIndex + 1].stack -= this.smallBlindCost;
      }
    }
  }
}

// function test(arr: any, option: any) {
//   for (let i = 0; i < arr.length; i++) {
//     if (arr[i][option]) {
//       arr[i][option] = false;
//       if (i !== arr.length - 1) {
//         arr[i + 1][option] = true;
//       } else {
//         arr[0][option] = true;
//       }
//       break; // exit the loop after updating the big blind ask someone why it's happens
//     }
//   }
// }

const gameStore = new Game();
export default gameStore;