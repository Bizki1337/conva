import { useState, useCallback } from 'react';
import { useImage } from 'react-konva-utils';

interface Tile {
  x: number;
  y: number;
  width: number;
  height: number;
  id: string;
  imageUrl: string;
}

export interface IMap {
  rows: number;
  columns: number;
  width: number;
  height: number;
  tileSize: number;
}

interface IUseCreateMapProps {
  width: number;
  height: number;
  tileSize?: number;
  tileImageUrl: string; // URL изображения тайла
}

const INITIAL_MAP_STATE: IMap = {
  rows: 0,
  columns: 0,
  height: 0,
  width: 0,
  tileSize: 64,
};

export const useCreateMap = ({
  width,
  height,
  tileSize = INITIAL_MAP_STATE.tileSize,
  tileImageUrl,
}: IUseCreateMapProps) => {
  const [tiles, setTiles] = useState<Tile[]>([]);
  const [map, setMap] = useState<IMap>(INITIAL_MAP_STATE);
  const [image] = useImage(tileImageUrl);

  const generateTiles = useCallback(() => {
    const newTiles: Tile[] = [];
    const columns = Math.ceil(width / tileSize);
    const rows = Math.ceil(height / tileSize);

    for (let row = 0; row < rows; row++) {
      for (let col = 0; col < columns; col++) {
        const x = col * tileSize;
        const y = row * tileSize;

        newTiles.push({
          x,
          y,
          width: tileSize,
          height: tileSize,
          id: `tile-${row}-${col}`,
          imageUrl: tileImageUrl,
        });
      }
    }

    setTiles(newTiles);
    setMap({
      rows,
      columns,
      height,
      width,
      tileSize,
    });
    return newTiles;
  }, [width, height, tileSize, tileImageUrl]);

  const clearTiles = useCallback(() => {
    setTiles([]);
  }, []);

  return {
    tiles,
    map,
    image,
    generateTiles,
    clearTiles,
  };
};
