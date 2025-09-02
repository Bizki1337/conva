import type KonvaType from 'konva';
import { useEffect, useRef } from 'react';
import { useImage } from 'react-konva-utils';

import type { ActionMap, SpritesType } from 'src/interfaces/animationInterface';
import { animations } from 'src/shared/ui/Map/animations';

interface IUseSpriteAnimateProps<T extends SpritesType> {
  currentAnimation: ActionMap<T>;
  sprite: T;
  afterAnimation?: () => void; // Если функция есть, она означает, что анимация должна остановится после последнего кадра
}

export const useSpriteAnimate = <T extends SpritesType>({
  currentAnimation,
  sprite,
  afterAnimation,
}: IUseSpriteAnimateProps<T>) => {
  const animation = animations[sprite];

  const [image] = useImage(animation?.spriteSheetUrl || '');

  const spriteRef = useRef<KonvaType.Sprite | null>(null);

  useEffect(() => {
    const sprite = spriteRef.current;
    if (!sprite) return;

    sprite.start();

    const handleFrameChange = () => {
      const currentFrame = sprite.frameIndex() || 0;
      const correctionY =
        animation.hitboxFrames[currentAnimation].correctionY?.[currentFrame] ||
        0;

      spriteRef.current?.setPosition({
        x: 0,
        y: correctionY,
      });

      const framesCount = animation.hitboxFrames[currentAnimation].framesCount;
      const isLastFrame = currentFrame + 1 + 1 > framesCount;
      if (isLastFrame && afterAnimation) {
        afterAnimation();
      }
    };

    sprite.on('frameIndexChange', handleFrameChange);

    return () => {
      sprite.off('frameIndexChange', handleFrameChange);
    };
  }, [image, currentAnimation]);

  return {
    image,
    spriteRef,
    currentAnimation,
    animation,
  };
};
