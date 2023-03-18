import { makeAutoObservable, action } from "mobx";

class Form {
  isStarted = false;
  name = "";
  opponents = "1";

  constructor() {
    makeAutoObservable(this, {
      changeName: action.bound,
      start: action.bound,
      chooseOpponents: action.bound,
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

}

const formStore = new Form();
export default formStore;