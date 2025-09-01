import type KonvaType from 'konva';
import Konva from 'konva';
import { useEffect, useRef, type Dispatch, type SetStateAction } from 'react';

import type { DirectionType, HeroActionsType } from 'src/interfaces';

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
  isImageExist: boolean;
  setCurrentAnimation: Dispatch<SetStateAction<HeroActionsType>>;
}

export const useMove = ({
  isImageExist,
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
      const speed = 250;
      const posX = groupRef.current?.x();
      const posY = groupRef.current?.y();
      if (!frame || !posX || !posY) return;

      const dx = (speed * frame.timeDiff) / 1000;
      const dy = (speed * frame.timeDiff) / 1000;

      const directions = new Set(moveStateRef.current.directions);

      let nextPosX = posX;
      let nextPosY = posY;

      if (directions.has('left')) nextPosX -= dx;
      if (directions.has('right')) nextPosX += dx;
      if (directions.has('top')) nextPosY -= dy;
      if (directions.has('bottom')) nextPosY += dy;

      groupRef.current?.position({
        x: nextPosX,
        y: nextPosY,
      });
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

      console.log('isNotEmpty', isNotEmpty);

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
