import type { IAnimation } from 'src/interfaces';
import type { SpritesType } from 'src/interfaces/animationInterface';

import { heroAnimation } from './hero.animation';
import { treeAnimation } from './tree.animation';

type AnimationDictionary = {
  [K in SpritesType]: IAnimation<K>;
};

const animations: AnimationDictionary = {
  tree: treeAnimation,
  hero: heroAnimation,
};

export { animations };
