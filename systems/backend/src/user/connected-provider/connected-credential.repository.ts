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

  constructor(private db: ConnectionProvider) {}

  async create(connectedCredential: ConnectedCredential) {
    await this.db
      .collection('connected-credentials')
      .doc(connectedCredential.id)
      .set(connectedCredential);
  }

  async update(
    id: string,
    connectedCredential: Pick<
      ConnectedCredential,
      'accessToken' | 'refreshToken'
    >,
  ) {
    await this.db
      .collection('connected-credentials')
      .doc(id)
      .update(connectedCredential);
  }

  async exist(params: FindOneParams) {
    return (await this.findOne(params)) !== null;
  }

  async findOne({ connectedProviderId, userId }: FindOneParams) {
    const query: [string, WhereFilterOp, unknown][] = [
      ['connectedProviderId', '==', connectedProviderId],
      ['userId', '==', userId],
    ];
    let connectedCredentialsRef: any = await this.db.collection(
      'connected-credentials',
    );
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
