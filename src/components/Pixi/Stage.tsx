import { Stage } from '@pixi/react';
import React, { useState, useRef, useEffect } from 'react';
import Board from './Board';
import Background from './Background';
import Stats from './Stats';
import PlayerList from './players/PlayersList';
//OBSERVER WAS DELETED

const MainStage: React.FC = () => {
  const stageRef = useRef<Stage>(null);
  const [width, setWidth] = useState(0);
  const [height, setHeight] = useState(0);

  useEffect(() => {
    const app: Stage | null = stageRef.current;
    if (app) {
      setWidth(app.props.width as number);
      setHeight(app.props.height as number);
    }
  }, [stageRef]);

  return (
    <Stage ref={stageRef} width={1200} height={700} options={{}}>
      <Background appWidth={width} appHeight={height} />
      <PlayerList />

      <Board appHeight={height} appWidth={width} />
      <Stats appHeight={height} />

    </Stage>
  );
}

export default MainStage;