import { makeAutoObservable, reaction, action, runInAction } from "mobx";
import formStore from "./formStore";
import { Bot } from "./botStore";
import dataStore from "./dataStore";
import { IFormStore, IDataStore, IBot, IGameStore, ICardsForPlay, IPlayer, TurnsEnum } from "../types";
import { Player } from "./playerStore";
import { handleTurn, allFold, sameBids, checkAllIns } from "./utilsForStore";
import { checkWinner } from "../Utils/winnerCheck";

type BooleanKeysOfIBot = keyof Pick<IBot, { [K in keyof IBot]: IBot[K] extends boolean ? K : never }[keyof IBot]>;
const { fold, call, check, raise, allIn } = TurnsEnum;

export class Game implements IGameStore {
  players: IBot[] | IPlayer[] = [];
  bigBlindCost = 2;
  smallBlindCost = 1;
  bank = 0;
  round = "pre-flop";
  maxBet = this.bigBlindCost;
  playerRaiseAmount = this.maxBet + 1;
  board: ICardsForPlay[] = [];
  isGameOver = false;
  formStore: IFormStore;
  dataStore: IDataStore;

  constructor() {
    makeAutoObservable(this, {
      handleCall: action.bound,
      handleCheck: action.bound,
      handleFold: action.bound,
      handleAllIn: action.bound,
      handleRaise: action.bound,
      handleRaiseInput: action.bound,
    });
    this.formStore = formStore;
    this.dataStore = dataStore;
    reaction(() => this.maxBet,
      () => {
        this.playerRaiseAmount = this.maxBet - this.players[0].bet + 1; // could be issue
      })
    reaction(
      () => this.formStore.isStarted && this.dataStore.assetsLoaded, // changed it should to be careful, not sure how it works
      async () => {
        this.addPlayers();
        this.blind();
        await this.decision();
      }
    );
    reaction(
      () => this.round,
      async (round) => {
        if (round === "flop") {
          this.maxBet = 0;
          this.clearPlayerStates();
          await new Promise(resolve =>
            setTimeout(() => resolve(runInAction(() => this.board = this.dataStore.cardsForPlay.slice(0, 3))), 1000));
          this.makeMove();
          await this.decision(); // this working recursively when round changes
        }
        else if (round === "turn") {
          this.maxBet = 0;
          this.clearPlayerStates();
          await new Promise(resolve =>
            setTimeout(() => resolve(runInAction(() => this.board = this.dataStore.cardsForPlay.slice(0, 4))), 1000));
          this.makeMove();
          await this.decision();
        }
        else if (round === 'river') {
          this.maxBet = 0;
          this.clearPlayerStates();
          await new Promise(resolve =>
            setTimeout(() => resolve(runInAction(() => this.board = this.dataStore.cardsForPlay.slice(0, 5))), 1000));
          this.makeMove();
          await this.decision();
        }
      }
    );
    reaction(
      () => this.dataStore.handsCount,
      async () => {
        console.log("was handscount");
        this.clearPlayerStates();
        this.blindRising(); // changed
        this.clearStoreStates();
        this.blind();
        this.cardDistribution();
        if (!this.isGameOver) await this.decision();
      }, { delay: 1000 }
    );
  }

  async handleCall() {
    this.players = handleTurn(this.players, call);
    const player = this.players[0];
    player.callCalculation();
    await this.decision();
  }

  handleFold(): void {
    this.players = handleTurn(this.players, fold);
    this.decision();
  }

  handleCheck(): void {
    this.players = handleTurn(this.players, check);
    this.decision();
  }

  handleRaiseInput(e: React.ChangeEvent<HTMLInputElement>): void {
    if (this.players[0] instanceof Player) this.players[0].raiseInput(e);
  }

  handleAllIn(): void {
    this.players = handleTurn(this.players, allIn);
    const player = this.players[0];
    player.allInCalculation();
    this.decision();
  }

  handleRaise(): void {
    const player = this.players[0];
    player.raiseCalculation(); // should be another calculation here, because that one is for bot which can't choose raise with input range.
    if (player.stack > 0) {
      this.players = handleTurn(this.players, raise);
    } else {
      this.players = handleTurn(this.players, allIn);
    }
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
    const stayedInGame = this.players.filter(item => item.turn !== fold).map(item => item.combination());
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
    const player: IPlayer = new Player();
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
      this.maxBet = this.bigBlindCost;
    }
  } // will rise blinds after each 10 hands

  private makeMove() {
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
  } // initializes player who will move first in that round

  private winnerByFold(player: IBot) {
    const winnerIndex = this.players.findIndex(item => item.turn !== fold);
    this.players[winnerIndex].winner();
    player.isMoving = false;
    console.log(this.round);
    this.round = "finish";
    this.dataStore.handsCount++;
    console.log(this.round);
  }

  private async roundChange(player: IBot | IPlayer) {
    player.isMoving = false;
    const rounds = ["pre-flop", "flop", "turn", "river", "finish"]; // should be enum istead of strings, to avoid typo.
    const indexOfCurrentRound = rounds.findIndex(item => item === this.round);
    runInAction(() => { this.round = rounds[indexOfCurrentRound + 1]; }) // MAKE AS ACTION
    console.log("mainCheck");


    if (this.round === "finish") {
      console.log("was in isSame", this.round);
      console.log("finish 1");

      await new Promise(resolve => setTimeout(() => resolve(this.winnerChecking()), 5000));

      console.log("finish 2");
      runInAction(() => { this.dataStore.handsCount++; }) // MAKE AS ACTION
    }
  }

  private async decision() {
    let counter = 0;
    while (counter < this.players.length) {
      const index = this.players.findIndex(item => item.isMoving);
      console.log(index);
      const player = this.players[index];
      const shouldMoveExp = player.bet !== this.maxBet || !player.turn; // if did not went returns true, or if current bet is not maxBet returns true.
      const allInChecker = checkAllIns(this.players); // need to do something with that func tomorrow

      if (allFold(this.players)) {
        console.log("folded");
        await new Promise(resolve => setTimeout(() => resolve(this.winnerByFold(player)), 2000));
        return;
      }

      if (allInChecker && sameBids(this.players)) {
        this.roundChange(player);
        return;
      }

      if (player.turn !== fold && player.turn !== allIn) {
        if (player.isBot && shouldMoveExp) {
          await new Promise(resolve => setTimeout(() => resolve(player.ai()), 1500)); // react dont want to rerender when state is updated withour ticker.
          //player.ai();
          console.log(player.turn);
          await new Promise(resolve => setTimeout(resolve, 1500));
        } // bot generates decision.
      }

      if (allFold(this.players)) { // if everyone folded, give bank to last person who remained, this function should be used before players move and also after.
        console.log("folded");
        await new Promise(resolve => setTimeout(() => resolve(this.winnerByFold(player)), 2000));
        return;
      }
      // because if bot is moving, we can check this after his turn, but we can't do same if real player moving, so thats why we also need to use this func above.
      // so if first move is real players move and he folded, we need to check that before bot's turn, in other way both will fold and we will have bug.

      if (this.round === "pre-flop" && player.bigBlind) {
        const isSame = sameBids(this.players);
        if (isSame) {
          if (player.turn) {
            player.isMoving = false;
            runInAction(() => this.round = "flop"); // this will run this function again in reaction, so this block will be returned at the end.
          }
          console.log("was in isSame", this.round);
          return;
        }
      }
      // if round is pre-flop it means that last person who will make decision is BB so, when there is his turn  this part will check
      // if all persons who did not folded have the same bets, if yes, bidding round will be over and recursion also be over, if not we will run this function again
      // until all persons will fold except last one, or until there will be same bets.

      if (this.round !== "pre-flop" && player.isDiller) {
        const isSame = sameBids(this.players);

        if (isSame) {
          console.log("was in isSame", this.round);
          if (player.turn) {
            this.roundChange(player);
          }
          console.log("was returned");
          return;
        }
      } // same as above one, but works for next rounds where last decision maker will be dealer (button).

      const shouldRenderButtons = !player.isBot && player.turn === fold ||
        !player.isBot && !shouldMoveExp ||
        !player.isBot && player.turn === allIn;

      if (player.isBot || shouldRenderButtons) {
        this.changeArr(index);
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

  private changeArr(index: number) {
    this.players = this.players.map((item, indexItem) => {
      if (indexItem === index) {
        item.isMoving = false;
      }
      return item;
    });
  }

  private circleIteration(index: number, prop: BooleanKeysOfIBot) {
    if (index === this.players.length - 1) {
      this.players[0][prop] = true;
    } else {
      this.players[index + 1][prop] = true;
    }
  } // function for circle iteration between players on table.

  private dillerPos(bigBlindIndex: number) {
    if (bigBlindIndex === 1) {
      if (this.players.length === 2) {
        this.players[0].isDiller = true;
      } else {
        this.players[this.players.length - 1].isDiller = true;
      }
    } else {
      this.players[bigBlindIndex - 2].isDiller = true;
    }
  } // initializes who is dealer on first hand, need separate logic because on heads up dealer should be small blind, thats why we check length of the array.

  private rolesPos(type: 'smallBlind' | 'bigBlind' | 'isDiller') {
    const index = this.players.findIndex(item => item[type]);
    this.players[index][type] = false;
    this.circleIteration(index, type);
  } // initializes players on blinds from the second hand.
  // SHOULD BE VERY CAREFUL HERE WHEN BOT WILL LOSE ALL HIS STACK AND BE DELETED FROM ARRAY(!!!).

  private deleteLoser() {
    const noLoser = this.players.every(item => item.stack >= this.bigBlindCost);

    if (noLoser) return;

    for (let i = 0; i < this.players.length; i++) {
      const player = this.players[i];
      if (player.stack < this.bigBlindCost) {
        if (this.players.length === 2) {
          const remainder = player.stack;
          this.players.splice(i, 1);
          this.players[0].stack += remainder + this.bank;
          this.bank = 0;
          this.isGameOver = true;
          return;
        }
        if (player.bigBlind || player.isDiller || player.smallBlind) {
          if (player.isDiller) {
            if (this.players.length === 3) {
              this.rolesPos("isDiller");
            } else {
              this.rolesPos("isDiller");
              this.rolesPos("smallBlind");
              this.rolesPos("bigBlind");
            }
          }
          if (player.smallBlind) {
            this.rolesPos("smallBlind");
            this.rolesPos("bigBlind");
          }
          if (player.bigBlind) {
            this.rolesPos("bigBlind");
          }
          if (this.players.length === 3 && !player.isDiller) {
            const smallIndex = this.players.findIndex(item => item.smallBlind);
            const dillerIndex = this.players.findIndex(item => item.isDiller);
            this.players[dillerIndex].isDiller = false;
            this.players[smallIndex].isDiller = true;
          }
        }
        this.bank += player.stack;
        this.players.splice(i, 1);
        i--;
      }
    }

    this.deleteLoser(); // should be deleted
  }

  private blind() {
    const firstHand = this.players.every(item => !item.bigBlind);

    if (firstHand) {
      const random = Math.floor(Math.random() * (this.players.length - 1)) + 1; // randomizes which index will be BB on first hand.
      this.dillerPos(random);
      this.players[random].bigBlind = true;
      this.players[random - 1].smallBlind = true;
      // this part initializes who are on blinds at first hand, with random const.
    } else {
      this.rolesPos("isDiller");
      this.rolesPos('bigBlind');
      this.rolesPos('smallBlind');
    }

    this.deleteLoser();

    for (const player of this.players) {
      player.blindsCalculation();
    } // calculates blinds

    this.makeMove();
  }
}

const gameStore = new Game();
export default gameStore;