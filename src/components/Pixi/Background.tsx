import React from "react";
import { Sprite } from "@pixi/react";
import { IAppSizes } from "../../types";
import bg from "./../../assets/bg.jpg"

const Background: React.FC<IAppSizes> = (props) => {
  const { appWidth, appHeight } = props;

  return (
    <Sprite
      image={bg}
      width={appWidth}
      height={appHeight}
      x={0}
      y={0}>
    </Sprite>
  )
}

export default Background;