import type { CollisionMapDataType } from 'src/interfaces';

interface ITarget {
  x: number;
  y: number;
  width: number;
  height: number;
}

export const checkCollision = (
  collisionMap: CollisionMapDataType,
  target: ITarget,
): boolean => {
  const collisions = Object.values(collisionMap);

  return collisions.some((collision) => {
    // Проверяем пересечение по оси X
    const intersectX =
      collision.x < target.x + target.width &&
      collision.x + collision.width > target.x;

    // Проверяем пересечение по оси Y
    const intersectY =
      collision.y < target.y + target.height &&
      collision.y + collision.height > target.y;

    // Если пересекаются по обеим осям - значит прямоугольники пересекаются
    return intersectX && intersectY;
  });
};
