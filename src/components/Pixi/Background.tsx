import React from "react";
import { Sprite } from "@pixi/react";
import { IAppSizes } from "../../types";
import bg3 from "./../../assets/bg3.jpg"

const Background: React.FC<IAppSizes> = (props) => {
  const { appWidth, appHeight } = props;

  return (
    <Sprite
      image={bg3}
      width={appWidth}
      height={appHeight}
      x={0}
      y={0}>
    </Sprite>
  )
}

export default Background;