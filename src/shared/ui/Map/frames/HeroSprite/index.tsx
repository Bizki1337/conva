import { useEffect, useState, type RefObject } from 'react';
import { Layer, Rect, Sprite, Group } from 'react-konva';

import type { CollisionMapDataType, HeroActionsType } from 'src/interfaces';
import { useSpriteAnimate } from 'src/shared/ui/Map/hooks';
import type { IMap } from 'src/shared/ui/Map/hooks/useCreateMap';

import { useMove } from './hooks';

export interface IHeroSpriteProps {
  map: IMap;
  collisionMapRef: RefObject<CollisionMapDataType>;
}

export const HeroSprite = ({ map, collisionMapRef }: IHeroSpriteProps) => {
  const [currentAnimation, setCurrentAnimation] =
    useState<HeroActionsType>('idle');

  /* Отвечает за анимацию (анимация !== движение) */
  const { image, spriteRef, animation } = useSpriteAnimate({
    currentAnimation,
    sprite: 'hero',
    afterAnimation: () => {
      setCurrentAnimation('idle');
    },
  });

  /* Отвечает за передвижение группы */
  const { groupRef } = useMove({
    map,
    isImageExist: !!image,
    collisionMapRef,
    hitboxWidth: animation.hitboxFrames[currentAnimation].width,
    hitboxHeight: animation.hitboxFrames[currentAnimation].height,
    setCurrentAnimation,
  });

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent): void => {
      if (e.code === 'KeyF') setCurrentAnimation('axe');
    };

    window.addEventListener('keydown', handleKeyDown);

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, []);

  return (
    <Layer>
      {image && (
        <Group
          ref={groupRef}
          width={animation.hitboxFrames[currentAnimation].width}
          height={animation.hitboxFrames[currentAnimation].height}>
          <Rect // Хитбокс
            width={animation.hitboxFrames[currentAnimation].width}
            height={animation.hitboxFrames[currentAnimation].height}
            fill={'red'}
          />
          <Sprite // Спрайт
            ref={spriteRef}
            image={image}
            animation={currentAnimation}
            animations={animation.frames}
            frameRate={animation.frameRate}
            frameIndex={animation.frameIndex}
          />
        </Group>
      )}
    </Layer>
  );
};
