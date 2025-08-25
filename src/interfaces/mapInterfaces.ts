export type HexTagType =
  | 'fog' // Туман
  | 'meadow' // Луг
  | 'hill' // Холм
  | 'river' // Река
  | 'swamp' // Болото
  | 'mountain' // Гора
  | 'ocean'; // окена

export interface IHex {
  id: number;
  tag: HexTagType;
  x: number;
  y: number;
  hiddenByClouds: boolean;
  rowIndex: number;
  columnIndex: number;
}
