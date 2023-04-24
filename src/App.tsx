import * as mobx from 'mobx';
import React, { useEffect } from 'react';
import { observer } from 'mobx-react-lite';
import './App.scss';
import Form from './components/React/form/form';
import rootStore from './mobX';
import { Application } from 'pixi.js';
import { AppProvider } from "@pixi/react";
import MainStage from './components/Pixi/Stage';

const app = new Application();

const App: React.FC = observer(() => {
  const { formStore: { isStarted }, dataStore, gameStore } = rootStore;

  useEffect(() => {
    // eslint-disable-next-line
    dataStore.fetch();
  }, []);

  console.log(gameStore.bank, gameStore.players[0]?.stack, gameStore.players[1]?.stack);
  console.log(gameStore.players);
  console.log(dataStore.cardsForPlay);

  return (
    <div className="App">
      {!isStarted ? <Form /> :
        dataStore.startCanvasRender ?
          <AppProvider value={app}>
            <MainStage />
          </AppProvider> :
          null
      }
    </div>
  );
})

export default App;
