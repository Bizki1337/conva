import type KonvaType from 'konva';
import { useEffect, useRef, useState, type RefObject } from 'react';
import { Layer, Sprite, Rect, Group } from 'react-konva';

import type { CollisionMapDataType, TreeActionsType } from 'src/interfaces';
import { useSpriteAnimate } from 'src/shared/ui/Map/hooks';

import type { IMetaData } from '../../index';

import { createInteractionAreaData } from './utils';

export interface ITreeSpriteProps {
  id: number;
  initialPosX: number;
  initialPosY: number;
  metaDataRef: RefObject<IMetaData>;
  collisionMapRef: RefObject<CollisionMapDataType>;
}

export const TreeSprite = ({
  id,
  initialPosX,
  initialPosY,
  metaDataRef,
  collisionMapRef,
}: ITreeSpriteProps) => {
  const [currentAnimation, setCurrentAnimation] =
    useState<TreeActionsType>('idle');

  const groupRef = useRef<KonvaType.Group | null>(null);
  const interactionAreaRef = useRef<KonvaType.Rect | null>(null);

  /* Отвечает за анимацию (анимация !== движение) */
  const { image, spriteRef, animation } = useSpriteAnimate({
    currentAnimation,
    sprite: 'tree',
    afterAnimation: () => {
      setCurrentAnimation('felled');
      if (!groupRef.current) return;
      const { x, y } = groupRef.current.position();
      groupRef.current?.setPosition({
        x: x + 8,
        y:
          y +
          (animation.hitboxFrames.idle.height -
            animation.hitboxFrames.felled.height),
      });
    },
  });

  useEffect(() => {
    if (!groupRef.current || !interactionAreaRef.current) return;

    const initialPosition = {
      x: initialPosX,
      y: initialPosY,
    };
    // Заполнение карты коллизий при начальном рендере
    const { width: groupWidth, height: groupHeight } = groupRef.current.size();

    groupRef.current.setPosition(initialPosition);

    const interactionArea = createInteractionAreaData({
      currentAnimation,
      groupHeight,
      groupWidth,
    });

    interactionAreaRef.current.setPosition({
      x: interactionArea.x,
      y: interactionArea.y,
    });
    interactionAreaRef.current.setSize({
      width: interactionArea.width,
      height: interactionArea.height,
    });

    collisionMapRef.current = {
      ...collisionMapRef.current,
      [id]: {
        ...collisionMapRef.current[id],
        ...initialPosition,
        id,
        width: groupWidth,
        height: groupHeight,
        interactionArea,
      },
    };
  }, [image, initialPosX, initialPosY]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent): void => {
      const canAction =
        metaDataRef.current.interactionId === id && currentAnimation === 'idle';
      if (e.code === 'KeyF' && canAction) {
        setTimeout(() => {
          setCurrentAnimation('hitted');
        }, 500);
      }
    };

    window.addEventListener('keydown', handleKeyDown);

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, []);

  useEffect(() => {
    if (!groupRef.current) return;

    const group = groupRef.current;

    // Заполнение карты коллизий при изменении позиции
    const handlePositionChange = () => {
      if (!interactionAreaRef.current) return;
      const { x: groupX, y: groupY } = group.position();
      const { width: groupWidth, height: groupHeight } = group.size();

      const interactionArea = createInteractionAreaData({
        currentAnimation,
        groupHeight,
        groupWidth,
      });
      interactionAreaRef.current.setPosition({
        x: interactionArea.x,
        y: interactionArea.y,
      });
      interactionAreaRef.current.setSize({
        width: interactionArea.width,
        height: interactionArea.height,
      });

      collisionMapRef.current = {
        ...collisionMapRef.current,
        [id]: {
          ...collisionMapRef.current[id],
          id,
          x: groupX,
          y: groupY,
          width: groupWidth,
          height: groupHeight,
          interactionArea,
        },
      };
    };

    group.on('xChange yChange', handlePositionChange);

    return () => {
      group.off('xChange yChange', handlePositionChange);
    };
  }, [image, currentAnimation]);

  return (
    <Layer>
      {image && (
        <Group
          ref={groupRef}
          width={animation.hitboxFrames[currentAnimation].width}
          height={animation.hitboxFrames[currentAnimation].height}>
          <Rect // Площадь возможного взаимодействия с объектом
            ref={interactionAreaRef}
            width={animation.hitboxFrames[currentAnimation].width}
            height={animation.hitboxFrames[currentAnimation].height}
            // fill={'purple'}
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
      )}
    </Layer>
  );
};
