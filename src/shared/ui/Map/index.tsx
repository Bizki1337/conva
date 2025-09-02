import { useEffect, type ComponentType } from 'react';
import { Stage, Layer, Image } from 'react-konva';

import grass from 'src/assets/tiles/grass3.png';
import type { LandscapeSpritesType } from 'src/interfaces/animationInterface';
import { mapObjects } from 'src/shared/ui/Map/constants';

import { HeroSprite, TreeSprite } from './frames';
import type { ITreeSpriteProps } from './frames/TreeSprite';
import { useCreateMap } from './hooks';
import styles from './styles.module.scss';

const MAP_WIDTH = 1000;
const MAP_HEIGHT = 800;

type LandscapeComponentType = Record<
  LandscapeSpritesType,
  ComponentType<ITreeSpriteProps> // Так как объект ландшафта только один, пока что будут пропсы от него
>;

const getLandscapeComponent = (type: LandscapeSpritesType) => {
  const components: LandscapeComponentType = {
    tree: TreeSprite,
  };

  return components[type] || null;
};

export const Map = () => {
  const { tiles, map, image, collisionMapRef, generateTiles } = useCreateMap({
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
          {tiles.map(
            (
              tile, // Отрисовка пола по тайлам
            ) => (
              <Image
                key={tile.id}
                x={tile.x}
                y={tile.y}
                width={tile.width}
                height={tile.height}
                image={image}
              />
            ),
          )}
        </Layer>
        {mapObjects.map((object) => {
          // Отрисовка объекта ландшафта
          const LandscapeComponent = getLandscapeComponent(object.type);

          if (!LandscapeComponent) return null;

          return (
            <LandscapeComponent
              key={object.id}
              id={object.id}
              initialPosX={object.x}
              initialPosY={object.y}
              collisionMapRef={collisionMapRef}
            />
          );
        })}
        <HeroSprite // Отрисовка героя
          map={map}
          collisionMapRef={collisionMapRef}
        />
      </Stage>
    </div>
  );
};
