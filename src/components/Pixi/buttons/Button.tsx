import React from "react";
import { PixiComponent } from '@pixi/react';
import { buttonCreator } from "../styles";

interface IProps {
  text: string;
  defaultView: string;
  pressedView: string;
  hoverView: string;
  handleTurn: () => void;
}

const Button: React.FC<IProps> = (props) => {
  const { text, defaultView, pressedView, hoverView, handleTurn } = props;

  const Button = PixiComponent("Button", {
    create: () => {
      const button = buttonCreator(text, defaultView, pressedView, hoverView);
      button.onPress.connect(() => handleTurn());
      return button;
    },
  });

  return (
    <Button />
  );
}

export default Button;