import { Module } from '@nestjs/common';
import Firebase from 'firebase-admin';

import { ConnectionProvider } from './connection.provider';
import { FIRE_STORE } from './database.constants';

export type FireStore = Firebase.firestore.Firestore;
export type WhereFilterOp = Firebase.firestore.WhereFilterOp;
export type FieldValue = Firebase.firestore.FieldValue;

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

  static forFeature() {
    return {
      exports: [ConnectionProvider],
      module: DatabaseModule,
      providers: [ConnectionProvider],
    };
  }
}
