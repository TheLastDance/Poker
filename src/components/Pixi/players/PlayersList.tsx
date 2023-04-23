import React, { useRef, useState } from "react";
import rootStore from "../../../mobX";
import PokerPlayer from "./Player";
import { Container, useTick } from "@pixi/react";
import { IAppSizes, IContainer } from "../../../types";
import Bets from "./Bets";

// let i = 0;
const PlayerList: React.FC<IAppSizes> = (props) => {
  const { gameStore } = rootStore;
  const { players } = gameStore;
  // const [a, b] = useState(0);
  const containerRef = useRef<IContainer>(null);
  const cSize = containerRef.current;
  const blockDimensions = {
    width: 300,
    height: 300,
  }
  const { appHeight, appWidth } = props;

  // useTick(delta => {
  //   i += 0.01 * delta;
  //   b(i);
  // })

  //console.log(cSize ? cSize?.width : 0); // check that cSize is undefined after deleting people from array
  // YES PROBLEM WAS IN CSIZE
  //containerRef.current ? containerRef.current.width / 2 :
  //containerRef.current ? containerRef.current.height / 2 : 
  return (
    <>
      <Container
        scale={1}
        ref={containerRef}
        x={appWidth / 2}
        y={appHeight / 2 + 30}
      >
        {players && players.map(item => <PokerPlayer key={item.id} item={item} />)}
      </Container>
      <Container
        scale={1}
        x={appWidth / 2}
        y={appHeight / 2 - 25}
      >
        {players && players.map(item => <Bets key={item.id} item={item} />)}
      </Container>
    </>
  )
}

export default PlayerList;