import { Field, ObjectType } from '@nestjs/graphql';

import { ConnectedProvider } from './connected-provider.model';

@ObjectType()
export class User {
  @Field()
  declare id: string;

  @Field({ nullable: false })
  createdAt!: Date;

  @Field({ nullable: false })
  name!: string;

  @Field({ nullable: false })
  email!: string;

  @Field({ nullable: true })
  avatar?: string;

  @Field(() => [ConnectedProvider], { nullable: false })
  connectedProviders!: ConnectedProvider[];
}
