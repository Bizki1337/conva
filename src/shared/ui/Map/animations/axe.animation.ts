import axeSpriteSheet from 'src/assets/hero/axe.png';

const DEFAULT_GAP = 5;

export const axeAnimation = {
  gap: DEFAULT_GAP,
  framesCount: 9,
  frameDelay: 10,
  spriteSheetUrl: axeSpriteSheet,
  spriteSheetHeight: 92,
  spriteSheetWidth: 1065,
  frames: {
    0: {
      width: 57,
      height: 71,
    },
    1: {
      width: 68,
      height: 71,
    },
    2: {
      width: 89,
      height: 64,
    },
    3: {
      width: 92,
      height: 54,
    },
    4: {
      width: 88,
      height: 71,
    },
    5: {
      width: 142,
      height: 92,
    },
    6: {
      width: 156,
      height: 86,
    },
    7: {
      width: 167,
      height: 85,
    },
    8: {
      width: 166,
      height: 92,
    },
  },
};
