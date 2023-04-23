import React, { useRef, useState } from "react";
import { Container, Sprite, useTick, Text } from "@pixi/react";
import { IContainer } from "../../types";
import rootStore from "../../mobX";
import { IAppSizes } from "../../types";
import { style } from "./styles";

let i = 0;
const Board: React.FC<IAppSizes> = (props) => {
  const containerRef = useRef<IContainer>(null);
  const cSize = containerRef.current;
  const { appHeight, appWidth } = props;
  const { gameStore } = rootStore;
  const { board } = gameStore;
  const [x, setX] = useState(0);

  const textArray = [
    `${gameStore.bank.toFixed(2)}$`,
    `ROUND: ${gameStore.round}`,
  ]

  useTick(delta => {
    i += 0.01 * delta;
    setX(i);
  });

  //console.log(cSize ? cSize.width : 0);


  return (
    <Container
      x={appWidth / 2}
      y={appHeight / 2}
    >
      <Container
        x={0}
        y={gameStore.round === "pre-flop" ? -50 : -100}
        scale={0.8 * 1}
      >
        {textArray.map((item, index) =>
          <Text
            key={index}
            text={item}
            anchor={[0.5]}
            style={style}
            y={+style.fontSize * (index + 1)}
            scale={index === 1 ? 0.6 : 1}
          />
        )}
      </Container>
      <Container
        ref={containerRef}
        scale={0.3 * 1}
        x={cSize ? -cSize?.width / 2 : 0}
        y={cSize ? -cSize?.height / 2 : 0}
      >
        {board.map((item, index) =>
          <Sprite
            key={index}
            image={item.image}
            x={250 * index}
          >
          </Sprite>
        )}
      </Container>

    </Container>

  )
}

export default Board;