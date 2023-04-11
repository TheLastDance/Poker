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
const url = "https://cdn.leonardo.ai/users/592f9706-6d24-4367-aed2-7a96c70365b9/generations/3ebcba18-4fc6-4a51-811f-1cede109dcbe/Leonardo_Diffusion_Generate_for_me_poker_table_background_imag_3.jpg"
const Test: React.FC = observer(() => {
  const { gameStore, dataStore } = rootStore;
  const { players } = gameStore;
  const app = useApp();
  const [x, setX] = useState(0);
  const [y, setY] = useState(0);
  const containerRef0 = useRef<any>(null);
  const containerRef = useRef<any>(null);
  const containerRef2 = useRef<any>(null);
  const stageRef = useRef<any>(null);

  useTick(delta => {
    i += 0.01 * delta;
    setX(Math.sin(i) * 100)
    setY(Math.sin(i / 1.5) * 100)
  });



  return (
    <Stage ref={stageRef} width={1200} height={700} options={{}}>
      <Sprite image={url}
        width={stageRef.current ? stageRef.current.props.width : 300}
        height={stageRef.current ? stageRef.current.props.height : 300}
        x={0}
        y={0}>
      </Sprite>
      {players.length && players.map((item) =>
        <Container ref={containerRef0} key={item.id} x={item.id === 0 ? x : 250 * item.id} y={item.id === 0 ? y : 0}>
          <Text text={`${item.name}`} anchor={{ x: 0, y: 0 }} style={style} />
          <Text text={`stack: ${item.stack}`} anchor={{ x: 0, y: 0 }} style={new TextStyle({ fill: 'red' })} y={+style.fontSize} />
          {item.bigBlind ? <Text text={`BB`} anchor={{ x: 0, y: 0 }} style={new TextStyle({ fill: 'red' })} y={+style.fontSize * 2} /> :
            item.smallBlind ? <Text text={`SB`} anchor={{ x: 0, y: 0 }} style={new TextStyle({ fill: 'red' })} y={+style.fontSize * 2} /> :
              null}
          {item.bet !== 0 && <Text text={`bet: ${item.bet}`} anchor={{ x: 0, y: 0 }} style={style} y={+style.fontSize * 3} />}
          {item.isDiller && <Text text={`Dealer`} anchor={{ x: 0, y: 0 }} style={new TextStyle({ fill: 'red' })} y={+style.fontSize * 4} />}
          {item.isMoving && <Text text={'=>'} anchor={{ x: 0, y: 0 }} style={style} y={+style.fontSize * 5} />}
          {item.turn && <Text text={item.turn} anchor={{ x: 0, y: 0 }} style={style} y={+style.fontSize * 6} />}
          <Container
            x={135}
            y={30}>
            <Sprite
              image={item.hand[0].image}
              scale={0.35}
              x={0}
            >
            </Sprite>
            <Sprite
              image={item.hand[1].image}
              scale={0.35}
              x={35}
              rotation={-50}
            >
            </Sprite>
          </Container>
        </Container>)}


      {dataStore.cardsForPlay.length &&
        <Container
          ref={containerRef2}
          x={containerRef.current && stageRef.current ?
            stageRef.current.props.width / 2 - containerRef2.current.width / 2 : 0}
          y={containerRef.current && stageRef.current ?
            stageRef.current.props.height / 2 - containerRef2.current.height / 2 : 0}
        >
          {gameStore.board.map((item, index) =>
            <Sprite
              key={index}
              image={item.image}
              scale={0.35}
              x={85 * index}
            >
            </Sprite>
          )}
        </Container>
      }


      <Container
        ref={containerRef}
        x={0}
        y={containerRef.current && stageRef.current ? stageRef.current.props.height - containerRef.current.height : 300}>
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
