import type KonvaType from 'konva';
import { useEffect, useRef, useState, type RefObject } from 'react';
import { Rect, Sprite, Group, Image } from 'react-konva';
import { useImage } from 'react-konva-utils';

import axeImageUrl from 'src/assets/ui/axe_ui.png';
import type { CollisionMapDataType, HeroActionsType } from 'src/interfaces';
import { useSpriteAnimate } from 'src/shared/ui/Map/hooks';
import type { IMap } from 'src/shared/ui/Map/hooks/useCreateMap';

import type { IMetaData } from '../../index';

import { useMove } from './hooks';

export interface IHeroSpriteProps {
  map: IMap;
  collisionMapRef: RefObject<CollisionMapDataType>;
  metaDataRef: RefObject<IMetaData>;
  initialPosX?: number;
  initialPosY?: number;
}

export const HeroSprite = ({
  map,
  metaDataRef,
  collisionMapRef,
  initialPosX = 0,
  initialPosY = 0,
}: IHeroSpriteProps) => {
  const [currentAnimation, setCurrentAnimation] =
    useState<HeroActionsType>('idle');

  const uiImageRef = useRef<KonvaType.Image | null>(null);

  /* Отвечает за анимацию (анимация !== движение) */
  const { image, spriteRef, animation } = useSpriteAnimate({
    currentAnimation,
    sprite: 'hero',
    afterAnimation: () => {
      setCurrentAnimation('idle');
    },
  });

  const [axeImage] = useImage(axeImageUrl, 'anonymous');

  /* Отвечает за передвижение группы */
  const { groupRef } = useMove({
    map,
    isImageExist: !!image,
    collisionMapRef,
    metaDataRef,
    uiImageRef,
    hitboxWidth: animation.hitboxFrames[currentAnimation].width,
    hitboxHeight: animation.hitboxFrames[currentAnimation].height,
    initialPosX,
    initialPosY,
    setCurrentAnimation,
  });

  useEffect(() => {
    uiImageRef.current?.hide();
  }, [image]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent): void => {
      const { canAction, interactionId } = metaDataRef.current;
      if (
        e.code === 'KeyF' &&
        canAction &&
        interactionId !== null &&
        currentAnimation === 'idle'
      ) {
        setCurrentAnimation('axe');
        metaDataRef.current = {
          canAction: false,
          interactionId: null,
        };
        uiImageRef.current?.hide();
      }
    };

    window.addEventListener('keydown', handleKeyDown);

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, []);

  if (!image) return null;

  return (
    <Group
      ref={groupRef}
      width={animation.hitboxFrames[currentAnimation].width}
      height={animation.hitboxFrames[currentAnimation].height}>
      <Image // Картинка инструмента
        ref={uiImageRef}
        image={axeImage}
        x={10}
        y={-35}
      />
      <Rect // Хитбокс
        width={animation.hitboxFrames[currentAnimation].width}
        height={animation.hitboxFrames[currentAnimation].height}
        // fill={'red'}
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
  );
};
