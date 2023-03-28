import { makeAutoObservable, reaction, action, observable } from "mobx";
import formStore from "./formStore";
import { Bot } from "./botStore";
import dataStore from "./dataStore";
import { IFormStore, IDataStore, IBot, IGameStore } from "../types";
import { Player } from "./playerStore";
import { handleTurn, allFold, sameBids } from "./utilsForStore";

type BooleanKeysOfIBot = keyof Pick<IBot, { [K in keyof IBot]: IBot[K] extends boolean ? K : never }[keyof IBot]>;

class Game implements IGameStore {
  players: IBot[] = [];
  bigBlindCost = 2;
  smallBlindCost = 1;
  bank = 0;
  round = "pre-flop";
  maxBet = this.bigBlindCost;
  formStore: IFormStore;
  dataStore: IDataStore;

  constructor() {
    makeAutoObservable(this, {
      handleCall: action.bound,
      handleCheck: action.bound,
      handleFold: action.bound,
    });
    this.formStore = formStore;
    this.dataStore = dataStore;
    reaction(
      () => this.formStore.isStarted,
      () => {
        this.addPlayers();
        this.blind();
        this.makeMove2();
      }
    );
    reaction(
      () => this.bigBlindCost,
      () => {
        this.maxBet = this.bigBlindCost;
      }
    );
    reaction(
      () => this.dataStore.handsCount,
      () => {
        this.clearStoreStates();
        this.clearPlayerStates();
        this.blindRising();
        this.blind();
        this.cardDistribution();
        this.makeMove2();

        // clear function for store
      }
    );
  }

  handleCall() {
    this.players = handleTurn(this.players, "call");
    // this.bank += this.maxBet;
    this.decision();
  }

  handleFold() {
    this.players = handleTurn(this.players, "fold")
    this.decision();
  }

  handleCheck() {
    this.players = handleTurn(this.players, "check")
    this.decision();
  }

  private clearStoreStates() {
    this.bank = 0;
    this.round = "pre-flop";
    this.maxBet = this.bigBlindCost;
  }

  private clearPlayerStates() {
    for (const player of this.players) {
      player.clearStates();
    }
  } // cleares states from last hand.

  private cardDistribution() {
    for (const player of this.players) {
      player.cardDistribution();
    }
  } // will distribute cards for players when the new hand start.

  private addPlayers() {
    const player: IBot = new Player();
    const bots: IBot[] = new Array(Number(this.formStore.opponents)).fill(0).map(() => new Bot());
    this.players = [player, ...bots].map((item, index) => {
      item.id = index; // adding id's to players.
      return item;
    });
  } // adds players to the game

  private blindRising() {
    if (this.dataStore.handsCount % 10 === 0) {
      this.bigBlindCost = this.bigBlindCost * 2;
      this.smallBlindCost = this.smallBlindCost * 2;
    }
  } // will rise blinds after each 10 hands


  private makeMove() { // initializes player who will move first in that round
    const lastIsMoving = this.players.findIndex(item => item.isMoving);
    if (this.round === "pre-flop") {
      const index = this.players.findIndex(item => item.bigBlind);

      if (lastIsMoving !== -1) this.players[lastIsMoving].isMoving = false; // clear from last hand
      this.circleIteration(index, "isMoving");

    } else {
      const index = this.players.findIndex(item => item.smallBlind);
      if (lastIsMoving !== -1) this.players[lastIsMoving].isMoving = false;
      this.players[index].isMoving = true;
    }
  } // need to make reaction on this, each time when round changes

  private makeMove2() {
    // let arr = this.players.filter(item => item.turn !== "fold"); // check this

    if (this.round === "pre-flop") {
      this.decision();
      //let arr = this.players.filter(item => item.turn !== "fold" && item.bet !== this.maxBet);
    }
  }

  private decision() {
    let counter = 0;
    while (counter < this.players.length) {

      const index2 = this.players.findIndex(item => item.isMoving); // finds who was moving before
      const player = this.players[index2];
      const shouldMoveExp = player.bet !== this.maxBet || !player.turn; // if did not went returns true, or if current bet is not maxBet returns true.
      if (player.turn !== "fold") {
        const isWinnerByAllFold = allFold(this.players);

        if (isWinnerByAllFold) {
          player.isMoving = false;
          return;
        } // if everyone folded, give bank to last person who remained

        if (player.isBot && shouldMoveExp) {
          player.ai();
        } // bot generates decision.
      }

      if (this.round === "pre-flop" && player.bigBlind) {
        const isSame = sameBids(this.players);
        if (isSame) {
          if (player.isBot) player.isMoving = false;
          return;
        }
      }

      if (this.round !== "pre-flop" && player.isDiller) {
        const isSame = sameBids(this.players);
        if (isSame) {
          if (player.isBot) player.isMoving = false;
          return;
        }
      }

      const shouldRenderButtons = !player.isBot && player.turn === "fold" || !player.isBot && !shouldMoveExp;

      if (player.isBot || shouldRenderButtons) {
        player.isMoving = false;
        this.circleIteration(index2, "isMoving");
      } else {
        return;
      }

      counter++;
    }

    this.decision(); // recursion, which can't be infinitive in future, because player won't be possible to raise more than he have, so one return will be reached.
  }// for now it's working, but have an error in console because of possible infinitive loop. But no crushes and so on. Will fix it.

  private circleIteration(index: number, prop: BooleanKeysOfIBot) {
    if (index === this.players.length - 1) {
      this.players[0][prop] = true;
    } else {
      this.players[index + 1][prop] = true;
    }
  } // function for circle iteration between players on table.

  private dillerPos(num: number, isFirstHand: boolean) {
    if (isFirstHand) {
      if (num === 1) {
        if (this.players.length === 2) {
          this.players[0].isDiller = true;
        } else {
          this.players[this.players.length - 1].isDiller = true;
        }
      } else {
        this.players[num - 2].isDiller = true;
      }
    } else {
      const diller = this.players.findIndex(item => item.isDiller);
      this.players[diller].isDiller = false;

      this.circleIteration(diller, "isDiller");
    }
  } // initializes who is dealer


  private blindsPos(blindType: 'smallBlind' | 'bigBlind') {
    const index = this.players.findIndex(item => item[blindType]);
    this.players[index][blindType] = false;

    this.circleIteration(index, blindType);
  } // initializes players on blinds from the second hand.

  private blind() {
    const firstHand = this.players.every(item => !item.bigBlind);
    const random = Math.floor(Math.random() * (this.players.length - 1)) + 1;

    console.log(random);

    this.dillerPos(random, firstHand);

    if (firstHand) {
      this.players[random].bigBlind = true;
      this.players[random - 1].smallBlind = true;
      // this part initializes who are on blinds at first hand, with random const.
    } else {
      this.blindsPos('bigBlind');
      this.blindsPos('smallBlind');
    }

    const arr = this.players.map(item => {
      if (item.bigBlind) {
        item.stack -= this.bigBlindCost;
        this.bank += this.bigBlindCost;
        item.bet += this.bigBlindCost;
        return item;
      }
      if (item.smallBlind) {
        item.stack -= this.smallBlindCost;
        this.bank += this.smallBlindCost;
        item.bet += this.smallBlindCost;
        return item;
      }
      return item;
    }) // counts changes from blinds

    this.players = arr;
    this.makeMove();
  }
}


const gameStore = new Game();
export default gameStore;