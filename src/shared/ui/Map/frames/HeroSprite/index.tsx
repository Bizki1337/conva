import { useState, useEffect, useRef, useCallback, useMemo } from 'react';
import { Layer, Image } from 'react-konva';
import { useImage } from 'react-konva-utils';

import type { ActionType, DirectionType } from 'src/interfaces';
import type { IMap } from 'src/shared/ui/Map/hooks/useCreateMap';

import { animations } from '../../animations';

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

export interface IHeroSpriteProps {
  map: IMap;
  initialPosX: number;
  initialPosY: number;
}

export const HeroSprite = ({ map, initialPosX, initialPosY }: IHeroSpriteProps) => {
  const imageRef = useRef(null);
  const animationRef = useRef<number>(0);
  const frameCounterRef = useRef<number>(0);

  const { idle, running, axe } = animations;

  const [spriteState, setSpriteState] = useState<SpriteState>({
    x: initialPosX,
    y: initialPosY,
    currentFrame: 0,
    action: 'idle',
    direction: 'right',
  });

  const [idleImage] = useImage(idle.spriteSheetUrl);
  const [runningImage] = useImage(running.spriteSheetUrl);
  const [axeImage] = useImage(axe.spriteSheetUrl);

  const currentSpriteSheet: Record<ActionType, HTMLImageElement | undefined> = useMemo(
    () => ({
      idle: idleImage,
      running: runningImage,
      axe: axeImage,
    }),
    [idleImage, runningImage, axeImage],
  );

  const animateRunning = (): void => {
    frameCounterRef.current += 1;

    setSpriteState((prev) => {
      let newFrame = prev.currentFrame;
      let newX = prev.x;
      let newY = prev.y;

      // Меняем кадр только каждый N-ный раз
      if (frameCounterRef.current % running.frameDelay === 0) {
        // const { tileSize } = map;
        newFrame = (prev.currentFrame + 1) % running.framesCount;
        /*
          Вычисляем местоположение персонажа для взаимодействия с объектами
        */
        // const col = Math.floor(newX / tileSize);
        // const row = Math.floor(newY / tileSize);
      }

      const moveSpeed = running.moveSpeed ?? 2;

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
      if (frameCounterRef.current % idle.frameDelay === 0) {
        newFrame = (prev.currentFrame + 1) % idle.framesCount;
      }

      return {
        ...prev,
        currentFrame: newFrame,
      };
    });

    animationRef.current = requestAnimationFrame(animateIdle);
  };

  const animateAxe = (): void => {
    frameCounterRef.current += 1;

    setSpriteState((prev) => {
      let newFrame = prev.currentFrame;

      // Меняем кадр только каждый N-ный раз
      if (frameCounterRef.current % axe.frameDelay === 0) {
        newFrame = (prev.currentFrame + 1) % axe.framesCount;
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
      cancelAnimationFrame(animationRef.current);
      frameCounterRef.current = 0;
      animationRef.current = requestAnimationFrame(animateRunning);
    }
    if (spriteState.action === 'idle') {
      cancelAnimationFrame(animationRef.current);
      frameCounterRef.current = 0;
      setSpriteState((prev) => ({ ...prev, currentFrame: 0 }));
      animationRef.current = requestAnimationFrame(animateIdle);
    }
    if (spriteState.action === 'axe') {
      cancelAnimationFrame(animationRef.current);
      frameCounterRef.current = 0;
      setSpriteState((prev) => ({ ...prev, currentFrame: 0 }));
      animationRef.current = requestAnimationFrame(animateAxe);
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
      if (e.key === 'f') {
        setSpriteState((prev) => ({
          ...prev,
          action: 'axe',
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

  const currentAnimation = animations[spriteState.action];
  const currentAnimationWidth = currentAnimation.frames[spriteState.currentFrame]?.width || 0;
  const currentAnimationHeight = currentAnimation.frames[spriteState.currentFrame]?.height || 0;

  const getSpriteCoord = useCallback(() => {
    let nextX = 0;
    for (let i = 0; i < spriteState.currentFrame; i++) {
      nextX += currentAnimation.frames[i].width + currentAnimation.gap;
    }
    return {
      x: nextX,
      y: currentAnimation.spriteSheetHeight - currentAnimationHeight,
    };
  }, [spriteState.currentFrame, currentAnimation, currentAnimationHeight, currentAnimationWidth]);

  return (
    <Layer>
      {currentSpriteSheet && (
        <Image
          ref={imageRef}
          image={currentSpriteSheet[spriteState.action]}
          x={spriteState.x}
          y={spriteState.y}
          scaleX={spriteState.direction === 'left' ? -1 : 1}
          offsetX={spriteState.direction === 'left' && spriteState.action !== 'axe' ? currentAnimationWidth : 0}
          width={currentAnimationWidth}
          height={currentAnimationHeight}
          crop={{
            ...getSpriteCoord(),
            width: currentAnimationWidth,
            height: currentAnimationHeight,
          }}
        />
      )}
    </Layer>
  );
};
