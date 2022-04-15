import { Field, InputType, ObjectType, OmitType } from '@nestjs/graphql';

@ObjectType()
export class ConnectedProvider {
  @Field({ nullable: false })
  provider!: 'atlassian' | 'google';

  @Field({ nullable: false })
  connectedToUserId!: string;

  @Field({ nullable: false })
  connectedAt!: Date;

  @Field({ nullable: false })
  userId!: string;

  @Field({ nullable: false })
  userName!: string;

  @Field({ nullable: false })
  userEmail!: string;

  @Field({ nullable: true })
  userAvatar!: string;
}

@InputType()
export class ConnectedProviderInput extends OmitType(ConnectedProvider, [
  'connectedToUserId',
  'connectedAt',
] as const) {}
