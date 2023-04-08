import { Stage, Container, Text, Sprite, useApp, useTick } from '@pixi/react';
import React, { useState, useRef } from 'react';
import { observer } from 'mobx-react-lite';
import rootStore from './mobX';
import { TextStyle } from 'pixi.js';


const style = new TextStyle({
  align: 'center',
  fontFamily: '"Source Sans Pro", Helvetica, sans-serif',
  fontSize: 25,
  fontWeight: '400',
  fill: ['#ffffff', '#00ff99'], // gradient
  stroke: '#01d27e',
  strokeThickness: 3,
  letterSpacing: 2,
  wordWrap: true,
  wordWrapWidth: 440,
});

let i = 0;

const Test: React.FC = observer(() => {
  const { gameStore, dataStore } = rootStore;
  const { players } = gameStore;
  const app = useApp();
  const [x, setX] = useState(0);
  const [y, setY] = useState(0);
  const containerRef = useRef<any>(null);

  useTick(delta => {
    i += 0.01 * delta;
    setX(Math.sin(i) * 100)
    setY(Math.sin(i / 1.5) * 100)
  });


  return (
    <Stage options={{}}>
      {players.length && players.map((item, index) => <Container key={item.id} x={index === 0 ? x : 150 * index} y={index === 0 ? y : 0}>
        <Text text={`${item.name}`} anchor={{ x: 0, y: 0 }} style={style} />
        <Text text={`stack: ${item.stack}`} anchor={{ x: 0, y: 0 }} style={new TextStyle({ fill: 'red' })} y={+style.fontSize} />
        {item.bigBlind ? <Text text={`BB`} anchor={{ x: 0, y: 0 }} style={new TextStyle({ fill: 'red' })} y={+style.fontSize * 2} /> :
          item.smallBlind ? <Text text={`SB`} anchor={{ x: 0, y: 0 }} style={new TextStyle({ fill: 'red' })} y={+style.fontSize * 2} /> :
            null}
        {item.bet !== 0 && <Text text={`bet: ${item.bet}`} anchor={{ x: 0, y: 0 }} style={style} y={+style.fontSize * 3} />}
        {item.isDiller && <Text text={`Dealer`} anchor={{ x: 0, y: 0 }} style={new TextStyle({ fill: 'red' })} y={+style.fontSize * 4} />}
        {item.isMoving && <Text text={'=>'} anchor={{ x: 0, y: 0 }} style={style} y={+style.fontSize * 5} />}
        {item.turn && <Text text={item.turn} anchor={{ x: 0, y: 0 }} style={style} y={+style.fontSize * 6} />}
      </Container>)}

      <Container ref={containerRef} pivot={0} x={0} y={containerRef.current ? app.view.height - containerRef.current.height : 300}>
        <Text text={`BANK: ${gameStore.bank}`} anchor={{ x: 0, y: 1 }} style={style} y={+style.fontSize} />
        <Text text={`ROUND: ${gameStore.round}`} anchor={{ x: 0, y: 1 }} style={style} y={+style.fontSize * 2} />
        <Text text={`PLAYED HANDS: ${dataStore.handsCount}`} anchor={{ x: 0, y: 1 }} style={style} y={+style.fontSize * 3} />
        <Text text={`YOUR COMBINATION: ${gameStore.players && gameStore.players[0].combination().combination}`}
          anchor={{ x: 0, y: 1 }}
          style={style}
          y={+style.fontSize * 4}
        />
      </Container>
    </Stage>
  );
})

export default Test;
