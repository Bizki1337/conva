import { useEffect } from 'react';
import { Group, Image, Rect } from 'react-konva';
import { useImage } from 'react-konva-utils';

import type { ISpriteProps } from 'src/shared/ui/Map';

const houseHitbox = {
  _01: {
    width: 414,
    height: 273,
  },
  _02: {
    width: 250,
    height: 82,
  },
};

export const StaticSprite = ({
  id,
  imgUrl,
  initialPosX,
  initialPosY,
  collisionMapRef,
}: ISpriteProps) => {
  const [img] = useImage(imgUrl || '');

  useEffect(() => {
    if (!collisionMapRef.current || !img) return;

    const nextSize = {
      width: img.width,
      height: img.height,
    };
    /*
      TODO: Крайне чувствительный кусок кода, так лучше не делать.
      Необходимо реализовать адекватную логику при сложных спрайтах, которые требуют составного хитбокса
    */
    if (!id.includes('house')) {
      collisionMapRef.current = {
        ...collisionMapRef.current,
        [id]: {
          ...collisionMapRef.current[id],
          ...nextSize,
          x: initialPosX,
          y: initialPosY,
          id,
        },
      };
    }
    if (id.includes('house')) {
      collisionMapRef.current = {
        ...collisionMapRef.current,
        [id + '_01']: {
          ...collisionMapRef.current[id],
          x: initialPosX,
          y: initialPosY,
          id,
          width: 414,
          height: 273,
        },
        [id + '_02']: {
          ...collisionMapRef.current[id],
          x: initialPosX,
          y: initialPosY + houseHitbox._01.height,
          id,
          width: 250,
          height: 82,
        },
      };
    }
  }, [img, initialPosX, initialPosY]);

  if (!img) return null;

  return (
    <Group
      x={initialPosX}
      y={initialPosY}
      width={img.width}
      height={img.height}>
      {!id.includes('house') && (
        <Rect
          width={img.width}
          height={img.height}
          // fill={'red'}
        />
      )}
      {id.includes('house') && (
        <Group>
          <Rect
            width={houseHitbox._01.width}
            height={houseHitbox._01.height}
            // fill={'red'}
          />
          <Rect
            x={0}
            y={houseHitbox._01.height}
            width={houseHitbox._02.width}
            height={houseHitbox._02.height}
            // fill={'red'}
          />
        </Group>
      )}

      <Image image={img} />
    </Group>
  );
};
