import { Stage } from '@pixi/react';
import React, { useState, useRef, useEffect } from 'react';
import Board from './Board';
import Background from './Background';
import Stats from './Stats';
import PlayerList from './players/PlayersList';

const MainStage: React.FC = () => {
  const [dimensions, setDimensions] = useState(window.innerHeight > window.innerWidth ? window.innerWidth : window.innerHeight);
  const [scaleRatio, setScaleRatio] = useState(1);
  const defaultDimension = 939;

  const onResize = () => {
    setDimensions(window.innerHeight > window.innerWidth ? window.innerWidth : window.innerHeight);
  };

  useEffect(() => {
    window.addEventListener("resize", onResize, false);
    return () => window.addEventListener("resize", onResize, false);
  });

  useEffect(() => {
    const newRatio = dimensions / defaultDimension;
    setScaleRatio(newRatio);
  }, [dimensions]);

  return (
    <Stage width={dimensions} height={dimensions} options={{ antialias: true }}>
      {/* {dataStore.assetsLoaded && <>
        <Background appWidth={width} appHeight={height} />
        <PlayerList />
        <Board appHeight={height} appWidth={width} />
        <Stats appHeight={height} />
      </>} */}
      <Background size={dimensions} />
      <PlayerList size={dimensions} scaleRatio={scaleRatio} />
      <Board size={dimensions} scaleRatio={scaleRatio} />
      <Stats size={dimensions} scaleRatio={scaleRatio} />

    </Stage>
  );
}

export default MainStage;