import React, { useRef, useState } from "react";
import { Container, Text, useTick, Sprite } from "@pixi/react";
import { IBot, IContainer, IPlayer, TurnsEnum } from "../../../types";
import Hand from "./Hand";
import { name, movingStyle, money2, turnStyle, statsStyle } from "../styles";
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
  const { players, moneyWinners } = gameStore;
  const { opponents } = formStore;
  const [x, setX] = useState(0);

  const angle = (Math.PI * 2) / (Number(opponents) + 1) * (- item.id);
  const player = item instanceof Player;

  const exp = gameStore.isShowDown && item.turn !== TurnsEnum.fold;
  const tookBank = moneyWinners.find(el => item.id === el.id);

  useTick((delta) => {
    if (moneyWinners.length && tookBank) {
      setX(prev => prev + 0.12 * delta);
    }
  });

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
          visible={player ? false : true}
        />
        {item.turn &&
          <Container
            x={player ? -120 : -100}
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
              style={turnStyle}
            />
          </Container>}
        <Text
          text={`${item.info.name}`}
          anchor={[0.5, 1]}
          y={player ? -145 : -140}
          style={item.isMoving ? movingStyle : name}
        />
        <Text
          text={`${item.stack.toFixed(2)}$`}
          anchor={[0.5, 1]}
          y={player ? -130 : -125}
          style={money2}
          scale={1}
        />

        {players.length > 2 && item.bigBlind &&
          <Sprite
            anchor={[0.5, 1]}
            width={30}
            height={30}
            image={BBchip}
            x={-75}
            y={25}
          />
        }

        {players.length > 2 && item.smallBlind &&
          <Sprite
            anchor={[0.5, 1]}
            width={30}
            height={30}
            image={SBchip}
            x={-75}
            y={25}
          />
        }

        {item.isDiller &&
          <Sprite
            anchor={[0.5, 1]}
            width={30}
            height={30}
            image={chip}
            x={-75}
            y={25}
          />
        }

      </Container>
      <Hand item={item} y={y} y2={y2} index={index} scaleRatio={scaleRatio} />
      {moneyWinners.length && tookBank ? <Text
        text={`+${tookBank.winningAmount.toFixed(2)}$`}
        style={statsStyle}
        anchor={0.5}
        y={-100}
        x={Math.PI / 0.5 * Math.sin(x) + 70}
      /> : null}
      {exp &&
        <Text
          text={item.combination().combination}
          style={statsStyle}
          anchor={[0.5, 0]}
          y={player && scaleRatio >= 0.5 ? 10 : player && scaleRatio < 0.5 ? -15 : !player && scaleRatio < 0.5 ? 50 : 35}
        />
      }
      {item.isMoving && player && !gameStore.isGameOver && <Buttons item={item} />}
    </Container>
  )
}

export default PokerPlayer;