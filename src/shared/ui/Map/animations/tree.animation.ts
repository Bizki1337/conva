import treeSpriteSheet from 'src/assets/objects/tree.png';
import type { IAnimation } from 'src/interfaces';

const DEFAULT_GAP = 5;

export const treeAnimation: IAnimation<'tree'> = {
  spriteSheetUrl: treeSpriteSheet,
  gap: DEFAULT_GAP,
  frameRate: 10,
  frameIndex: 0,
  spriteSheetWidth: 316,
  spriteSheetHeight: 278,
  hitboxFrames: {
    idle: {
      width: 59,
      height: 115,
      x: 0,
      y: 0,
      correctionY: [0],
      framesCount: 1,
    },
    hitted: {
      width: 59,
      height: 115,
      x: 0,
      y: 0,
      // Добавить коррекцию по X
      correctionY: [3, 7, 0, 4, 0],
      framesCount: 5,
    },
    felled: {
      width: 40,
      height: 35,
      x: 10,
      y: 83,
      correctionY: [0],
      framesCount: 1,
    },
  },
  // prettier-ignore
  // [action]: [x, y, width, height]
  frames: {
    idle: [
      0, 0, 59, 115,
    ],
    hitted: [
      0, 123, 59, 115,      // frame 1
      64, 127, 61, 111,     // frame 2
      130, 120, 61, 118,    // frame 3
      196, 124, 54, 114,    // frame 4
      255, 120, 61, 118,    // frame 5
    ],
    felled: [
      0, 243, 40, 35
    ]
  },
};
