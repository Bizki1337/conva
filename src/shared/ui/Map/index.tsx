import { useEffect } from 'react';
import { Stage, Layer, Image } from 'react-konva';

import grass from 'src/assets/tiles/grass3.png';

import { HeroSprite, TreeSprite } from './frames';
import { useCreateMap } from './hooks';
import styles from './styles.module.scss';

const MAP_WIDTH = 1000;
const MAP_HEIGHT = 800;

export const Map = () => {
  const { tiles, map, image, generateTiles } = useCreateMap({
    width: MAP_WIDTH,
    height: MAP_HEIGHT,
    tileImageUrl: grass,
  });

  useEffect(() => {
    generateTiles();
  }, [generateTiles]);

  return (
    <div className={styles.wrapper}>
      <Stage
        width={MAP_WIDTH}
        height={MAP_HEIGHT}
        className={styles.stage}>
        <Layer>
          {tiles.map((tile) => (
            <Image
              key={tile.id}
              x={tile.x}
              y={tile.y}
              width={tile.width}
              height={tile.height}
              image={image}
            />
          ))}
        </Layer>
        <TreeSprite
          initialPosX={400}
          initialPosY={400}
        />
        <HeroSprite map={map} />
      </Stage>
    </div>
  );
};
