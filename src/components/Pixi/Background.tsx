import React from "react";
import { Sprite } from "@pixi/react";
import { IAppSizes } from "../../types";

const url = "https://cdn.leonardo.ai/users/592f9706-6d24-4367-aed2-7a96c70365b9/generations/3ebcba18-4fc6-4a51-811f-1cede109dcbe/Leonardo_Diffusion_Generate_for_me_poker_table_background_imag_3.jpg"

const Background: React.FC<IAppSizes> = (props) => {
  const { appWidth, appHeight } = props;

  return (
    <Sprite image={url}
      width={appWidth}
      height={appHeight}
      x={0}
      y={0}>
    </Sprite>
  )
}

export default Background;