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

export const statsStyle = new TextStyle({
  align: 'center',
  fontFamily: '"Source Sans Pro", Helvetica, sans-serif',
  fontSize: 23,
  fontWeight: '700',
  fill: ['#776F69', 'white'], // gradient
  stroke: '#000',
  strokeThickness: 5,
  letterSpacing: 1,
});

export const name = new TextStyle({
  align: 'center',
  fontFamily: '"Source Sans Pro", Helvetica, sans-serif',
  fontSize: 20,
  fontWeight: '600',
  fill: '#D0CCC8', // gradient
  stroke: '#000',
  dropShadow: true,
  dropShadowDistance: 3,
  strokeThickness: 4,
  letterSpacing: 3,
  wordWrap: true,
  wordWrapWidth: 440,
});

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

export const turnStyle = new TextStyle({
  align: 'center',
  fontFamily: '"Source Sans Pro", Helvetica, sans-serif',
  fontSize: 24,
  fontWeight: '700',
  fill: 'black', // gradient
  letterSpacing: 1,
});

export const money = new TextStyle({
  align: 'center',
  fontFamily: '"Source Sans Pro", Helvetica, sans-serif',
  fontSize: 23,
  fontWeight: '600',
  fill: ['black'], // gradient
  stroke: '16EE0A',
  strokeThickness: 2,
  letterSpacing: 1,
  trim: true,
});

export const money2 = new TextStyle({
  align: 'center',
  fontFamily: '"Source Sans Pro", Helvetica, sans-serif',
  fontSize: 18,
  fontWeight: '600',
  fill: ['black'], // gradient
  stroke: '16EE0A',
  strokeThickness: 2,
  letterSpacing: 3,
  trim: true,
});

export const movingStyle = new TextStyle({
  align: 'center',
  fontFamily: '"Source Sans Pro", Helvetica, sans-serif',
  fontSize: 25,
  fontWeight: '600',
  fill: '#BF0606', // gradient
  stroke: '#000',
  dropShadow: true,
  dropShadowDistance: 3,
  strokeThickness: 4,
  letterSpacing: 3,
  wordWrap: true,
  wordWrapWidth: 440,
});