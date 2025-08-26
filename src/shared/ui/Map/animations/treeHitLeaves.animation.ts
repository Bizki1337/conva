import leavesHitSpriteSheet from 'src/assets/tree/leaves_hit.png';
import type { IAnimation } from 'src/interfaces';

const DEFAULT_GAP = 5;

export const treeHitLeavesAnimation: IAnimation = {
  gap: DEFAULT_GAP,
  framesCount: 5,
  frameDelay: 10,
  spriteSheetUrl: leavesHitSpriteSheet,
  spriteSheetHeight: 59,
  spriteSheetWidth: 757,
  frames: {
    0: {
      width: 80,
      height: 53,
    },
    1: {
      width: 61,
      height: 41,
    },
    2: {
      width: 88,
      height: 57,
    },
    3: {
      width: 83,
      height: 58,
    },
    4: {
      width: 69,
      height: 56,
    },
    5: {
      width: 69,
      height: 39,
    },
    6: {
      width: 66,
      height: 37,
    },
    7: {
      width: 65,
      height: 38,
    },
    8: {
      width: 66,
      height: 38,
    },
    9: {
      width: 56,
      height: 21,
    },
    10: {
      width: 4,
      height: 2,
    },
  },
};
