import React, { useRef, useState } from "react";
import { Container, Text, useTick, Sprite } from "@pixi/react";
import { IBot, IContainer, IPlayer } from "../../../types";
import Hand from "./Hand";
import { style, movingStyle } from "../styles";
import rootStore from "../../../mobX";
import Buttons from "../buttons/Buttons";
import { Player } from "../../../mobX/playerStore";
import speech from "../../../assets/speech.png";
import chip from "../../../assets/chip.png";
import BBchip from "../../../assets/bb-chip.png";
import SBchip from "../../../assets/sb-chip.png";

interface IProps {
  item: IBot | IPlayer;
  y: number;
  y2: number;
  index: number;
  scaleRatio: number;
}

const PokerPlayer: React.FC<IProps> = (props) => {
  const containerRef = useRef<IContainer>(null);
  const { formStore, gameStore } = rootStore;
  const { item, y, y2, scaleRatio, index } = props;
  const { players } = gameStore;
  const { opponents } = formStore;

  const angle = (Math.PI * 2) / (Number(opponents) + 1) * (- item.id);

  return (
    <Container ref={containerRef}
      x={325 * Math.sin(angle)}
      y={325 * Math.cos(angle)}
    >
      <Container>
        <Sprite
          anchor={[0.5, 0.9]}
          width={150}
          height={150}
          x={0}
          y={0}
          image={item.info.avatar}
          zIndex={5}
        />
        {item.turn &&
          <Container
            x={-100}
            y={+opponents === 4 && item.id === 4 ? -25 : -65}
          >
            <Sprite
              anchor={[0.5, 1]}
              width={80}
              height={50}
              image={speech}
            />
            <Text
              text={`${item.turn}`}
              anchor={[0.5, 0]}
              y={-45}
              style={style}
            />
          </Container>}
        <Text
          text={`${item.info.name}`}
          anchor={[0.5, 1]}
          pivot={[0, 145]}
          style={item.isMoving ? movingStyle : style}
        />
        <Text
          text={`${item.stack.toFixed(2)}$`}
          anchor={[0.5, 1]}
          pivot={[0, 130]}
          style={style}
          scale={1}
        />

        {players.length > 2 && item.bigBlind &&
          <Sprite
            anchor={[0.5, 1]}
            width={30}
            height={30}
            image={BBchip}
            x={-70}
            y={25}
          />
        }

        {players.length > 2 && item.smallBlind &&
          <Sprite
            anchor={[0.5, 1]}
            width={30}
            height={30}
            image={SBchip}
            x={-70}
            y={25}
          />
        }

        {item.isDiller &&
          <Sprite
            anchor={[0.5, 1]}
            width={30}
            height={30}
            image={chip}
            x={-70}
            y={25}
          />
        }

      </Container>
      <Hand item={item} y={y} y2={y2} index={index} scaleRatio={scaleRatio} />
      {item.isMoving && item instanceof Player && !gameStore.isGameOver && <Buttons item={item} />}
    </Container>
  )
}

export default PokerPlayer;