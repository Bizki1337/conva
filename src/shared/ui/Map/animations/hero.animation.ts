import heroSpriteSheet from 'src/assets/objects/hero.png';
import type { IAnimation } from 'src/interfaces';

const DEFAULT_GAP = 5;

export const heroAnimation: IAnimation<'hero'> = {
  gap: DEFAULT_GAP,
  frameRate: 10,
  spriteSheetUrl: heroSpriteSheet,
  spriteSheetWidth: 1065,
  spriteSheetHeight: 226,
  frameIndex: 0,
  hitboxFrames: {
    idle: {
      width: 42,
      height: 64,
      x: 0,
      y: 0,
      correctionY: [0, 0, 0, 7, 7, 4, 4, 4, 0],
      framesCount: 9,
    },
    running: {
      width: 42,
      height: 64,
      x: 0,
      y: 0,
      correctionY: [2, 9, 0, 2, 2, 9, 0, 2],
      framesCount: 8,
    },
    axe: {
      width: 42,
      height: 64,
      x: 0,
      y: 0,
      framesCount: 1,
    },
  },
  // prettier-ignore
  // [action]: [x, y, width, height]
  frames: {
    idle: [
      0, 0, 42, 64,      // frame 1
      47, 0, 42, 64,     // frame 2
      94, 0, 42, 64,    // frame 3
      141, 7, 42, 57,    // frame 4
      188, 7, 42, 57,    // frame 5
      235, 4, 42, 60,    // frame 6
      282, 4, 42, 60,    // frame 7
      329, 4, 42, 60,    // frame 8
      376, 0, 42, 64,    // frame 9
    ],
    running: [
      0, 2 + 69, 42, 62,      // frame 1
      47, 9 + 69, 42, 55,      // frame 2
      94, 0 + 69, 42, 64,      // frame 3
      141, 2 + 69, 42, 62,      // frame 4
      188, 2 + 69, 43, 62,      // frame 5
      236, 9 + 69, 42, 55,      // frame 6
      283, 0 + 69, 42, 64,      // frame 7
      330, 2 + 69, 42, 62,      // frame 8
    ],
    axe: [
      0, 243, 40, 35
    ]
  },
};
