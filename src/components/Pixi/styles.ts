import { TextStyle } from 'pixi.js';
import { Text } from 'pixi.js';
import { FancyButton } from '@pixi/ui';

export function buttonCreator(text: string, defaultView: string, pressedView: string, hoverView: string) {
  return new FancyButton({
    defaultView: defaultView,
    hoverView: hoverView,
    pressedView: pressedView,
    scale: 0.8,
    text: new Text(text, {
      align: 'center',
      fontFamily: '"Source Sans Pro", Helvetica, sans-serif',
      fontSize: 26,
      fontWeight: '700',
      fill: ['black', '#022f2d'], // gradient
      stroke: "white",
      strokeThickness: 2,
      letterSpacing: 2,
    }),
  });
}

export const style = new TextStyle({
  align: 'center',
  fontFamily: '"Source Sans Pro", Helvetica, sans-serif',
  fontSize: 20,
  fontWeight: '700',
  fill: ['black', '#022f2d'], // gradient
  stroke: 'orange',
  strokeThickness: 2,
  letterSpacing: 2,
  wordWrap: true,
  wordWrapWidth: 440,
});

export const movingStyle = new TextStyle({
  align: 'center',
  fontFamily: '"Source Sans Pro", Helvetica, sans-serif',
  fontSize: 24,
  fontWeight: '600',
  fill: ['red', '#042f2d'], // gradient
  stroke: '#fff',
  strokeThickness: 4,
  letterSpacing: 3,
  wordWrap: true,
  wordWrapWidth: 440,
});

export const inputNumberStyle = new TextStyle({
  fontFamily: '"Source Sans Pro", Helvetica, sans-serif',
  fontSize: 23,
  fontWeight: '600',
});