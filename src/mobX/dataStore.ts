import { makeAutoObservable, runInAction, reaction } from "mobx";
import { IHand } from "../types";
import { shuffle } from "../Utils/shuffleArray";
import { checkCombination } from "../Utils/combinationCheck";

interface ICard {
  code: string;
  image: string;
  images: {
    svg: string;
    png: string;
  };
  value: string;
  suit: string;
}

interface IDeck {
  success: boolean;
  cards: ICard[];
  deck_id: string;
  remaining: number;
}

class Data {
  cards: ICard[] = [];
  cardsForPlay: IHand[] = [];
  newShuffle = false; // bool to trigger cards shuffler

  yourCards1: IHand[] = [
    { value: "7", suit: "DIAMONDS" },
    { value: "5", suit: "DIAMONDS" },
    { value: "6", suit: "DIAMONDS" },
    { value: "8", suit: "DIAMONDS" },
    { value: "2", suit: "CLUBS" },
    { value: "10", suit: "HEARTS" },
    { value: "14", suit: "CLUBS" }]; // data to test check winner from some players

  yourCards2: IHand[] = [
    { value: "10", suit: "CLUBS" },
    { value: "14", suit: "HEARTS" },
    { value: "12", suit: "DIAMONDS" },
    { value: "9", suit: "DIAMONDS" },
    { value: "14", suit: "DIAMONDS" },
    { value: "9", suit: "DIAMONDS" },
    { value: "9", suit: "CLUBS" }]; // data to test check winner from some players

  yourCards3: IHand[] = [
    { value: "9", suit: "CLUBS" },
    { value: "14", suit: "HEARTS" },
    { value: "5", suit: "DIAMONDS" },
    { value: "9", suit: "DIAMONDS" },
    { value: "14", suit: "DIAMONDS" },
    { value: "9", suit: "DIAMONDS" },
    { value: "7", suit: "CLUBS" }]; // data to test check winner from some players

  arrayOfPlayers = [checkCombination(this.yourCards1), checkCombination(this.yourCards2), checkCombination(this.yourCards3)]

  constructor() {
    makeAutoObservable(this);
    reaction(
      () => this.cards,
      (cards) => {
        this.cardsForPlay = shuffle(cards.map(item => ({ value: item.value, suit: item.suit })));
      }
    );
    reaction(
      () => this.newShuffle,
      (bool) => {
        if (bool) this.shuffleArr();
      }
    ); // test for cards shuffler
  }

  // getter for card distribution 

  fetch() {
    fetch('https://deckofcardsapi.com/api/deck/new/draw/?count=52')
      .then(response => response.json())
      .then((json: IDeck) => {
        runInAction(() => {
          this.cards = json.cards;
        })
      })
      // eslint-disable-next-line
      .catch(err => console.log(err))
  }

  shuffleArr() {
    this.cardsForPlay = shuffle(this.cardsForPlay);
  } // test for cards shuffler

  changeBool() {
    this.newShuffle = !this.newShuffle;
  } // test for cards shuffler

}

const dataStore = new Data();
export default dataStore;