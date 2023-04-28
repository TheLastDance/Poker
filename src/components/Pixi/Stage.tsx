import { Stage } from '@pixi/react';
import React, { useState, useEffect } from 'react';
import Board from './Board';
import Background from './Background';
import PlayerList from './players/PlayersList';
import Icons from './Icons';
import Spinner from './Spinner';
import rootStore from '../../mobX';

const MainStage: React.FC = () => {
  const { dataStore } = rootStore;
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
    <Stage width={dimensions} height={dimensions} options={{}}>

      {dataStore.assetsLoaded ?
        <>
          <Background size={dimensions} />
          <PlayerList size={dimensions} scaleRatio={scaleRatio} />
          <Board size={dimensions} scaleRatio={scaleRatio} />
          <Icons size={dimensions} scaleRatio={scaleRatio} />
        </> :
        <Spinner size={dimensions} scaleRatio={scaleRatio} />}

    </Stage>
  );
}

export default MainStage;