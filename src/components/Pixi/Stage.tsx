import { Stage, Container } from '@pixi/react';
import React, { useState, useRef, useEffect } from 'react';
import Board from './Board';
import Background from './Background';
import Stats from './Stats';
import PlayerList from './players/PlayersList';
import rootStore from '../../mobX';


const MainStage: React.FC = () => {
  const stageRef = useRef<Stage>(null);
  const [width, setWidth] = useState(0);
  const [height, setHeight] = useState(0);
  const { dataStore } = rootStore;
  const dimensions = window.innerHeight > window.innerWidth ? window.innerWidth : window.innerHeight;

  useEffect(() => {
    const app: Stage | null = stageRef.current;
    if (app) {
      setWidth(app.props.width as number);
      setHeight(app.props.height as number);
    }
  }, [stageRef]);

  // const onResize = () => {
  //   setWidth(window.innerWidth);
  //   setHeight(window.innerHeight);
  // }

  // useEffect(() => {
  //   window.addEventListener("resize", onResize, false);
  //   return () => window.addEventListener("resize", onResize, false);
  // });

  return (
    <Stage ref={stageRef} width={dimensions} height={dimensions} options={{ antialias: true }}>
      {/* {dataStore.assetsLoaded && <>
        <Background appWidth={width} appHeight={height} />
        <PlayerList />
        <Board appHeight={height} appWidth={width} />
        <Stats appHeight={height} />
      </>} */}
      <Background appWidth={width} appHeight={height} />
      <PlayerList appWidth={width} appHeight={height} />
      <Board appHeight={height} appWidth={width} />
      <Stats appHeight={height} />

    </Stage>
  );
}

export default MainStage;