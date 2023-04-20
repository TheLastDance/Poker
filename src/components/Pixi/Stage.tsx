import { Stage } from '@pixi/react';
import React, { useState, useRef, useEffect } from 'react';
import Board from './Board';
import Background from './Background';
import Stats from './Stats';
import PlayerList from './players/PlayersList';
import rootStore from '../../mobX';
//OBSERVER WAS DELETED

const MainStage: React.FC = () => {
  const stageRef = useRef<Stage>(null);
  const [width, setWidth] = useState(0);
  const [height, setHeight] = useState(0);
  const { dataStore } = rootStore;

  useEffect(() => {
    const app: Stage | null = stageRef.current;
    if (app) {
      setWidth(app.props.width as number);
      setHeight(app.props.height as number);
    }
  }, [stageRef]);

  return (
    <Stage ref={stageRef} width={1000} height={1000} options={{}}>
      {/* {dataStore.assetsLoaded && <>
        <Background appWidth={width} appHeight={height} />
        <PlayerList />
        <Board appHeight={height} appWidth={width} />
        <Stats appHeight={height} />
      </>} */}
      <Background appWidth={width} appHeight={height} />
      <PlayerList />
      <Board appHeight={height} appWidth={width} />
      <Stats appHeight={height} />
    </Stage>
  );
}

export default MainStage;