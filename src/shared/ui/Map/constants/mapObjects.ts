import type { ICollision } from 'src/interfaces/animationInterface';

type IMapObjectsItem = Omit<ICollision, 'width' | 'height' | 'interactionArea'>;

// Карта объектов на холсте
export const mapObjects: IMapObjectsItem[] = [
  {
    id: 0,
    x: 700,
    y: 370,
    type: 'tree',
  },
  {
    id: 1,
    x: 644,
    y: 560,
    type: 'tree',
  },
  {
    id: 2,
    x: 784,
    y: 560,
    type: 'tree',
  },
  {
    id: 3,
    x: 200,
    y: 200,
    type: 'tree',
  },
];
