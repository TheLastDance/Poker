import React from "react";
import rootStore from "../../../mobX";
import { IPlayer } from "../../../types";
import { PixiComponent } from '@pixi/react';
import { Slider } from '@pixi/ui';
import range1 from "../../../assets/range1.png";
import range2 from "../../../assets/range2.png";
import btn_black from "../../../assets/btn_black.png";
import btn_orange from "../../../assets/btn_orange.png";
import btn_green from "../../../assets/btn_green.png";
import chip from "../../../assets/clicker-chip.png";
import { Text, Container } from "@pixi/react";
import Button from "./Button";
import { inputNumberStyle } from "../styles";
import { observer } from "mobx-react-lite";

interface IItem {
  item: IPlayer;
}

const InputRange: React.FC<IItem> = observer(({ item }) => {
  const { gameStore } = rootStore;
  const { gameStore: { handleRaiseInput, handleRaise } } = rootStore;

  const test = new Slider({
    bg: range1,
    slider: chip,
    fill: range2,
    min: gameStore.maxBet - item.bet + 1,
    max: item.stack,
    value: gameStore.playerRaiseAmount,
    fillOffset: {
      x: -2,
      y: 0
    }
  });

  test.onUpdate.connect((value) => handleRaiseInput(value));

  const Input = PixiComponent("InputRange", {
    create: () => test,
  });


  return (
    <Container x={-100} y={50}>
      <Text
        text={gameStore.playerRaiseAmount ? `${gameStore.playerRaiseAmount.toFixed(2)}$` : ""}
        x={200}
        y={0}
        style={inputNumberStyle}
      />

      <Input />

      <Container x={310} y={-3}>
        <Button handleTurn={handleRaise} text="Raise" defaultView={btn_green} hoverView={btn_orange} pressedView={btn_black} />
      </Container>
    </Container>
  );
})

export default InputRange;