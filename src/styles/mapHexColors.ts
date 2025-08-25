import type { HexTagType } from 'src/interfaces';

export type HexColorsType = Record<HexTagType | 'canvas', string>;

export const hexColors: HexColorsType = {
  fog: '#C3C3C3',
  meadow: '#12CC53',
  swamp: '#11943F',
  hill: '#D67513',
  mountain: '#79440E',
  river: '#38D1EC',
  ocean: '#0B8399',
  canvas: '#DCDCDC',
};
