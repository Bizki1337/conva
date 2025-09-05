import { checkCollision } from './';

export interface IData {
  id: string;
  x: number;
  y: number;
  width: number;
  height: number;
}
export type TargetType = Omit<IData, 'id'>;

interface IReturnProps {
  interactionId: string | null;
  collidingId: string | null;
}

interface IProps {
  interactionAreas: IData[];
  collisions: IData[];
  target: TargetType;
}

export const checkCoverageAreas = ({
  interactionAreas,
  collisions,
  target,
}: IProps): IReturnProps => {
  const interactionId = checkCollision(interactionAreas, target);
  const collidingId = checkCollision(collisions, target);

  return {
    interactionId,
    collidingId,
  };
};
