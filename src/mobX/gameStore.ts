import { makeAutoObservable, reaction, action, observable } from "mobx";
import formStore from "./formStore";
import { Bot } from "./botStore";
import dataStore from "./dataStore";
import { IFormStore, IDataStore, IBot, IGameStore, ICardsForPlay } from "../types";
import { Player } from "./playerStore";
import { handleTurn, allFold, sameBids } from "./utilsForStore";
import { checkWinner } from "../Utils/winnerCheck";

type BooleanKeysOfIBot = keyof Pick<IBot, { [K in keyof IBot]: IBot[K] extends boolean ? K : never }[keyof IBot]>;

export class Game implements IGameStore {
  players: IBot[] = [];
  bigBlindCost = 2;
  smallBlindCost = 1;
  bank = 0;
  round = "pre-flop";
  maxBet = this.bigBlindCost;
  board: ICardsForPlay[] = [];
  formStore: IFormStore;
  dataStore: IDataStore;

  constructor() {
    makeAutoObservable(this, {
      handleCall: action.bound,
      handleCheck: action.bound,
      handleFold: action.bound,
      handleRaise: action.bound,
    });
    this.formStore = formStore;
    this.dataStore = dataStore;
    reaction(
      () => this.formStore.isStarted,
      () => {
        this.addPlayers();
        this.blind();
        this.decision();
      }
    );
    reaction(
      () => this.bigBlindCost,
      () => {
        this.maxBet = this.bigBlindCost;
      }
    );
    reaction(
      () => this.round,
      (round) => {
        if (round === "flop") {
          this.maxBet = 0;
          this.clearPlayerStates();
          this.board = [this.dataStore.cardsForPlay[0], this.dataStore.cardsForPlay[1], this.dataStore.cardsForPlay[2]];
          this.makeMove();
          this.decision();
        }
        else if (round === "turn") {
          this.maxBet = 0;
          this.clearPlayerStates();
          this.board = [
            this.dataStore.cardsForPlay[0],
            this.dataStore.cardsForPlay[1],
            this.dataStore.cardsForPlay[2],
            this.dataStore.cardsForPlay[3]];
          this.makeMove();
          this.decision();
        }
        else if (round === 'river') {
          this.maxBet = 0;
          this.clearPlayerStates();
          this.board = [
            this.dataStore.cardsForPlay[0],
            this.dataStore.cardsForPlay[1],
            this.dataStore.cardsForPlay[2],
            this.dataStore.cardsForPlay[3],
            this.dataStore.cardsForPlay[4]];
          this.makeMove();
          this.decision();
        }
      }
    );
    reaction(
      () => this.dataStore.handsCount,
      () => {
        console.log("was handscount");
        this.clearPlayerStates();
        this.clearStoreStates();
        this.blindRising();
        this.blind();
        this.cardDistribution();
        this.decision();
      }
    );
  }

  handleCall() {
    this.players = handleTurn(this.players, "call");
    const player = this.players[0];
    player.callCalculation();
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

  handleRaise() {
    this.players = handleTurn(this.players, "raise");
    const player = this.players[0];
    player.raiseCalculation(); // should be another calculation here, because that one is for bot which can't choose raise with input range.
    this.decision();
  } // for raise opportunity, will make soon, for now we are able just to call/fold and check.

  private clearStoreStates() {
    this.bank = 0;
    this.round = "pre-flop";
    console.log("clear round", this.round);
    this.board = [];
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

  private winnerChecking() {
    const stayedInGame = this.players.filter(item => item.turn !== "fold").map(item => item.combination());
    const winners = checkWinner(stayedInGame);

    if (winners.length === 1) {
      const index = this.players.findIndex(item => item.id === winners[0].id);
      this.players[index].winner();
    } else {
      for (const player of winners) {
        const indexOfWinnerID = this.players.findIndex(item => item.id === player.id);
        this.players[indexOfWinnerID].splitPot(winners.length);
      }
    }
  }

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
    //const lastIsMoving = this.players.findIndex(item => item.isMoving);
    if (this.round === "pre-flop") {
      const index = this.players.findIndex(item => item.bigBlind);
      this.circleIteration(index, "isMoving");

    } else {
      console.log("was in makeMove", this.round);
      if (this.players.length === 2) {
        const indexBig = this.players.findIndex(item => item.bigBlind);
        this.players[indexBig].isMoving = true;
      } else {
        const indexSmall = this.players.findIndex(item => item.smallBlind);
        this.players[indexSmall].isMoving = true;
      }
    }
  } // need to make reaction on this, each time when round changes

  private winnerByFold(player: IBot) {
    const winnerIndex = this.players.findIndex(item => item.turn !== "fold");
    this.players[winnerIndex].winner();
    player.isMoving = false;
    console.log(this.round);
    this.round = "finish";
    this.dataStore.handsCount++;
    console.log(this.round);
  }

  private decision() {
    let counter = 0;
    while (counter < this.players.length) {

      const index = this.players.findIndex(item => item.isMoving); // finds who was moving before
      console.log(index);

      const player = this.players[index];
      const shouldMoveExp = player.bet !== this.maxBet || !player.turn; // if did not went returns true, or if current bet is not maxBet returns true.

      if (allFold(this.players)) {
        this.winnerByFold(player);
        return;
      }

      if (player.turn !== "fold") {

        if (player.isBot && shouldMoveExp) {
          player.ai();
          // here should be animation of bot movement in future I think.
        } // bot generates decision.

      }

      if (allFold(this.players)) {
        this.winnerByFold(player);
        return;
      } // if everyone folded, give bank to last person who remained, this function should be used before players move and also after.
      // because if bot is moving, we can check this after his turn, but we can't do same if real player moving, so thats why we also need to use this func above.
      // so if first move is real players move and he folded, we need to check that before bot's turn, in other way both will fold and we will have bug.

      if (this.round === "pre-flop" && player.bigBlind) {
        const isSame = sameBids(this.players);
        if (isSame) {

          if (player.turn) {
            player.isMoving = false;
            this.round = "flop";
          }
          return;
        }
      } // if round is pre-flop it means that last person who will make decision is BB so, when there is his turn  this part will check
      // if all persons who did not folded have the same bets, if yes, bidding round will be over and recursion also be over, if not we will run this function again
      // until all persons will fold instead of last one, or until there will be same bets.

      if (this.round !== "pre-flop" && player.isDiller) {
        const isSame = sameBids(this.players);
        if (isSame) {

          if (player.turn) {
            player.isMoving = false;
            const rounds = ["pre-flop", "flop", "turn", "river", "finish"]; // should be enum istead of strings, to avoid typo.
            const indexOfCurrentRound = rounds.findIndex(item => item === this.round);
            this.round = rounds[indexOfCurrentRound + 1];

            if (this.round === "finish") {
              this.winnerChecking();
              this.makeMove();
              this.dataStore.handsCount++;
            }
          }

          return;
        }
      } // same as above one, but works for next rounds where last decision maker will be dealer (button).

      const shouldRenderButtons = !player.isBot && player.turn === "fold" || !player.isBot && !shouldMoveExp;

      if (player.isBot || shouldRenderButtons) {
        player.isMoving = false;
        this.circleIteration(index, "isMoving");
        console.log("263");

      } else {
        console.log("269");
        return;
      } // should finish recursion if real player did not folded yet.

      counter++;
    }

    this.decision(); // recursion, which can't be infinitive in future, because player won't be possible to raise more than he have, so one return will be reached.
  }

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

    this.dillerPos(random, firstHand);

    if (firstHand) {
      this.players[random].bigBlind = true;
      this.players[random - 1].smallBlind = true;
      // this part initializes who are on blinds at first hand, with random const.
    } else {
      this.blindsPos('bigBlind');
      this.blindsPos('smallBlind');
    }

    const arr = this.players.map(item => { // will add this functionality to bot class
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