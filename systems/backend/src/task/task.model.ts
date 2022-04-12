import { Field, ObjectType } from '@nestjs/graphql';

@ObjectType()
export class Task {
  @Field()
  declare id: string;

  @Field({ nullable: false })
  declare title: string;

  @Field({ nullable: false })
  declare createdAt: Date;
}
