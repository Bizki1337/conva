import { useEffect, useRef, type ComponentType, type RefObject } from 'react';
import { Stage, Layer, Image } from 'react-konva';
import { useImage } from 'react-konva-utils';

import anvilPng from 'src/assets/objects/anvil.png';
import fenceHorizontalPng from 'src/assets/objects/fence_horizontal.png';
import fenceVerticalPng from 'src/assets/objects/fence_vertical.png';
import forgePng from 'src/assets/objects/forge.png';
import housePng from 'src/assets/objects/house.png';
import rockPng from 'src/assets/objects/rock.png';
import troughPng from 'src/assets/objects/trough.png';
import grass from 'src/assets/tiles/grass3.png';
import type {
  CollisionMapDataType,
  StaticSprites,
  LandscapeSpritesType,
} from 'src/interfaces';
import { mapObjects } from 'src/shared/ui/Map/constants';

import { HeroSprite, TreeSprite, StaticSprite } from './frames';
import { useCreateMap } from './hooks';
import styles from './styles.module.scss';

//TODO: Вынести константы и типы
const MAP_WIDTH = 1280;
const MAP_HEIGHT = 1024;

const imgs: Record<StaticSprites, string> = {
  anvil: anvilPng,
  fence_horizontal: fenceHorizontalPng,
  fence_vertical: fenceVerticalPng,
  forge: forgePng,
  house: housePng,
  rock: rockPng,
  trough: troughPng,
};

export interface IMetaData {
  canAction: boolean; // можем ли герою взаимодействовать
  interactionId: string | null; // id спрайта, с которым взаимодействуем
}

export interface ISpriteProps {
  id: string;
  initialPosX: number;
  initialPosY: number;
  collisionMapRef: RefObject<CollisionMapDataType>;
  metaDataRef?: RefObject<IMetaData>;
  imgUrl?: string;
}

type LandscapeComponentType = Record<
  LandscapeSpritesType,
  ComponentType<ISpriteProps>
>;

const getLandscapeComponent = (type: LandscapeSpritesType) => {
  const components: LandscapeComponentType = {
    tree: TreeSprite,
    // Статичные спрайты
    anvil: StaticSprite,
    fence_horizontal: StaticSprite,
    fence_vertical: StaticSprite,
    forge: StaticSprite,
    house: StaticSprite,
    rock: StaticSprite,
    trough: StaticSprite,
  };

  return components[type] || null;
};

export const Map = () => {
  const { map, image, collisionMapRef } = useCreateMap({
    width: MAP_WIDTH,
    height: MAP_HEIGHT,
    tileImageUrl: grass,
  });

  // Хранится дополнительная информация о герое
  const metaDataRef = useRef<IMetaData>({
    canAction: false,
    interactionId: null,
  });

  return (
    <div className={styles.wrapper}>
      <Stage
        width={MAP_WIDTH}
        height={MAP_HEIGHT}
        className={styles.stage}>
        <Layer>
          <Image
            x={0}
            y={0}
            width={MAP_WIDTH}
            height={MAP_HEIGHT}
            image={image}
          />
        </Layer>
        <Layer>
          {mapObjects.map((object) => {
            // Отрисовка объектов ландшафта
            const LandscapeComponent = getLandscapeComponent(object.type);

            if (!LandscapeComponent) return null;

            return (
              <LandscapeComponent
                key={object.id}
                id={object.id}
                initialPosX={object.x}
                initialPosY={object.y}
                collisionMapRef={collisionMapRef}
                metaDataRef={metaDataRef}
                imgUrl={imgs[object.type as StaticSprites]} // TODO: поправить типизацию
              />
            );
          })}
        </Layer>
        <Layer>
          <HeroSprite // Отрисовка героя
            metaDataRef={metaDataRef}
            map={map}
            initialPosY={200}
            collisionMapRef={collisionMapRef}
          />
        </Layer>
      </Stage>
    </div>
  );
};
