import { TextStyle } from 'pixi.js';

export const style = new TextStyle({
  align: 'center',
  fontFamily: '"Source Sans Pro", Helvetica, sans-serif',
  fontSize: 25,
  fontWeight: '400',
  fill: ['#ffffff', '#00ff99'], // gradient
  stroke: '#01d27e',
  strokeThickness: 3,
  letterSpacing: 2,
  wordWrap: true,
  wordWrapWidth: 440,
});