import { makeAutoObservable, runInAction, reaction } from "mobx";
import { ICardsForPlay, IDataStore, ICard } from "../types";
import { shuffle } from "../Utils/shuffleArray";
import { Assets } from "pixi.js";
import bg3 from "./../assets/bg3.jpg";

const CARD_VALUES: { [key: string]: string; } = {
  "ACE": "14",
  "KING": "13",
  "QUEEN": "12",
  "JACK": "11"
}; // This api returns values like "KING", "JACK" so for comb checking I will change that values to value of rankings.

class Data implements IDataStore {
  cards: ICardsForPlay[] = [];
  cardsForPlay: ICardsForPlay[] = [];
  handsCount = 0;
  assetsLoaded = false;

  constructor() {
    makeAutoObservable(this);
    reaction(
      () => this.cards,
      () => {
        this.shuffleArr();
      }
    );
    reaction(
      () => this.handsCount,
      () => {
        this.shuffleArr();
      }
    ); // test for cards shuffler
  }

  selectCards() {
    return this.cardsForPlay.splice(0, 2);
  } // will distribute cards for players

  changeValue(value: string) {
    const included: boolean = Object.keys(CARD_VALUES).includes(value);

    if (included) {
      return CARD_VALUES[value];
    }
    return value;
  }

  onProgress(progress: number): number {
    console.log("progress", progress);
    return progress;
  }

  async fetch() {
    try {
      const response = await fetch('https://deckofcardsapi.com/api/deck/new/draw/?count=52');
      const json = await response.json();
      runInAction(() => {
        this.cards = json.cards.map((item: ICard) => ({ value: this.changeValue(item.value), suit: item.suit, image: item.image }));
      });
      let arr = [];
      for (let i = 0; i < this.cards.length; i++) {
        Assets.add(`${i}`, this.cards[i].image);
        arr.push(`${i}`);
      }
      Assets.add("background-1", bg3);
      arr.push("background-1");
      await Assets.load(arr, this.onProgress); // Preload all textures using pixiJS
    } catch (err) {
      console.log(err);
    } finally {
      runInAction(() => { this.assetsLoaded = true; });
    }
  } // fetch of experemental api with card deck for testing and rendering cards. 

  shuffleArr() {
    this.cardsForPlay = shuffle([...this.cards]);
  } // cards shuffler

  handIncrement() {
    this.handsCount = this.handsCount + 1;
  } // will count played hands, for now need to test things and trigger changes by button.
}

const dataStore = new Data();
export default dataStore;