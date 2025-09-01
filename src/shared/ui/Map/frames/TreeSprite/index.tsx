import type Konva from 'konva';
import { useEffect, useRef, useState } from 'react';
import { Layer, Sprite, Rect } from 'react-konva';
import { useImage } from 'react-konva-utils';

import type { TreeActionsType } from 'src/interfaces/animationInterface';
import { animations } from 'src/shared/ui/Map/animations';
// import { animations } from 'src/shared/ui/Map/animations';
import type { IMap } from 'src/shared/ui/Map/hooks/useCreateMap';

interface IHitbox {
  x: number;
  y: number;
  width: number;
  height: number;
  hitboxFill: string;
}

export interface ITreeSpriteProps {
  map: IMap;
  initialPosX: number;
  initialPosY: number;
}

export const TreeSprite = ({
  // map,
  initialPosX,
  initialPosY,
}: ITreeSpriteProps) => {
  const animation = structuredClone(animations.tree);
  const [hitbox, setHitbox] = useState<IHitbox>({
    x: initialPosX,
    y: initialPosY,
    width: 0,
    height: 0,
    hitboxFill: 'red',
  });

  const [image] = useImage(animation?.spriteSheetUrl || '');

  const spriteRef = useRef<Konva.Sprite | null>(null);
  const [currentAnimation, setCurrentAnimation] =
    useState<TreeActionsType>('idle');
  const [isPlaying, setIsPlaying] = useState(false);

  const animate = () => {
    if (spriteRef.current && !isPlaying) {
      setIsPlaying(true);
      setCurrentAnimation('hitted');

      const sprite = spriteRef.current;
      sprite.animation('hitted');
      sprite.start();

      sprite.on('frameIndexChange.hitted', () => {
        // Когда достигаем последнего кадра анимации hit
        if (
          sprite.frameIndex() ===
          animation.hitboxFrames[currentAnimation].framesCount - 1
        ) {
          setTimeout(() => {
            sprite.stop();
            setCurrentAnimation('felled');
            setIsPlaying(false);
            sprite.off('.hitted');
          }, 1000 / sprite.frameRate());
        }
      });
    }
  };

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent): void => {
      if (e.key === 'f' && !isPlaying) {
        animate();
      }
    };

    window.addEventListener('keydown', handleKeyDown);

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [isPlaying]);

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

  return (
    <Layer>
      {image && (
        <>
          <Rect
            x={hitbox.x}
            y={hitbox.y}
            width={hitbox.width}
            height={hitbox.height}
            fill={hitbox.hitboxFill}
          />
          <Sprite
            ref={spriteRef}
            x={hitbox.x}
            y={hitbox.y}
            image={image}
            animation={currentAnimation}
            animations={animation?.frames}
            frameRate={animation.frameRate}
            frameIndex={animation.frameIndex}
          />
        </>
      )}
    </Layer>
  );
};
