import React, { useRef } from "react";
import { Container, Text } from "@pixi/react";
import { IAppSizes, IContainer } from "../../types";
import rootStore from "../../mobX";
import { style } from "./styles";

const Stats: React.FC<Pick<IAppSizes, "appHeight">> = (props) => {
  const containerRef = useRef<IContainer>(null);
  const cSize = containerRef.current;
  const { appHeight } = props;
  const { gameStore, dataStore } = rootStore;

  const textArray = [
    `BANK: ${gameStore.bank.toFixed(2)}`,
    `ROUND: ${gameStore.round}`,
    `PLAYED HANDS: ${dataStore.handsCount}`,
    `YOUR COMBINATION: ${gameStore.players ? gameStore.players[0].combination().combination : null}`
  ]

  return (
    <Container
      ref={containerRef}
      x={0}
      y={cSize ? appHeight - cSize.height : 300}>
      {textArray.map((item, index) =>
        <Text
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