import type { IInteractionArea, TreeActionsType } from 'src/interfaces';

const INTERACTION_AREA_X_PADDING = 20; // Оступ по X для расширения фигуры взаимодействия

interface IProps {
  groupWidth: number;
  groupHeight: number;
  currentAnimation: TreeActionsType;
}

export const createInteractionAreaData = ({
  groupWidth,
  groupHeight,
  currentAnimation,
}: IProps): IInteractionArea => {
  if (currentAnimation === 'felled') {
    return {
      height: 0,
      width: 0,
      x: 0,
      y: 0,
    };
  }

  const nextAreaWidth = INTERACTION_AREA_X_PADDING * 2 + groupWidth; // (* 2) - так как отступ должен быть с двух сторон
  const nextAreaHeight = groupHeight;
  const nextAreaX = -INTERACTION_AREA_X_PADDING;
  const nextAreaY = 0;

  return {
    x: nextAreaX,
    y: nextAreaY,
    width: nextAreaWidth,
    height: nextAreaHeight,
  };
};
