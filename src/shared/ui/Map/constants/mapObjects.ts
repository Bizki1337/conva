import type { ICollision } from 'src/interfaces/animationInterface';

type MapObjectsItemType = Omit<
  ICollision,
  'width' | 'height' | 'interactionArea'
>;

// Карта объектов на холсте
export const mapObjects: MapObjectsItemType[] = [
  { id: 'anvil_1', x: 870, y: 482, type: 'anvil' },
  { id: 'fence_horizontal_1', x: 19, y: 74, type: 'fence_horizontal' },
  { id: 'fence_horizontal_2', x: 531, y: 74, type: 'fence_horizontal' },
  { id: 'fence_horizontal_3', x: 1002, y: 74, type: 'fence_horizontal' },
  { id: 'fence_horizontal_4', x: 19, y: 341, type: 'fence_horizontal' },
  { id: 'fence_horizontal_5', x: 701, y: 780, type: 'fence_horizontal' },
  { id: 'trough_1', x: 832, y: 410, type: 'trough' },
  { id: 'forge_1', x: 728, y: 424, type: 'forge' },
  { id: 'house_1', x: 314, y: 331, type: 'house' },
  { id: 'fence_vertical_1', x: 1036, y: 371, type: 'fence_vertical' },
  { id: 'rock_1', x: 1130, y: 767, type: 'rock' },
  { id: 'rock_2', x: 1026, y: 840, type: 'rock' },
  { id: 'rock_3', x: 1162, y: 880, type: 'rock' },
  { id: 'tree_1', x: 64, y: 683, type: 'tree' },
  { id: 'tree_2', x: 51, y: 844, type: 'tree' },
  { id: 'tree_3', x: 195, y: 709, type: 'tree' },
  { id: 'tree_4', x: 258, y: 880, type: 'tree' },
  { id: 'tree_5', x: 441, y: 864, type: 'tree' },
];
