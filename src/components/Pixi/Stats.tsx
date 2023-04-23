import React from "react";
import { Container, Text } from "@pixi/react";
import { IAppSize } from "../../types";
import rootStore from "../../mobX";
import { style } from "./styles";

const Stats: React.FC<IAppSize> = (props) => {
  const { size, scaleRatio } = props;
  const { gameStore, dataStore } = rootStore;

  const textArray = [
    `BANK: ${gameStore.bank.toFixed(2)}`,
    `ROUND: ${gameStore.round}`,
    `PLAYED HANDS: ${dataStore.handsCount}`,
    `YOUR COMBINATION: ${gameStore.players ? gameStore.players[0].combination().combination : null}`
  ]

  return (
    <Container
      x={0}
      y={size - 85 * scaleRatio}
      scale={scaleRatio}
    >
      {textArray.map((item, index) =>
        <Text
          cursor="pointer"
          eventMode="static"
          pointerdown={() => console.log("123")}
          key={index}
          text={item}
          anchor={{ x: 0, y: 1 }}
          style={style}
          y={+style.fontSize * (index + 1)}
        />
      )}
    </Container>
  )
}

export default Stats;