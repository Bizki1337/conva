import { Layer, Rect, Sprite, Group } from 'react-konva';

import type { IMap } from 'src/shared/ui/Map/hooks/useCreateMap';

import { useMove, useSpriteAnimate } from './hooks';

export interface IHeroSpriteProps {
  map: IMap;
  initialPosX: number;
  initialPosY: number;
}

export const HeroSprite = ({
  // map,
  initialPosX,
  initialPosY,
}: IHeroSpriteProps) => {
  const {
    image,
    hitbox,
    spriteRef,
    spriteState,
    currentAnimation,
    animation,
    setCurrentAnimation,
  } = useSpriteAnimate({
    initialPosX,
    initialPosY,
  });

  const { groupRef } = useMove({
    isImageExist: !!image,
    setCurrentAnimation,
  });

  return (
    <Layer>
      {image && (
        <>
          <Group
            ref={groupRef}
            x={initialPosX}
            y={initialPosY}>
            <Rect
              x={hitbox.x}
              y={hitbox.y}
              width={hitbox.width}
              height={hitbox.height}
              fill={hitbox.hitboxFill}
            />
            <Sprite
              ref={spriteRef}
              x={spriteState.x}
              y={spriteState.y}
              image={image}
              animation={currentAnimation}
              animations={animation.frames}
              frameRate={animation.frameRate}
              frameIndex={animation.frameIndex}
            />
          </Group>
        </>
      )}
    </Layer>
  );
};
