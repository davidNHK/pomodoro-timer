import { setTimeout } from 'timers/promises';

export function delay(ms: number) {
  return setTimeout(ms);
}
