import type { ICollision } from 'src/interfaces/animationInterface';

type IMapObjectsItem = Omit<ICollision, 'width' | 'height'>;

// Карта объектов на холсте
export const mapObjects: IMapObjectsItem[] = [
  {
    id: 0,
    x: 300,
    y: 400,
    type: 'tree',
  },
  {
    id: 1,
    x: 644,
    y: 560,
    type: 'tree',
  },
];
