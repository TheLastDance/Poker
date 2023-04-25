import React, { useRef, useState } from "react";
import { Container, Sprite, useTick, Text, withFilters } from "@pixi/react";
import { IContainer } from "../../types";
import rootStore from "../../mobX";
import { IAppSize } from "../../types";
import { style, outline } from "./styles";

const Board: React.FC<IAppSize> = (props) => {
  const containerRef = useRef<IContainer>(null);
  const cSize = containerRef.current;
  const { size, scaleRatio } = props;
  const { gameStore } = rootStore;
  const { board } = gameStore;
  const [x, setX] = useState(0);

  const textArray = [
    `${gameStore.bank.toFixed(2)}$`,
    `ROUND: ${gameStore.round}`,
  ];

  useTick(delta => {
    if (gameStore.boardAnimation) {
      setX(prev => prev + 8.5 * delta);
    }
    if (!gameStore.boardAnimation) {
      setX(0);
    }
  });

  //console.log(cSize ? cSize.width : 0);


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
            scale={index === 1 ? 0.6 : 1}
          />
        )}
      </Container>
      <Container
        filters={[outline(scaleRatio)]}
        ref={containerRef}
        scale={0.32 * scaleRatio}
        x={cSize ? -cSize?.width / 2 : 0}
        y={cSize ? -cSize?.height / 2 : 0}
      >
        {board.map((item, index) =>
          <Sprite
            key={index}
            image={item.image}
            x={x >= index * 250 ? 250 * index : x}
          >
          </Sprite>
        )}
      </Container>

    </Container>

  )
}

export default Board;