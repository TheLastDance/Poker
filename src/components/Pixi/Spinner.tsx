import React, { useState } from "react";
import { Sprite, useTick, Text, Container } from "@pixi/react";
import { IAppSize } from "../../types";
import spinner from "../../assets/ace.png";
import rootStore from "../../mobX";
import { style } from "./styles";
import { observer } from "mobx-react-lite";

const Spinner: React.FC<IAppSize> = observer((props) => {
  const { dataStore } = rootStore;
  const { progress } = dataStore;
  const { size, scaleRatio } = props;
  const [angle, setAngle] = useState(0);

  useTick((delta) => {
    setAngle(prev => prev + 0.02 * delta);
  });

  return (
    <Container
      x={size / 2}
      y={size / 2}
    >
      <Sprite
        image={spinner}
        anchor={[0.5]}
        scale={0.25 * scaleRatio}
        rotation={angle}
      />
      <Text
        y={- 200 * scaleRatio}
        style={style}
        anchor={[0.5]}
        text={`Loading ${(progress * 100).toFixed(0)}%`}
      />
    </Container>
  )
})

export default Spinner;