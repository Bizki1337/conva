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
import type { IMetaData } from 'src/shared/ui/Map';
import type { IMap } from 'src/shared/ui/Map/hooks/useCreateMap';

import { checkCoverageAreas } from '../utils';

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
  metaDataRef: RefObject<IMetaData>;
  uiImageRef: RefObject<KonvaType.Image | null>;
  initialPosX: number;
  initialPosY: number;
  setCurrentAnimation: Dispatch<SetStateAction<HeroActionsType>>;
}

export const useMove = ({
  map,
  isImageExist,
  hitboxWidth,
  hitboxHeight,
  collisionMapRef,
  metaDataRef,
  uiImageRef,
  initialPosX,
  initialPosY,
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

    groupRef.current.setPosition({
      x: initialPosX,
      y: initialPosY,
    });

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

      const collisions = Object.values(collisionMapRef.current);
      /*
        interactionArea имеет координаты относительно группы, НЕ холста
        Поэтому мы должны спозиционировать фигуру взаимодействия относительно холста
      */
      const interactionAreas = collisions
        .filter((collision) => collision.interactionArea)
        .map((collision) => ({
          ...collision.interactionArea,
          x: collision.x + collision.interactionArea.x,
          y: collision.y + collision.interactionArea.y,
          id: collision.id,
        }));

      if (directions.has('left')) {
        const nextSpriteData = {
          x: currentX - dx,
          y: currentY,
          width: hitboxWidth,
          height: hitboxHeight,
        };
        const { collidingId, interactionId } = checkCoverageAreas({
          collisions,
          interactionAreas,
          target: nextSpriteData,
        });

        if (interactionId === null) uiImageRef.current?.hide();
        if (interactionId !== null) uiImageRef.current?.show();

        metaDataRef.current = {
          canAction: interactionId !== null,
          interactionId,
        };
        if (collidingId === null) nextX -= dx;

        // Поворачиваем группу влево
        groupRef.current.scaleX(-1);
        groupRef.current.offsetX(hitboxWidth);
      }
      if (directions.has('right')) {
        const nextSpriteData = {
          x: currentX + dx,
          y: currentY,
          width: hitboxWidth,
          height: hitboxHeight,
        };
        const { collidingId, interactionId } = checkCoverageAreas({
          collisions,
          interactionAreas,
          target: nextSpriteData,
        });

        if (interactionId === null) uiImageRef.current?.hide();
        if (interactionId !== null) uiImageRef.current?.show();
        metaDataRef.current = {
          canAction: interactionId !== null,
          interactionId,
        };
        if (collidingId === null) nextX += dx;

        // Поворачиваем группу вправо
        groupRef.current.scaleX(1);
        groupRef.current.offsetX(0);
      }
      if (directions.has('top')) {
        const nextSpriteData = {
          x: currentX,
          y: currentY - dy,
          width: hitboxWidth,
          height: hitboxHeight,
        };
        const { collidingId, interactionId } = checkCoverageAreas({
          collisions,
          interactionAreas,
          target: nextSpriteData,
        });

        if (interactionId === null) uiImageRef.current?.hide();
        if (interactionId !== null) uiImageRef.current?.show();
        metaDataRef.current = {
          canAction: interactionId !== null,
          interactionId,
        };
        if (collidingId === null) nextY -= dy;
      }
      if (directions.has('bottom')) {
        const nextSpriteData = {
          x: currentX,
          y: currentY + dy,
          width: hitboxWidth,
          height: hitboxHeight,
        };
        const { collidingId, interactionId } = checkCoverageAreas({
          collisions,
          interactionAreas,
          target: nextSpriteData,
        });

        if (interactionId === null) uiImageRef.current?.hide();
        if (interactionId !== null) uiImageRef.current?.show();
        metaDataRef.current = {
          canAction: interactionId !== null,
          interactionId,
        };
        if (collidingId === null) nextY += dy;
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
