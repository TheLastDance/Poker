import React from "react";
import { Sprite, Container } from "@pixi/react";
import { IBot, IPlayer, TurnsEnum } from "../../../types";
import card_back from "../../../assets/card_back3.png"
import { Player } from "../../../mobX/playerStore";
import rootStore from "../../../mobX";
import { observer } from "mobx-react-lite";

interface IProps {
  item: IBot | IPlayer;
  y: number;
  y2: number;
  index: number;
  scaleRatio: number;
}

const Hand: React.FC<IProps> = observer((props) => {
  const { gameStore } = rootStore;
  const { item, y, y2, scaleRatio } = props;

  const player = item instanceof Player;
  const exp = player && y >= 0 || gameStore.isShowDown && item.turn !== TurnsEnum.fold;

  return (
    <Container
      scale={player ? 0.47 : scaleRatio < 0.5 && exp ? 0.45 : 0.32}
      pivot={[50, 0]}
    >
      <Sprite
        image={exp ? item.hand[0].image : card_back}
        y={scaleRatio < 0.5 ? y - 25 : y}
        x={player ? 30 : 0}
        anchor={player ? [0.5, 0.8] : [0.5, 0.32]}
        rotation={y > 0 ? y / 100 : scaleRatio < 0.5 ? 0 : -0.15}
      >
      </Sprite>
      <Sprite
        image={exp ? item.hand[1].image : card_back}
        anchor={player ? [0.5, 0.8] : [0.5, 0.32]}
        x={player && scaleRatio >= 0.5 ? 60 : 90}
        y={scaleRatio < 0.5 ? y2 - 25 : y2 + 20}
        rotation={y2 > 0 ? y2 / 100 : scaleRatio < 0.5 ? 0 : 0.3}
      >
      </Sprite>
    </Container>
  )
})

export default Hand;
