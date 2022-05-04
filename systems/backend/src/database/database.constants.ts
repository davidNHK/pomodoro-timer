import { Inject } from '@nestjs/common';

export const FIRE_STORE = Symbol('FIRE_STORE');
export function InjectFireStore() {
  return Inject(FIRE_STORE);
}
