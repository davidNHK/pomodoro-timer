import { Field, InputType, ObjectType, OmitType } from '@nestjs/graphql';

@ObjectType()
export class Task {
  @Field()
  declare id: string;

  @Field({ nullable: false })
  declare title: string;

  @Field({ nullable: false })
  declare createdAt: Date;
}

@InputType()
export class TaskInput extends OmitType(Task, ['id', 'createdAt']) {}
