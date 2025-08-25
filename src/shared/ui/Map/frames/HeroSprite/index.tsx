import { useState, useEffect, useRef, useCallback } from 'react';
import { Layer, Image } from 'react-konva';
import { useImage } from 'react-konva-utils';

import idleSpriteSheet from 'src/assets/hero/idle.png';
import runningSpriteSheet from 'src/assets/hero/running.png';
import type { IMap } from 'src/shared/ui/Map/hooks/useCreateMap';

type DirectionType = 'right' | 'left' | 'top' | 'bottom';
type ActionType = 'running' | 'idle';

interface SpriteState {
  x: number;
  y: number;
  currentFrame: number;
  action: ActionType;
  direction: DirectionType;
}

const keyEvent: Record<string, DirectionType> = {
  ArrowRight: 'right',
  ArrowLeft: 'left',
  ArrowUp: 'top',
  ArrowDown: 'bottom',
};

const FRAME_WIDTH = 42;
const FRAME_HEIGHT = 64;

export interface IHeroSpriteProps {
  map: IMap;
  initialPosX: number;
  initialPosY: number;
}

export const HeroSprite = ({ map, initialPosX, initialPosY }: IHeroSpriteProps) => {
  const imageRef = useRef(null);
  const animationRef = useRef<number>(0);
  const frameCounterRef = useRef<number>(0);

  const [spriteState, setSpriteState] = useState<SpriteState>({
    x: initialPosX,
    y: initialPosY,
    currentFrame: 0,
    action: 'idle',
    direction: 'right',
  });

  const [idleImage] = useImage(idleSpriteSheet);
  const [runningImage] = useImage(runningSpriteSheet);

  const moveSpeed = 2;
  const runningFrames = 8; // Количество кадров в анимации бега
  const idleFrames = 9; // Количество кадров в анимации простоя
  const runningFrameDelay = 10;
  const idleFrameDelay = 13;

  const animateRunning = (): void => {
    frameCounterRef.current += 1;

    setSpriteState((prev) => {
      let newFrame = prev.currentFrame;
      let newX = prev.x;
      let newY = prev.y;

      // Меняем кадр только каждый N-ный раз
      if (frameCounterRef.current % runningFrameDelay === 0) {
        const { tileSize } = map;
        newFrame = (prev.currentFrame + 1) % runningFrames;
        /*
          Вычисляем местоположение персонажа для взаимодействия с объектами
        */
        const col = Math.floor(newX / tileSize);
        const row = Math.floor(newY / tileSize);
      }

      if (prev.direction === 'right') newX = prev.x + moveSpeed;
      if (prev.direction === 'left') newX = prev.x - moveSpeed;
      if (prev.direction === 'top') newY = prev.y - moveSpeed;
      if (prev.direction === 'bottom') newY = prev.y + moveSpeed;

      return {
        ...prev,
        currentFrame: newFrame,
        x: newX,
        y: newY,
      };
    });

    animationRef.current = requestAnimationFrame(animateRunning);
  };

  const animateIdle = (): void => {
    frameCounterRef.current += 1;

    setSpriteState((prev) => {
      let newFrame = prev.currentFrame;

      // Меняем кадр только каждый N-ный раз
      if (frameCounterRef.current % idleFrameDelay === 0) {
        newFrame = (prev.currentFrame + 1) % idleFrames;
      }

      return {
        ...prev,
        currentFrame: newFrame,
      };
    });

    animationRef.current = requestAnimationFrame(animateIdle);
  };

  useEffect(() => {
    if (spriteState.action === 'running') {
      animationRef.current = requestAnimationFrame(animateRunning);
    }
    if (spriteState.action === 'idle') {
      cancelAnimationFrame(animationRef.current);
      frameCounterRef.current = 0;
      setSpriteState((prev) => ({ ...prev, currentFrame: 0 }));
      animationRef.current = requestAnimationFrame(animateIdle);
    }

    return () => {
      cancelAnimationFrame(animationRef.current);
    };
  }, [spriteState.action]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent): void => {
      const direction = keyEvent[e.key];
      if (direction) {
        setSpriteState((prev) => ({
          ...prev,
          action: 'running',
          direction,
        }));
      }
    };

    const handleKeyUp = (e: KeyboardEvent): void => {
      const keys = Object.keys(keyEvent);
      if (keys.includes(e.key)) {
        setSpriteState((prev) => ({ ...prev, action: 'idle' }));
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('keyup', handleKeyUp);

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('keyup', handleKeyUp);
    };
  }, []);

  const getSpriteCoord = useCallback(() => {
    const gap = 5;
    return spriteState.currentFrame * (FRAME_WIDTH + gap);
  }, [spriteState.currentFrame]);

  const currentSpriteSheet = spriteState.action === 'running' ? runningImage : idleImage;

  return (
    <Layer>
      {currentSpriteSheet && (
        <Image
          ref={imageRef}
          image={currentSpriteSheet}
          x={spriteState.x}
          y={spriteState.y}
          scaleX={spriteState.direction === 'left' ? -1 : 1}
          offsetX={spriteState.direction === 'left' ? FRAME_WIDTH : 0}
          width={FRAME_WIDTH}
          height={FRAME_HEIGHT}
          crop={{
            x: getSpriteCoord(),
            y: 0,
            width: FRAME_WIDTH,
            height: FRAME_HEIGHT,
          }}
        />
      )}
    </Layer>
  );
};
