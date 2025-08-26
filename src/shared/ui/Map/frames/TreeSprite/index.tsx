import { useCallback, useEffect, useRef, useState } from 'react';
import { Layer, Image } from 'react-konva';
import { useImage } from 'react-konva-utils';

import { animations } from 'src/shared/ui/Map/animations';
import type { IMap } from 'src/shared/ui/Map/hooks/useCreateMap';

interface SpriteState {
  x: number;
  y: number;
  currentFrame: number;
  action: 'treeHit';
  play: boolean;
}

export interface ITreeSpriteProps {
  map: IMap;
  initialPosX: number;
  initialPosY: number;
}

export const TreeSprite = ({ map, initialPosX, initialPosY }: ITreeSpriteProps) => {
  const animationRef = useRef<number>(0);
  const frameCounterRef = useRef<number>(0);

  const { treeHit } = animations;

  const [spriteState, setSpriteState] = useState<SpriteState>({
    x: initialPosX,
    y: initialPosY,
    currentFrame: 0,
    action: 'treeHit',
    play: false,
  });

  const [treeImage] = useImage(treeHit.spriteSheetUrl);

  const currentAnimation = animations[spriteState.action];
  const currentAnimationWidth = currentAnimation.frames[spriteState.currentFrame]?.width || 0;
  const currentAnimationHeight = currentAnimation.frames[spriteState.currentFrame]?.height || 0;

  const animateTree = (): void => {
    if (!spriteState.play) return;

    frameCounterRef.current += 1;
    let isLastFrame = false;

    setSpriteState((prev) => {
      // Меняем кадр только каждый N-ный раз
      if (frameCounterRef.current % treeHit.frameDelay === 0) {
        isLastFrame = prev.currentFrame >= treeHit.framesCount - 1;
        if (isLastFrame) {
          return {
            ...prev,
            play: false,
            currentFrame: 0,
          };
        }
        return {
          ...prev,
          currentFrame: prev.currentFrame + 1,
        };
      }

      return prev;
    });

    if (!isLastFrame) animationRef.current = requestAnimationFrame(animateTree);
  };

  useEffect(() => {
    cancelAnimationFrame(animationRef.current);
    frameCounterRef.current = 0;
    animationRef.current = requestAnimationFrame(animateTree);
    return () => {
      cancelAnimationFrame(animationRef.current);
    };
  }, [spriteState.play]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent): void => {
      if (e.key === 'e') {
        setSpriteState((prev) => ({
          ...prev,
          play: true,
        }));
      }
    };

    window.addEventListener('keydown', handleKeyDown);

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, []);

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
      {treeImage && (
        <Image
          image={treeImage}
          x={spriteState.x}
          y={spriteState.y}
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
