import { Injectable, Logger } from '@nestjs/common';

import { ConnectionProvider } from '../../database/connection.provider';
import type { WhereFilterOp } from '../../database/database.module';
import type { ConnectedCredential } from './connected-provider.model';

type FindOneParams = {
  connectedProviderId: string;
  userId: string;
};

@Injectable()
export class ConnectedCredentialRepository {
  private logger = new Logger(ConnectedCredentialRepository.name);

  constructor(private connection: ConnectionProvider) {}

  get collection() {
    return this.connection.collection('connected_credentials');
  }

  async create(connectedCredential: ConnectedCredential) {
    await this.collection.doc(connectedCredential.id).set(connectedCredential);
  }

  async update(
    id: string,
    connectedCredential: Pick<
      ConnectedCredential,
      'accessToken' | 'refreshToken'
    >,
  ) {
    await this.collection.doc(id).update(connectedCredential);
  }

  async exist(params: FindOneParams) {
    return (await this.findOne(params)) !== null;
  }

  async findOne({ connectedProviderId, userId }: FindOneParams) {
    const query: [string, WhereFilterOp, unknown][] = [
      ['connectedProviderId', '==', connectedProviderId],
      ['userId', '==', userId],
    ];
    let connectedCredentialsRef: any = this.collection;
    query.forEach(([field, operator, value]) => {
      if (!value) return;
      connectedCredentialsRef = connectedCredentialsRef.where(
        field,
        operator,
        value,
      );
    });
    const snapshot = await connectedCredentialsRef.get();
    if (snapshot.empty) return null;
    return snapshot.docs[0].data() as ConnectedCredential;
  }
}
