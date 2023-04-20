import React from "react";
import { Sprite, Container } from "@pixi/react";
import { IBot } from "../../../types";


const Hand: React.FC<{ hand: IBot["hand"]; }> = ({ hand }) => {
  return (
    <Container
      x={140}
      y={30}
      scale={0.3}
    >
      <Sprite
        image={hand[0]?.image}
      >
      </Sprite>
      <Sprite
        image={hand[1]?.image}
        x={100}
        pivot={0}
        angle={15}
      >
      </Sprite>
    </Container>
  )
}

export default Hand;