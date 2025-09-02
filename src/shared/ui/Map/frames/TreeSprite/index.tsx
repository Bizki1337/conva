import type KonvaType from 'konva';
import { useEffect, useRef, useState } from 'react';
import { Layer, Sprite, Rect, Group } from 'react-konva';

import type { TreeActionsType } from 'src/interfaces/animationInterface';
import { useSpriteAnimate } from 'src/shared/ui/Map/hooks';

export interface ITreeSpriteProps {
  initialPosX: number;
  initialPosY: number;
}

export const TreeSprite = ({ initialPosX, initialPosY }: ITreeSpriteProps) => {
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
