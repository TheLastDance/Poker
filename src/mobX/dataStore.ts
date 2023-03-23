import { makeAutoObservable, runInAction, reaction } from "mobx";
import { ICardsForPlay, IDataStore, IDeck, ICard } from "../types";
import { shuffle } from "../Utils/shuffleArray";
// import { checkCombination } from "../Utils/combinationCheck";

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

  fetch() {
    fetch('https://deckofcardsapi.com/api/deck/new/draw/?count=52')
      .then(response => response.json())
      .then((json: IDeck) => {
        runInAction(() => {
          this.cards = json.cards.map((item: ICard) => ({ value: item.value, suit: item.suit, image: item.image }));
        })
      })
      // eslint-disable-next-line
      .catch(err => console.log(err))
  } // fetch of experemental api with card deck for testing and rendering cards. 
  // This api returns values like "KING", "JACK" so for comb checking I will change that values to value of rankings.

  shuffleArr() {
    this.cardsForPlay = shuffle([...this.cards]);
  } // cards shuffler

  handIncrement() {
    this.handsCount = this.handsCount + 1;
  } // will count played hands, for now need to test things and trigger changes by button.
}

const dataStore = new Data();
export default dataStore;