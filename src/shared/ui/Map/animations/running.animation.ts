import runningSpriteSheet from 'src/assets/hero/running.png';
import type { IAnimation } from 'src/interfaces';

const DEFAULT_GAP = 5;

export const runningAnimation: IAnimation = {
  gap: DEFAULT_GAP,
  framesCount: 8,
  frameDelay: 13,
  spriteSheetUrl: runningSpriteSheet,
  moveSpeed: 6,
  spriteSheetHeight: 64,
  spriteSheetWidth: 372,
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
  },
};
