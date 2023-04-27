import React, { useState } from "react";
import { Container, Sprite, useTick, Text } from "@pixi/react";
import rootStore from "../../mobX";
import { IAppSize } from "../../types";
import { style } from "./styles";
import { observer } from "mobx-react-lite";

const Board: React.FC<IAppSize> = observer((props) => {
  const { size, scaleRatio } = props;
  const { gameStore } = rootStore;
  const { board } = gameStore;
  const [x, setX] = useState(0);
  const [hover, setHover] = useState(false);
  const cardDistance = 250;

  const textArray = [
    `${gameStore.bank.toFixed(2)}$`,
    `ROUND: ${gameStore.round}`,
  ];

  useTick(delta => {
    if (gameStore.boardAnimation && x <= 750) {
      setX(prev => prev + 8.5 * delta);
    }
    if (!gameStore.boardAnimation) {
      setX(0);
    }
  });

  const onHover = () => {
    setHover(prev => !prev);
  };

  const exp = hover ? -cardDistance * board.length * 0.4 / 2 * scaleRatio : -cardDistance * board.length * 0.32 / 2 * scaleRatio;

  return (
    <Container
      x={size / 2}
      y={size / 2}
    >
      <Container
        x={0}
        y={!board.length ? -50 * scaleRatio : -100 * scaleRatio}
        scale={0.8 * scaleRatio}
      >
        {textArray.map((item, index) =>
          <Text
            key={index}
            text={item}
            anchor={[0.5]}
            style={style}
            y={+style.fontSize * (index + 1)}
            scale={index === 1 ? 0.6 : 1.4}
          />
        )}
      </Container>
      <Container
        eventMode="static"
        cursor="pointer"
        sortableChildren={true}
        scale={hover ? 0.4 * scaleRatio : 0.32 * scaleRatio}
        x={exp}
        onpointerdown={onHover}
      >
        {board.map((item, index) =>
          <Sprite
            key={index}
            image={item.image}
            anchor={[0, 0.5]}
            x={x <= index * cardDistance && index < 3 ? x : cardDistance * index}
            zIndex={index === 0 ? 3 : index === 1 ? 2 : 0}
          >
          </Sprite>
        )}
      </Container>

    </Container>

  )
})

export default Board;