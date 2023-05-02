import React, { useState } from "react";
import { Container, Sprite, useTick } from "@pixi/react";
import rootStore from "../../mobX";
import { IAppSize } from "../../types";
import { observer } from "mobx-react-lite";
import sound_icon from "../../assets/sound.png";
import no_sound_icon from "../../assets/no-sound.png";
import music_icon from "../../assets/music.png";
import no_music_icon from "../../assets/no-music.png";
import cards_rules from "../../assets/cards-rules.png";
import rules from "../../assets/rules.jpg";

const Icons: React.FC<IAppSize> = observer((props) => {
  const { dataStore: { isMusicOn, isSoundOn, handleSound, handleMusic } } = rootStore;
  const { size, scaleRatio } = props;
  const [isRulesOpen, setIsRulesOpen] = useState(false);
  const [x, setX] = useState(-250);

  const handleRules = () => {
    setIsRulesOpen(prev => !prev);
  }

  useTick((delta) => {
    if (isRulesOpen && x < 80) {
      setX(prev => prev + 5 * delta);
    }
    if (!isRulesOpen && x > -250) {
      setX(prev => prev - 5 * delta);
    }
  });

  return (
    <Container
      scale={scaleRatio}
      x={size - 80 * scaleRatio}
      y={20 * scaleRatio}
    >
      {isSoundOn ?
        <Sprite
          scale={0.9}
          eventMode="static"
          cursor="pointer"
          onpointerdown={handleSound}
          image={sound_icon}
        /> :
        <Sprite
          scale={0.9}
          eventMode="static"
          cursor="pointer"
          onpointerdown={handleSound}
          image={no_sound_icon}
        />
      }

      {isMusicOn ?
        <Sprite
          scale={1.5}
          eventMode="static"
          cursor="pointer"
          onpointerdown={handleMusic}
          image={music_icon}
          y={65}
        /> :
        <Sprite
          scale={1.5}
          eventMode="static"
          cursor="pointer"
          onpointerdown={handleMusic}
          image={no_music_icon}
          y={65}
        />
      }

      <Sprite
        scale={0.8}
        eventMode="static"
        cursor="pointer"
        onpointerdown={handleRules}
        image={cards_rules}
        y={150}
        x={5}
      />

      <Sprite
        scale={1}
        image={rules}
        y={-20}
        x={x < 80 ? -size / scaleRatio + x : -size / scaleRatio + 80}
      />

    </Container>
  )
});

export default Icons;


