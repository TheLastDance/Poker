import React from "react";
import { Container, Text, Sprite } from "@pixi/react";
import { IAppSize } from "../../types";
import rootStore from "../../mobX";
import { style, outline } from "./styles";
import { observer } from "mobx-react-lite";
import { Player } from "../../mobX/playerStore";

const Stats: React.FC<IAppSize & { y2: number; }> = observer((props) => {
  const { size, scaleRatio, y2 } = props;
  const { gameStore, dataStore } = rootStore;
  const comb = gameStore.players[0].combination();
  const bestHand = comb.bestHand;

  return (
    <Container>
      <Container>
        <Text
          scale={scaleRatio}
          text={`HANDS PLAYED: ${dataStore.handsCount}`}
          style={style}
        />
      </Container>
      {gameStore.players[0] instanceof Player && y2 <= 0 &&
        <Container
          x={0}
          y={size - 85 * scaleRatio}
          scale={scaleRatio}
        >
          <Container
            scale={0.25}
            filters={[outline(scaleRatio)]}
          >
            {bestHand.map((item, index) =>
              <Sprite
                x={index * 250}
                y={-150}
                anchor={[-0.1, 0]}
                key={`${item.value}${item.suit}`}
                image={bestHand[index].image}
              />)}
          </Container>

          <Container>
            <Text
              y={50}
              text={`YOUR COMBINATION: ${comb.combination}`}
              style={style}
            />
          </Container>

        </Container>}
    </Container>

  )
})

export default Stats;