import { Inject, Module } from '@nestjs/common';
import Firebase from 'firebase-admin';

const FIRE_STORE = Symbol('FIRE_STORE');

export function InjectFireStore() {
  return Inject(FIRE_STORE);
}

export type FireStore = Firebase.firestore.Firestore;
export type WhereFilterOp = Firebase.firestore.WhereFilterOp;

@Module({})
export class DatabaseModule {
  static forRoot() {
    Firebase.initializeApp({
      credential: Firebase.credential.applicationDefault(),
    });
    return {
      exports: [FIRE_STORE],
      global: true,
      module: DatabaseModule,
      providers: [
        {
          provide: FIRE_STORE,
          useValue: Firebase.firestore(),
        },
      ],
    };
  }
}
