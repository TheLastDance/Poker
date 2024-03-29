import { makeAutoObservable, runInAction, reaction, action } from "mobx";
import { ICardsForPlay, IDataStore, ICard, IFetchedDeck } from "../types";
import { shuffle } from "../Utils/shuffleArray";
import { Assets } from "pixi.js";
import { assetsUrls, assetsNames } from "../data/assetsData";
import clicker from "../assets/ace.png";
import { shuffle_sound, music_sound } from "../data/assetsData";

const CARD_VALUES: { [key: string]: string; } = {
  ACE: "14",
  KING: "13",
  QUEEN: "12",
  JACK: "11"
}; // This api returns values like "KING", "JACK" so for comb checking I will change that values to value of rankings.

class Data implements IDataStore {
  cards: ICardsForPlay[] = [];
  cardsForPlay: ICardsForPlay[] = [];
  handsCount = 0;
  assetsLoaded = false;
  progress = 0;
  startCanvasRender = false;
  isSoundOn = true;
  isMusicOn = true;
  startCardsAnimation = false;

  constructor() {
    makeAutoObservable(this, {
      handleSound: action.bound,
      handleMusic: action.bound,
      fetch: action.bound,
    });
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
        this.startCardsAnimation = false;
      }
    );
    reaction(
      () => this.startCardsAnimation,
      () => {
        if (this.startCardsAnimation && this.isSoundOn) shuffle_sound.play();
      }
    );
    reaction(
      () => this.isMusicOn,
      () => {
        if (!this.isMusicOn) {
          music_sound.pause();
        } else {
          music_sound.play();
        }
      }
    )
  }

  handleSound() {
    this.isSoundOn = !this.isSoundOn;
  }

  handleMusic() {
    this.isMusicOn = !this.isMusicOn;
  }

  selectCards() {
    this.startCardsAnimation = true;
    return this.cardsForPlay.splice(0, 2);
  } // will distribute cards for players

  changeValue(value: string) {
    const included: boolean = Object.keys(CARD_VALUES).includes(value);

    if (included) {
      return CARD_VALUES[value];
    }
    return value;
  } // value changing for api cards.

  onProgress = (progress: number): number => {
    //console.log("progress", progress);
    this.progress = progress;
    return progress;
  }

  async fetch() {
    try {
      let arr = [];
      Assets.add(`loader`, clicker);
      await Assets.load("loader", () => runInAction(() => { this.startCanvasRender = true }));

      const response = await fetch('https://deckofcardsapi.com/api/deck/new/draw/?count=52');
      const json: IFetchedDeck = await response.json() as IFetchedDeck;
      runInAction(() => {
        this.cards = json.cards.map((item: ICard) => ({ value: this.changeValue(item.value), suit: item.suit, image: item.image }));
      });

      for (let i = 0; i < this.cards.length; i++) {
        Assets.add(`card-${i}`, this.cards[i].image);
        arr.push(`card-${i}`);
      } // assets preload for fetched deck of card

      for (let i = 0; i < assetsUrls.length; i++) {
        Assets.add(assetsNames[i], assetsUrls[i]);
        arr.push(assetsNames[i]);
      } // preload for all other assets

      await Assets.load(arr, this.onProgress); // Preload all textures using pixiJS

    } catch (err) {
      // eslint-disable-next-line
      console.log(err);
    } finally {
      runInAction(() => { this.assetsLoaded = true; });
    }
  }

  shuffleArr() {
    this.cardsForPlay = shuffle([...this.cards]);
  } // cards shuffler

  handIncrement() {
    this.handsCount = this.handsCount + 1;
  } // will count played hands, for now need to test things and trigger changes by button. Don't need this method anymore, will delete soon.
}

const dataStore = new Data();
export default dataStore;