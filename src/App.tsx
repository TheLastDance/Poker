import * as mobx from 'mobx';
import React, { useEffect } from 'react';
import { observer } from 'mobx-react-lite';
import './App.scss';
import Form from './components/form/form';
import rootStore from './mobX';
import { checkWinner } from './Utils/winnerCheck';

const App: React.FC = observer(() => {
  const { formStore: { isStarted, opponents, name }, dataStore } = rootStore;

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
  let test = mobx.toJS(dataStore.arrayOfPlayers);
  console.log(checkWinner(test), mobx.toJS(dataStore.arrayOfPlayers));




  return (
    <div className="App">
      {!isStarted ? <Form /> :
        <>
          <span>Hello {name}!</span>
          <span>Your have {opponents} opponents</span>
          <div>
            random cards:
            {dataStore.cards.length &&
              <>
                <img src={dataStore.cards[0].images.png} alt="" />
                <img src={dataStore.cards[1].images.png} alt="" />
                <img src={dataStore.cards[2].images.png} alt="" />
              </>
            }
            <button type='button' onClick={() => dataStore.changeBool()}>CLICK IT AND SHUFFLE</button>
            {/* test for cards shuffling with mobX */}
          </div>
        </>
      }
    </div>
  );
})

export default App;
