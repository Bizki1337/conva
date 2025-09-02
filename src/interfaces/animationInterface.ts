// Все доступные анимации
export type AnimationActionsType =
  | 'idle'
  | 'running'
  | 'axe'
  | 'hitted'
  | 'felled';

// Анимации персонажа
export type HeroActionsType = Extract<
  AnimationActionsType,
  'idle' | 'running' | 'axe'
>;

// Анимации дерева
export type TreeActionsType = Extract<
  AnimationActionsType,
  'idle' | 'hitted' | 'felled'
>;

// Все доступные спрайтшиты
export type SpritesType = 'hero' | 'tree';

// Все доступные спрайтшиты, которые относятся к элементам ландшафта
export type LandscapeSpritesType = Extract<SpritesType, 'tree'>;

// Все доступные анимации, собранные в словарь и разделённые по спрайтшитам
export type ActionMap<T extends SpritesType> = {
  hero: HeroActionsType;
  tree: TreeActionsType;
}[T];

// Объект коллизий
export interface ICollision {
  id: number;
  x: number;
  y: number;
  width: number;
  height: number;
  type: LandscapeSpritesType;
}

// Карта коллизий
export type CollisionMapDataType = Record<number, ICollision>;

// Объект хитбокса
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
  /* 
    framesCount: Количество фреймов в одной анимации.
    Количество фреймов !== количество кадров в секунду при анимации
  */
  framesCount: number;
}

// Объект спрайта
export interface IAnimation<T extends SpritesType> {
  gap: number; // Отступ между изображениями в спрайт-листе (png картинке)
  frameRate: number; // fps - кадры в секунду
  frameIndex: number; // Индекс начального кадра
  spriteSheetUrl: string; // Ссылка на спрайт-лист
  hitboxFrames: Record<ActionMap<T>, IHitboxState> /* 
    Координаты начальной точки,
    ширина и высота хитбокса,
  */;
  frames: Record<ActionMap<T>, number[]>; // Данные для анимации, где ключом объекта выступает название анимации
  moveSpeed?: number; // In progress
  spriteSheetHeight: number; // Общая высота спрайт-листа
  spriteSheetWidth: number; // Общая ширина спрайт-листа
}

// Направления движения
export type DirectionType = 'right' | 'left' | 'top' | 'bottom';
