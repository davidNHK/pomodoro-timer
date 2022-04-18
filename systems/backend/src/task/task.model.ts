import { Field, InputType, ObjectType, OmitType } from '@nestjs/graphql';

@ObjectType()
export class Task {
  @Field()
  declare id: string;

  @Field({ nullable: false })
  title!: string;

  @Field({ nullable: false })
  createdAt!: Date;

  @Field({ nullable: true })
  notes?: string;
}

@InputType()
export class TaskInput extends OmitType(
  Task,
  ['id', 'createdAt'] as const,
  InputType,
) {}
