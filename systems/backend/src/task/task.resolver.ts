import { Query, Resolver } from '@nestjs/graphql';

import { Task } from './task.model';

@Resolver(() => Task)
export class TaskResolver {
  @Query(() => [Task])
  async tasks() {
    return [
      { createdAt: new Date(), id: 1, title: 'Task 1' },
      { createdAt: new Date(), id: 2, title: 'Task 2' },
    ];
  }
}
