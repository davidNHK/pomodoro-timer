import {
  Field,
  ID,
  InputType,
  ObjectType,
  OmitType,
  registerEnumType,
} from '@nestjs/graphql';

export enum UserProvider {
  ATLASSIAN = 'atlassian',
  GOOGLE = 'google',
}

registerEnumType(UserProvider, {
  name: 'UserProvider',
});

@ObjectType()
export class ConnectedProvider {
  @Field(() => ID)
  declare id: string;

  @Field(() => UserProvider, { nullable: false })
  provider!: UserProvider;

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
  'id',
  'connectedToUserId',
  'connectedAt',
] as const) {}
