import React, { useState } from "react";
import rootStore from "../../../mobX";
import PokerPlayer from "./Player";
import { Container, useTick } from "@pixi/react";
import { IAppSize } from "../../../types";
import Bets from "./Bets";
import Stats from "../Stats";
import { observer } from "mobx-react-lite";

let i = 0;
const PlayerList: React.FC<IAppSize> = observer((props) => {
  const { gameStore, dataStore } = rootStore;
  const { startCardsAnimation } = dataStore;
  const { players } = gameStore;

  const { size, scaleRatio } = props;
  const [y, setY] = useState(3000);
  const [y2, setY2] = useState(3000);
  const [speed, setSpeed] = useState(0);
  const [changeCard, setChangeCard] = useState(false);

  useTick((delta) => {
    i += 2 * delta;
    setSpeed(prev => prev + 2.7 * delta);

    if (y <= 0 && !changeCard) {
      setY(0);
      setSpeed(0);
      setChangeCard(true);
    }

    if (y2 <= 0) {
      setY2(0);
    }

    if (y > 0 && startCardsAnimation) {
      setY(prev => prev - i * delta);
    }
    else if (y2 > 0 && changeCard) {
      setY2(prev => prev - i * delta);
    }

    if (!startCardsAnimation && speed > 0) {
      i = 0;
      setSpeed(0);
      setY(3000);
      setY2(3000);
      setChangeCard(false);
    }
  });


  return (
    <>
      <Container
        scale={scaleRatio}
        x={size / 2}
        y={size / 2 + 30 * scaleRatio}
      >
        {players && players.map((item, index) =>
          <PokerPlayer
            key={item.id}
            item={item}
            y={y}
            y2={y2}
            index={index}
            scaleRatio={scaleRatio}
          />)}
      </Container>

      <Container
        scale={scaleRatio}
        x={size / 2}
        y={size / 2 - 25 * scaleRatio}
      >
        {players && players.map(item => <Bets key={item.id} item={item} />)}
      </Container>

      <Stats size={size} scaleRatio={scaleRatio} y2={y2} />
    </>
  )
})

export default PlayerList;