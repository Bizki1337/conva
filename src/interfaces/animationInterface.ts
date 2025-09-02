export interface IFrame {
  width: number;
  height: number;
}

export type AnimationActionsType =
  | 'idle'
  | 'running'
  | 'axe'
  | 'hitted'
  | 'felled';

export type HeroActionsType = Extract<
  AnimationActionsType,
  'idle' | 'running' | 'axe'
>;

export type TreeActionsType = Extract<
  AnimationActionsType,
  'idle' | 'hitted' | 'felled'
>;

export type SpritesType = 'hero' | 'tree';

export type ActionMap<T extends SpritesType> = {
  hero: HeroActionsType;
  tree: TreeActionsType;
}[T];

export interface IHitboxState {
  x: number;
  y: number;
  width: number;
  height: number;
  /*  
    correctionY: Коррекция для спрайтов, так как не все спрайты имеют одинаковую высоту,
    но все спрайты должны "касаться" земли в одной точке по Y.
    Коррекция складывается из формулы: Высота хитбокса - высота спрайта
  */
  correctionY?: number[];
  framesCount: number;
}

export interface IAnimation<T extends SpritesType> {
  gap: number; // Отступ между изображениями в спрайт-листе (png картинке)
  frameRate: number; // fps - кадры в секунду
  frameIndex: number; // индекс начального кадра
  spriteSheetUrl: string; // ссылка на спрайт-лист
  hitboxFrames: Record<ActionMap<T>, IHitboxState> /* 
    Координаты начальной точки,
    ширина и высота хитбокса,
  */;
  frames: Record<ActionMap<T>, number[]>; // Данные для анимации, где ключом объекта выступает название анимации
  moveSpeed?: number; // In progress
  spriteSheetHeight: number; // Общая высота спрайт-листа
  spriteSheetWidth: number; // Общая ширина спрайт-листа
}

export type DirectionType = 'right' | 'left' | 'top' | 'bottom';
