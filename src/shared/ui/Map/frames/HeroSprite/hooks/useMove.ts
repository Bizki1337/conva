import type KonvaType from 'konva';
import Konva from 'konva';
import {
  useEffect,
  useRef,
  type Dispatch,
  type RefObject,
  type SetStateAction,
} from 'react';

import type {
  CollisionMapDataType,
  DirectionType,
  HeroActionsType,
} from 'src/interfaces';
import type { IMap } from 'src/shared/ui/Map/hooks/useCreateMap';

import { checkCollision } from '../utils';

const keyEvent: Record<string, DirectionType> = {
  KeyD: 'right',
  KeyA: 'left',
  KeyW: 'top',
  KeyS: 'bottom',
};

interface IMoveState {
  play: boolean;
  directions: Set<DirectionType>;
}

interface IUseMoveProps {
  map: IMap;
  isImageExist: boolean;
  hitboxWidth: number;
  hitboxHeight: number;
  collisionMapRef: RefObject<CollisionMapDataType>;
  setCurrentAnimation: Dispatch<SetStateAction<HeroActionsType>>;
}

export const useMove = ({
  map,
  isImageExist,
  hitboxWidth,
  hitboxHeight,
  collisionMapRef,
  setCurrentAnimation,
}: IUseMoveProps) => {
  const groupRef = useRef<KonvaType.Group | null>(null);
  const animRef = useRef<KonvaType.Animation | null>(null);
  const moveStateRef = useRef<IMoveState>({
    directions: new Set(['right']),
    play: false,
  });

  useEffect(() => {
    if (!groupRef.current) return;

    const layer = groupRef.current.getLayer();

    animRef.current = new Konva.Animation((frame) => {
      if (!frame || !groupRef.current) return;

      const speed = 250;
      const currentX = groupRef.current.x();
      const currentY = groupRef.current.y();

      const dx = (speed * frame.timeDiff) / 1000;
      const dy = (speed * frame.timeDiff) / 1000;

      const directions = new Set(moveStateRef.current.directions);

      let nextX = currentX;
      let nextY = currentY;

      if (directions.has('left')) {
        const isColliding = checkCollision(collisionMapRef.current, {
          x: currentX - dx,
          y: currentY,
          width: hitboxWidth,
          height: hitboxHeight,
        });
        if (!isColliding) nextX -= dx;

        // Поворачиваем группу влево
        groupRef.current.scaleX(-1);
        groupRef.current.offsetX(hitboxWidth);
      }
      if (directions.has('right')) {
        const isColliding = checkCollision(collisionMapRef.current, {
          x: currentX + dx,
          y: currentY,
          width: hitboxWidth,
          height: hitboxHeight,
        });
        if (!isColliding) nextX += dx;

        // Поворачиваем группу вправо
        groupRef.current.scaleX(1);
        groupRef.current.offsetX(0);
      }
      if (directions.has('top')) {
        const isColliding = checkCollision(collisionMapRef.current, {
          x: currentX,
          y: currentY - dy,
          width: hitboxWidth,
          height: hitboxHeight,
        });
        if (!isColliding) nextY -= dy;
      }
      if (directions.has('bottom')) {
        const isColliding = checkCollision(collisionMapRef.current, {
          x: currentX,
          y: currentY + dy,
          width: hitboxWidth,
          height: hitboxHeight,
        });
        if (!isColliding) nextY += dy;
      }

      // Границы карты
      const { width: mapWidth, height: mapHeight } = map;
      nextX = Math.max(0, Math.min(mapWidth - 42, nextX));
      nextY = Math.max(0, Math.min(mapHeight - 64, nextY));

      groupRef.current.position({ x: nextX, y: nextY });
    }, layer);

    const handleKeyDown = (e: KeyboardEvent) => {
      if (!Object.keys(keyEvent).includes(e.code) || !moveStateRef.current) {
        return;
      }

      moveStateRef.current = {
        directions: moveStateRef.current.directions.add(keyEvent[e.code]),
        play: true,
      };
      setCurrentAnimation('running');
      animRef.current?.start();
    };
    const handleKeyUp = (e: KeyboardEvent): void => {
      if (!Object.keys(keyEvent).includes(e.code) || !moveStateRef.current) {
        return;
      }

      const nextDirections = new Set([...moveStateRef.current.directions]);

      nextDirections.delete(keyEvent[e.code]);

      const isNotEmpty = !!nextDirections.size;

      moveStateRef.current = {
        directions: nextDirections,
        play: isNotEmpty,
      };
      if (!isNotEmpty) {
        setCurrentAnimation('idle');
        animRef.current?.stop();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('keyup', handleKeyUp);

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('keyup', handleKeyUp);
    };
  }, [isImageExist]);

  return {
    groupRef,
  };
};
