import type KonvaType from 'konva';
import { useEffect, useRef, useState, type RefObject } from 'react';
import { Layer, Sprite, Rect, Group } from 'react-konva';

import type {
  CollisionMapDataType,
  TreeActionsType,
} from 'src/interfaces/animationInterface';
import { useSpriteAnimate } from 'src/shared/ui/Map/hooks';

export interface ITreeSpriteProps {
  id: number;
  initialPosX: number;
  initialPosY: number;
  collisionMapRef: RefObject<CollisionMapDataType>;
}

export const TreeSprite = ({
  id,
  initialPosX,
  initialPosY,
  collisionMapRef,
}: ITreeSpriteProps) => {
  const [currentAnimation, setCurrentAnimation] =
    useState<TreeActionsType>('idle');

  const groupRef = useRef<KonvaType.Group | null>(null);

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
    if (!groupRef.current) return;

    groupRef.current.setPosition({
      x: initialPosX,
      y: initialPosY,
    });

    // Заполнение карты коллизий при начальном рендере
    const { width, height } = groupRef.current.size();
    collisionMapRef.current = {
      ...collisionMapRef.current,
      [id]: {
        ...collisionMapRef.current[id],
        x: initialPosX,
        y: initialPosY,
        width,
        height,
      },
    };
  }, [image, initialPosX, initialPosY]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent): void => {
      if (e.code === 'KeyF') setCurrentAnimation('hitted');
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
      const { x, y } = group.position();
      const { width, height } = group.size();
      collisionMapRef.current = {
        ...collisionMapRef.current,
        [id]: {
          ...collisionMapRef.current[id],
          x,
          y,
          width,
          height,
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
