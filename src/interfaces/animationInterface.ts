export interface IFrame {
  width: number;
  height: number;
}

export interface IAnimation {
  gap: number;
  framesCount: number;
  frameDelay: number;
  spriteSheetUrl: string;
  frames: Record<number, IFrame>;
  moveSpeed?: number;
  spriteSheetHeight: number;
  spriteSheetWidth: number;
}

export type DirectionType = 'right' | 'left' | 'top' | 'bottom';
export type ActionType = 'idle' | 'running' | 'axe' | 'treeHit' | 'treeHitLeaves';
export type HeroActionsType = Extract<ActionType, 'idle' | 'running' | 'axe'>;
