import type { ActionType, IAnimation } from 'src/interfaces';

import { axeAnimation } from './axe.animation';
import { idleAnimation } from './idle.animation';
import { runningAnimation } from './running.animation';
import { treeHitAnimation } from './treeHit.animation';
import { treeHitLeavesAnimation } from './treeHitLeaves.animation';

type AnimationDictionary = Record<ActionType, IAnimation>;

const animations: AnimationDictionary = {
  idle: idleAnimation,
  running: runningAnimation,
  axe: axeAnimation,
  treeHit: treeHitAnimation,
  treeHitLeaves: treeHitLeavesAnimation,
};

export { animations };
