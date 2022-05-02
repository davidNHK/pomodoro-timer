import { Injectable, Logger } from '@nestjs/common';

import {
  FireStore,
  InjectFireStore,
  WhereFilterOp,
} from '../../database/database.module';
import type {
  ConnectedProvider,
  UserProvider,
} from './connected-provider.model';

type FindOneParams = {
  connectedToUserId?: string;
  provider?: UserProvider;
  userId?: string;
};

@Injectable()
export class ConnectedProviderRepository {
  private logger = new Logger(ConnectedProviderRepository.name);

  constructor(@InjectFireStore() private db: FireStore) {}

  async create(connectedProvider: ConnectedProvider) {
    await this.db
      .collection('connected-providers')
      .doc(connectedProvider.id)
      .set(connectedProvider);
  }

  async exist(params: FindOneParams) {
    return (await this.findOne(params)) !== null;
  }

  async findAll({ connectedToUserId }: { connectedToUserId: string }) {
    const query: [string, WhereFilterOp, unknown][] = [
      ['connectedToUserId', '==', connectedToUserId],
    ];
    let connectedProvidersRef: any = this.db.collection('connected-providers');
    query.forEach(([field, operator, value]) => {
      if (!value) return;
      connectedProvidersRef = connectedProvidersRef.where(
        field,
        operator,
        value,
      );
    });
    const snapshot = await connectedProvidersRef.get();
    return snapshot.docs.map((doc: any) => doc.data()) as ConnectedProvider[];
  }

  async findOne({ connectedToUserId, provider, userId }: FindOneParams) {
    const query: [string, WhereFilterOp, unknown][] = [
      ['connectedToUserId', '==', connectedToUserId],
      ['provider', '==', provider],
      ['userId', '==', userId],
    ];
    let connectedProvidersRef: any = this.db.collection('connected-providers');
    query.forEach(([field, operator, value]) => {
      if (!value) return;
      connectedProvidersRef = connectedProvidersRef.where(
        field,
        operator,
        value,
      );
    });
    const snapshot = await connectedProvidersRef.get();
    if (snapshot.empty) return null;
    return snapshot.docs[0].data() as ConnectedProvider;
  }
}
