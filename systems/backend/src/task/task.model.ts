import {
  Field,
  ID,
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

@InputType()
export class QueryTasksFilterInput {
  @Field(() => [TaskStatus], { nullable: false })
  statuses!: TaskStatus[];
}

@ObjectType()
export class Pomodoro {
  @Field(() => ID)
  declare id: string;

  @Field()
  userId!: string;

  @Field()
  taskId!: string;

  @Field()
  completeAt!: Date;

  @Field()
  startAt!: Date;
}

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

  @Field(() => Date, { nullable: true })
  startedAt?: Date | null;

  @Field({ nullable: true })
  completedPomodoro?: number;
}

@InputType()
export class TaskInput extends OmitType(
  Task,
  ['id', 'createdAt', 'status'] as const,
  InputType,
) {}
