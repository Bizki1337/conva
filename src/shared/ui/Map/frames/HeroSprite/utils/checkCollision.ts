import type { IData, TargetType } from './checkCoverageAreas';

export const checkCollision = (
  collisions: IData[],
  target: TargetType,
): string | null => {
  const findedCollision = collisions.find((collision) => {
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

  return findedCollision?.id ?? null;
};
