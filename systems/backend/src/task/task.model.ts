import {
  Field,
  InputType,
  ObjectType,
  OmitType,
  registerEnumType,
} from '@nestjs/graphql';

export enum TaskStatus {
  DONE = 'DONE',
  PENDING = 'PENDING',
  STARTED = 'STARTED',
}

registerEnumType(TaskStatus, {
  name: 'TaskStatus',
});

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

  @Field(() => TaskStatus, { nullable: false })
  status!: TaskStatus;
}

@InputType()
export class TaskInput extends OmitType(
  Task,
  ['id', 'createdAt', 'status'] as const,
  InputType,
) {}
