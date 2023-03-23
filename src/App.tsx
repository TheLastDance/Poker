import * as mobx from 'mobx';
import React, { useEffect } from 'react';
import { observer } from 'mobx-react-lite';
import './App.scss';
import Form from './components/form/form';
import rootStore from './mobX';
import { checkWinner } from './Utils/winnerCheck';
import { Bot } from './mobX/botStore';

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

  console.log(gameStore.players, gameStore.bank, dataStore.cards);




  return (
    <div className="App">
      {!isStarted ? <Form /> :
        <div className='test_container'>
          <span>Hello {name}!</span>
          <span>You have {opponents} opponents</span>
          <div>
            {dataStore.cardsForPlay.length &&
              <div>
                <img src={dataStore.cardsForPlay[0].image} alt="" />
                <img src={dataStore.cardsForPlay[1].image} alt="" />
                <img src={dataStore.cardsForPlay[2].image} alt="" />
              </div>
            }
            <button type='button' onClick={() => dataStore.handIncrement()}>CLICK IT AND SHUFFLE</button>
            {/* test for cards shuffling with mobX */}
          </div>
          <div>
            {gameStore.players.length &&
              gameStore.players.map((item, index) => <div key={index}>
                <p>{item.name}</p>
                <p>stack: {item.stack}</p>
                {item.bigBlind ? <p>Big-Blind</p> : item.smallBlind ? <p>Small-Blind</p> : null}
                {item.isDiller && <p>Diller</p>}
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
