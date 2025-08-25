import type { ActionType, IAnimation } from 'src/interfaces';

import { axeAnimation } from './axe.animation';
import { idleAnimation } from './idle.animation';
import { runningAnimation } from './running.animation';

type AnimationDictionary = Record<ActionType, IAnimation>;

const animations: AnimationDictionary = {
  idle: idleAnimation,
  running: runningAnimation,
  axe: axeAnimation,
};

export { animations };
