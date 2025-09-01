import type KonvaType from 'konva';
import { useEffect, useRef, useState } from 'react';
import { useImage } from 'react-konva-utils';

import type { HeroActionsType } from 'src/interfaces';
import { animations } from 'src/shared/ui/Map/animations';

interface IUseSpriteAnimateProps {
  initialPosX: number;
  initialPosY: number;
}

interface IHitbox {
  x: number;
  y: number;
  width: number;
  height: number;
  hitboxFill: string;
}

export const useSpriteAnimate = ({
  initialPosX,
  initialPosY,
}: IUseSpriteAnimateProps) => {
  const animation = animations.hero;
  const [hitbox, setHitbox] = useState<IHitbox>({
    x: initialPosX,
    y: initialPosY,
    width: 0,
    height: 0,
    hitboxFill: 'red',
  });
  const [spriteState, setSpriteState] = useState({
    x: initialPosX,
    y: initialPosY,
  });

  const [image] = useImage(animation?.spriteSheetUrl || '');

  const spriteRef = useRef<KonvaType.Sprite | null>(null);
  const [currentAnimation, setCurrentAnimation] =
    useState<HeroActionsType>('idle');

  useEffect(() => {
    if (!spriteRef.current) return;

    spriteRef.current.start();
  }, [image]);

  useEffect(() => {
    const sprite = spriteRef.current;
    if (!sprite) return;
    sprite.start();

    const handleFrameChange = () => {
      const currentFrame = sprite.frameIndex() || 0;
      const correctionY =
        animation.hitboxFrames[currentAnimation].correctionY?.[currentFrame] ||
        0;

      setSpriteState((prev) => {
        return {
          ...prev,
          x: hitbox.x,
          y: hitbox.y + correctionY,
        };
      });
    };

    sprite.on('frameIndexChange', handleFrameChange);

    return () => {
      sprite.off('frameIndexChange', handleFrameChange);
    };
  }, [image]);

  useEffect(() => {
    setHitbox((prev) => {
      const hitboxFrames = animation.hitboxFrames;
      return {
        ...prev,
        x: prev.x + hitboxFrames[currentAnimation].x,
        y: prev.y + hitboxFrames[currentAnimation].y,
        width: hitboxFrames[currentAnimation].width,
        height: hitboxFrames[currentAnimation].height,
      };
    });
  }, [currentAnimation]);

  return {
    image,
    hitbox,
    spriteRef,
    spriteState,
    currentAnimation,
    animation,
    setCurrentAnimation,
  };
};
