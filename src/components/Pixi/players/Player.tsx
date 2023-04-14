import React, { useRef, useState } from "react";
import { Container, Text, useTick } from "@pixi/react";
import { IBot, IContainer, IPlayer } from "../../../types";
import Hand from "./Hand";
import { style } from "../styles";

let i = 0;
const Player: React.FC<{ item: IBot | IPlayer; }> = ({ item }) => {
  const containerRef = useRef<IContainer>(null);
  const cSize = containerRef.current;
  const [x, setX] = useState(0);
  const [y, setY] = useState(0);

  useTick(delta => {
    i += 0.01 * delta;
    setX(Math.sin(i) * 10)
    setY(Math.sin(i / 1.5) * 10)
  });

  return (
    <Container x={item.id === 0 ? x : 250 * item.id} y={item.id === 0 ? y : 0}>
      <Container ref={containerRef} >
        <Text
          text={`${item.name}`}
          anchor={{ x: 1, y: 0 }}
          x={cSize ? cSize.width : 0}
          style={style}
        />
        <Text
          text={`stack: ${item.stack}`}
          anchor={{ x: 0, y: 0 }}
          style={style}
          scale={0.8}
          y={+style.fontSize}
        />

        {item.bigBlind ?
          <Text text={`BB`}
            anchor={{ x: 0, y: 0 }}
            style={style}
            scale={0.9}
            y={+style.fontSize * 2}
          /> :
          item.smallBlind ?
            <Text
              text={`SB`}
              anchor={{ x: 0, y: 0 }}
              style={style}
              scale={0.9}
              y={+style.fontSize * 2}
            /> : null}

        {item.bet !== 0 &&
          <Text
            text={`bet: ${item.bet}`}
            anchor={{ x: 0, y: 0 }}
            style={style}
            scale={0.8}
            y={+style.fontSize * 3}
          />}

        {item.isDiller &&
          <Text text={`Dealer`}
            anchor={{ x: 0, y: 0 }}
            style={style}
            scale={0.8}
            y={+style.fontSize * 4}
          />}

        {item.isMoving &&
          <Text text={'=>'}
            anchor={{ x: 0, y: 0 }}
            style={style}
            scale={0.7}
            y={+style.fontSize * 5}
          />}

        {item.turn &&
          <Text
            text={item.turn}
            anchor={{ x: 0, y: 0 }}
            style={style}
            y={+style.fontSize * 6}
          />}

      </Container>
      <Hand hand={item.hand} />
    </Container>
  )
}

export default Player;