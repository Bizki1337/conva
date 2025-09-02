import { useState } from 'react';
import { Layer, Rect, Sprite, Group } from 'react-konva';

import type { HeroActionsType } from 'src/interfaces';
import { useSpriteAnimate } from 'src/shared/ui/Map/hooks';
import type { IMap } from 'src/shared/ui/Map/hooks/useCreateMap';

import { useMove } from './hooks';

export interface IHeroSpriteProps {
  map: IMap;
}

export const HeroSprite = ({ map }: IHeroSpriteProps) => {
  const [currentAnimation, setCurrentAnimation] =
    useState<HeroActionsType>('idle');

  /* Отвечает за анимацию (анимация !== движение) */
  const { image, spriteRef, animation } = useSpriteAnimate({
    currentAnimation,
    sprite: 'hero',
  });

  /* Отвечает за передвижение группы */
  const { groupRef } = useMove({
    map,
    isImageExist: !!image,
    setCurrentAnimation,
  });

  return (
    <Layer>
      {image && (
        <Group
          ref={groupRef}
          width={animation.hitboxFrames[currentAnimation].width}
          height={animation.hitboxFrames[currentAnimation].height}>
          <Rect // хитбокс
            width={animation.hitboxFrames[currentAnimation].width}
            height={animation.hitboxFrames[currentAnimation].height}
            fill={'red'}
          />
          <Sprite // спрайт
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
