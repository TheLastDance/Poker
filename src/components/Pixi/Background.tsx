import React from "react";
import { Sprite } from "@pixi/react";
import { IAppSizes } from "../../types";
import bg1 from "./../../assets/bg1.jpg"

const Background: React.FC<IAppSizes> = (props) => {
  const { appWidth, appHeight } = props;

  return (
    <Sprite
      image={bg1}
      width={appWidth}
      height={appHeight}
      x={0}
      y={0}>
    </Sprite>
  )
}

export default Background;