import React from "react";
import { Sprite } from "@pixi/react";
import { IAppSize } from "../../types";
import bg from "./../../assets/bg.jpg"

const Background: React.FC<Pick<IAppSize, "size">> = (props) => {
  const { size } = props;

  return (
    <Sprite
      image={bg}
      width={size}
      height={size}
      x={0}
      y={0}>
    </Sprite>
  )
}

export default Background;