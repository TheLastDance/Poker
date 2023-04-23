import React from "react";
import rootStore from "../../../mobX";
import { IPlayer, TurnsEnum } from "../../../types";
import btn_red from "../../../assets/btn_red.png";
import btn_black from "../../../assets/btn_black.png";
import btn_orange from "../../../assets/btn_orange.png";
import btn_blue from "../../../assets/btn_blue.png";
import { Container, Text, } from "@pixi/react";
import InputRange from "./InputRange";
import Button from "./Button";

interface IItem {
  item: IPlayer;
}

const { allIn } = TurnsEnum;


const Buttons: React.FC<IItem> = ({ item }) => {
  const { gameStore } = rootStore;
  const { gameStore: { handleCall, handleCheck, handleFold, handleAllIn } } = rootStore;

  // const button = buttonCreator("CALL", btn_red, btn_black);

  // button.onPress.connect(() => console.log('Button pressed!'));

  // const Button = PixiComponent("Button", {
  //   create: () => button,
  // });

  return (
    <Container
      x={50}
      y={0}
    >
      <Container x={50}>
        <Button handleTurn={handleFold} text="Fold" defaultView={btn_red} hoverView={btn_orange} pressedView={btn_black} />
      </Container>
      {item.bet === gameStore.maxBet && item.turn !== allIn ?
        <Container x={180}>
          <Button handleTurn={handleCheck} text="Check" defaultView={btn_blue} hoverView={btn_orange} pressedView={btn_black} />
        </Container> :
        item.stack + item.bet > gameStore.maxBet ?
          <Container x={180}>
            <Button handleTurn={handleCall} text="Call" defaultView={btn_blue} hoverView={btn_orange} pressedView={btn_black} />
          </Container> : null}
      {item.stack + item.bet > gameStore.maxBet + 1 ?
        <InputRange item={item} /> :
        <Container x={180}>
          <Button handleTurn={handleAllIn} text="All-In" defaultView={btn_blue} hoverView={btn_orange} pressedView={btn_black} />
        </Container>}
    </Container>
  );
}

export default Buttons;