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
  const { dataStore: { fetch } } = rootStore;

  useEffect(() => {
    fetch();
    // eslint-disable-next-line
  }, []);

  console.log(gameStore.bank, gameStore.players[0]?.stack, gameStore.players[1]?.stack);
  console.log(gameStore.players);
  console.log(dataStore.cardsForPlay);

  return (
    <div className={!isStarted ? "App" : "App removeBackground"}>
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
