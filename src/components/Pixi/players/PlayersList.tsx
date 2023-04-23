import React, { useRef, useState } from "react";
import rootStore from "../../../mobX";
import PokerPlayer from "./Player";
import { Container, useTick } from "@pixi/react";
import { IAppSize, IContainer } from "../../../types";
import Bets from "./Bets";

// let i = 0;
const PlayerList: React.FC<IAppSize> = (props) => {
  const { gameStore } = rootStore;
  const { players } = gameStore;
  // const [a, b] = useState(0);
  //const containerRef = useRef<IContainer>(null);
  // const cSize = containerRef.current;
  // const blockDimensions = {
  //   width: 300,
  //   height: 300,
  // }
  const { size, scaleRatio } = props;

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
        scale={scaleRatio}
        x={size / 2}
        y={size / 2 + 30 * scaleRatio}
      >
        {players && players.map(item => <PokerPlayer key={item.id} item={item} />)}
      </Container>

      <Container
        scale={scaleRatio}
        x={size / 2}
        y={size / 2 - 25 * scaleRatio}
      >
        {players && players.map(item => <Bets key={item.id} item={item} />)}
      </Container>
    </>
  )
}

export default PlayerList;