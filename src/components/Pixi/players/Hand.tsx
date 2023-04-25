import React, { useState } from "react";
import { Sprite, Container, useTick } from "@pixi/react";
import { IBot, IPlayer, TurnsEnum } from "../../../types";
import card_back from "../../../assets/card_back3.png"
import { Player } from "../../../mobX/playerStore";
import rootStore from "../../../mobX";
import { observer } from "mobx-react-lite";
import { outline } from "../styles";

interface IProps {
  item: IBot | IPlayer;
  y: number;
  y2: number;
  index: number;
  scaleRatio: number;
}

const Hand: React.FC<IProps> = observer((props) => {
  const { gameStore, dataStore, formStore: { opponents } } = rootStore;
  const { startCardsAnimation } = dataStore;
  const { item, y, y2, scaleRatio, index } = props;
  const angle = (Math.PI * 2) / (Number(opponents) + 1) * (- item.id);

  // const [y, setY] = useState(0);

  // const [y2, setY2] = useState(0);
  // const [speed, setSpeed] = useState(0);

  // useTick((delta) => {
  //   setSpeed(prev => prev + 1.2 * delta);


  //   if ((speed >= 3000 * (index)) && startCardsAnimation) {
  //     //setSpeed(0);
  //     setY(prev => prev + speed);
  //   }

  //   if ((speed >= 3000 * (index + 1) * 2) && startCardsAnimation) {
  //     //setSpeed(0);
  //     setY2(prev => prev + speed);
  //   }

  //   if (!startCardsAnimation) {
  //     setSpeed(0);
  //     setY(3000 * (index + 1));
  //     setY2(3000 * (index + 1) * 2);
  //   }
  // });

  const exp = item instanceof Player && y >= 0 || gameStore.isShowDown && item.turn !== TurnsEnum.fold;

  return (
    <Container
      scale={0.32}
      pivot={[50, 0]}
    >
      <Sprite
        filters={[outline(scaleRatio)]}
        y={y}
        anchor={[0.5, 0.32]}
        angle={-5}
        rotation={y > 0 ? y / 100 : -0.1}
        image={exp ? item.hand[0].image : card_back}
      >
      </Sprite>
      <Sprite
        filters={[outline(scaleRatio)]}
        image={exp ? item.hand[1].image : card_back}
        anchor={[0.5, 0.32]}
        x={90}
        y={y2 + 20}
        angle={15}
        rotation={y2 > 0 ? y2 / 100 : 0.3} // better to do with angle
      >
      </Sprite>
    </Container>
  )
})

export default Hand;
