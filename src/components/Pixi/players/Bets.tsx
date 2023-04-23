import React from "react";
import rootStore from "../../../mobX";
import { Text, Sprite } from "@pixi/react";
import { IPlayer, IBot } from "../../../types";
import { style } from "../styles";

const Bets: React.FC<{ item: IBot | IPlayer; }> = ({ item }) => {
  const { formStore } = rootStore;
  const { opponents } = formStore;
  const x = 180 * Math.sin((Math.PI * 2) / (Number(opponents) + 1) * (- item.id));
  const y = 180 * Math.cos((Math.PI * 2) / (Number(opponents) + 1) * (- item.id));
  const exp = +opponents === 4 && (item.id === 4 || item.id === 1);
  const exp2 = +opponents === 3 && (item.id === 1 || item.id === 3);

  return (
    <>
      {item.bet > 0 &&
        <Text
          key={item.id}
          text={`${item.bet.toFixed(2)}$`}
          anchor={[0.5]}
          style={style}
          scale={0.8}
          x={x}
          y={exp || exp2 ? y + 90 : y}
        />
      }
    </>

  )
}

export default Bets;