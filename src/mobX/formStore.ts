import { makeAutoObservable, action } from "mobx";
import { IFormStore } from "../types";

class Form implements IFormStore {
  isStarted = false;
  name = "";
  opponents = "2";
  playerBank = "100";

  constructor() {
    makeAutoObservable(this, {
      changeName: action.bound,
      start: action.bound,
      chooseOpponents: action.bound,
      chooseBank: action.bound,
    });
  }

  start(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    this.isStarted = true;
  }

  changeName(e: React.ChangeEvent<HTMLInputElement>) {
    this.name = e.target.value;
  }

  chooseOpponents(e: React.ChangeEvent<HTMLSelectElement>) {
    this.opponents = e.target.value;
  }

  chooseBank(e: React.ChangeEvent<HTMLInputElement>) {
    this.playerBank = e.target.value;
  }

}

const formStore = new Form();
export default formStore;