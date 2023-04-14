import React, { useRef, useState } from "react";
import { Container, Sprite, useTick } from "@pixi/react";
import { IContainer } from "../../types";
import rootStore from "../../mobX";
import { IAppSizes } from "../../types";
let i = 0;
const Board: React.FC<IAppSizes> = (props) => {
  const containerRef = useRef<IContainer>(null);
  const cSize = containerRef.current;
  const { appHeight, appWidth } = props;

  const { gameStore } = rootStore;
  const { board } = gameStore;
  const [a, b] = useState(0);
  useTick(delta => {
    i += 0.01 * delta;
    b(i);
  })

  return (

    <Container
      ref={containerRef}
      scale={0.35}
      x={cSize ? appWidth / 2 - cSize.width / 2 : 0}
      y={cSize ? appHeight / 2 - cSize.height / 2 : 0}
      rotation={a}
      pivot={[400, 80]}
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

  )
}

export default Board;