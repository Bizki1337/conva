import { useRef } from 'react';
import { useImage } from 'react-konva-utils';

import backGroundPng from 'src/assets/background.png';
import type { CollisionMapDataType } from 'src/interfaces';

interface Tile {
  x: number;
  y: number;
  width: number;
  height: number;
  id: string;
  imageUrl: string;
}

export interface IMap {
  width: number;
  height: number;
}

interface IUseCreateMapProps {
  width: number;
  height: number;
  tileSize?: number;
  tileImageUrl: string; // URL изображения тайла
}

export const useCreateMap = ({ width, height }: IUseCreateMapProps) => {
  const [backgroundImage] = useImage(backGroundPng);
  const collisionMapRef = useRef<CollisionMapDataType>({});

  return {
    map: {
      height,
      width,
    },
    image: backgroundImage,
    collisionMapRef,
  };
};
