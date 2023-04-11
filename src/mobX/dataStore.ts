import { makeAutoObservable, runInAction, reaction } from "mobx";
import { ICardsForPlay, IDataStore, IDeck, ICard } from "../types";
import { shuffle } from "../Utils/shuffleArray";
import { Assets } from "pixi.js";
// import { checkCombination } from "../Utils/combinationCheck";

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
  // arrayOfPlayers = [checkCombination(this.yourCards1), checkCombination(this.yourCards2), checkCombination(this.yourCards3)];

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

  onPropgress(progress: number) {
    console.log("progress", progress);
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
      arr.push("background", "https://cdn.leonardo.ai/users/592f9706-6d24-4367-aed2-7a96c70365b9/generations/3ebcba18-4fc6-4a51-811f-1cede109dcbe/Leonardo_Diffusion_Generate_for_me_poker_table_background_imag_3.jpg");
      await Assets.load(arr, this.onPropgress); // Preload all textures using pixiJS
    } catch (err) {
      console.log(err);
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