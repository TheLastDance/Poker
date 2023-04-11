import * as mobx from 'mobx';
import React, { useEffect } from 'react';
import { observer } from 'mobx-react-lite';
import './App.scss';
import Form from './components/form/form';
import rootStore from './mobX';
import { Player } from './mobX/playerStore';
import PlayersTurn from './components/playersTurn/playersTurn';
import { Application } from 'pixi.js';
import Test from './testPixiComponent';
import { AppProvider } from "@pixi/react"

const app = new Application();

const App: React.FC = observer(() => {
  const { formStore: { isStarted, opponents, name }, dataStore, gameStore } = rootStore;
  //console.log(app.view.width);


  useEffect(() => {
    dataStore.fetch();
    // eslint-disable-next-line
  }, []);
  console.log(gameStore.bank, gameStore.players[0]?.stack, gameStore.players[1]?.stack);
  console.log(gameStore.players);

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
          <div style={{ display: "flex", }}>
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
          <AppProvider value={app}>
            <Test />
          </AppProvider>
        </div>
      }
    </div>
  );
})

export default App;
