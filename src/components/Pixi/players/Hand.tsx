import React from "react";
import { Sprite, Container } from "@pixi/react";
import { IBot, IPlayer, TurnsEnum } from "../../../types";
import card_back from "../../../assets/card_back3.png"
import { Player } from "../../../mobX/playerStore";
import rootStore from "../../../mobX";


const Hand: React.FC<{ item: IBot | IPlayer; }> = ({ item }) => {
  const { gameStore } = rootStore;
  const exp = item instanceof Player || gameStore.isShowDown && item.turn !== TurnsEnum.fold;
  return (
    <Container
      scale={0.32}
      pivot={[50, 0]}
    >
      <Sprite
        x={10}
        anchor={[0.5, 0.32]}
        angle={-5}
        image={exp ? item.hand[0].image : card_back}
      >
      </Sprite>
      <Sprite
        image={exp ? item.hand[1].image : card_back}
        anchor={[0.5, 0.32]}
        x={90}
        y={20}
        angle={15}

      >
      </Sprite>
    </Container>
  )
}

export default Hand;