import * as mobx from 'mobx';
import React, { useEffect, useState } from 'react';
import { observer } from 'mobx-react-lite';
import './App.scss';
import Form from './components/form/form';
import rootStore from './mobX';
import { checkWinner } from './Utils/winnerCheck';
import { Bot } from './mobX/botStore';
import { Player } from './mobX/playerStore';
import PlayersTurn from './components/playersTurn/playersTurn';

const App: React.FC = observer(() => {
  const { formStore: { isStarted, opponents, name }, dataStore, gameStore } = rootStore;

  useEffect(() => {
    dataStore.fetch();
    // eslint-disable-next-line
  }, []);
  // console.log(checkCombination(dataStore.yourCards)); // test

  // console.log(dataStore.cardsForPlay[0]);
  // test for shuffle

  // console.log(checkCombination([
  //   { value: "5", suit: "DIAMONDS" },
  //   { value: "2", suit: "DIAMONDS" },
  //   { value: "9", suit: "HEARTS" },
  //   { value: "9", suit: "CLUBS" },
  //   { value: "3", suit: "DIAMONDS" },
  //   { value: "8", suit: "SPADES" },
  //   { value: "9", suit: "SPADES" }]));
  // let test = mobx.toJS(dataStore.arrayOfPlayers);

  // console.log(dataStore.playersWithCards);

  // useEffect(() => {
  //   gameStore.addPlayers();

  // }, [isStarted])
  // const player = new Player();
  console.log(gameStore.bank, gameStore.players[0]?.stack, gameStore.players[1]?.stack);
  console.log(gameStore.round);



  return (
    <div className="App">
      {!isStarted ? <Form /> :
        <div className='test_container' style={{ overflowY: 'scroll', height: '100%', }}>
          <span>Hello {name}!</span>
          <span>You have {opponents} opponents</span>
          <div>
            {dataStore.cardsForPlay.length &&
              <div>
                {gameStore.board.map((item, index) => <img key={index} src={item.image} alt="" />)}
              </div>
            }
            <button type='button' onClick={() => dataStore.handIncrement()}>CLICK IT AND SHUFFLE</button>
            {/* test for cards shuffling with mobX */}
          </div>
          <div className='stats'>
            <p>BANK: {gameStore.bank}</p>
            <p>ROUND: {gameStore.round}</p>
            <p>Hands was played: {dataStore.handsCount}</p>
            <p>Your combination: {gameStore.players && gameStore.players[0].combination().combination}</p>
          </div>
          <div>
            {gameStore.players.length &&
              gameStore.players.map((item, index) => <div key={index}>
                <p>{item.name}</p>
                <p>stack: {item.stack}</p>
                {item.bigBlind ? <p>Big-Blind</p> : item.smallBlind ? <p>Small-Blind</p> : null}
                {item.bet !== 0 && <p>Bet: {item.bet}</p>}
                {item.isDiller && <p>Dealer</p>}
                {item.isMoving && <p>IS MOVING-TRUE</p>}
                {item.turn && <p>{item.turn}</p>}
                {item.isMoving && item instanceof Player &&
                  <PlayersTurn item={item} maxBet={gameStore.maxBet} playerRaiseAmount={gameStore.playerRaiseAmount} />}
                <img src={item.hand[0]?.image} alt="" />
                <img src={item.hand[1]?.image} alt="" />
              </div>)
            }
          </div>
        </div>
      }
    </div>
  );
})

export default App;
