import idleSpriteSheet from 'src/assets/hero/idle.png';
import type { IAnimation } from 'src/interfaces';

const DEFAULT_GAP = 5;

export const idleAnimation: IAnimation = {
  gap: DEFAULT_GAP,
  framesCount: 9,
  frameDelay: 10,
  spriteSheetUrl: idleSpriteSheet,
  spriteSheetHeight: 64,
  spriteSheetWidth: 416,
  frames: {
    0: {
      width: 42,
      height: 64,
    },
    1: {
      width: 42,
      height: 64,
    },
    2: {
      width: 42,
      height: 64,
    },
    3: {
      width: 42,
      height: 64,
    },
    4: {
      width: 42,
      height: 64,
    },
    5: {
      width: 42,
      height: 64,
    },
    6: {
      width: 42,
      height: 64,
    },
    7: {
      width: 42,
      height: 64,
    },
    8: {
      width: 42,
      height: 64,
    },
  },
};
