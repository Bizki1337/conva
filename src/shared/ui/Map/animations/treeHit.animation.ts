import axeSpriteSheet from 'src/assets/tree/tree.png';
import type { IAnimation } from 'src/interfaces';

const DEFAULT_GAP = 5;

export const treeHitAnimation: IAnimation = {
  gap: DEFAULT_GAP,
  framesCount: 5,
  frameDelay: 10,
  spriteSheetUrl: axeSpriteSheet,
  spriteSheetHeight: 118,
  spriteSheetWidth: 316,
  frames: {
    0: {
      width: 59,
      height: 115,
    },
    1: {
      width: 61,
      height: 111,
    },
    2: {
      width: 61,
      height: 118,
    },
    3: {
      width: 54,
      height: 114,
    },
    4: {
      width: 61,
      height: 118,
    },
  },
};
