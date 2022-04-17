import { UseGuards } from '@nestjs/common';
import { Query, Resolver } from '@nestjs/graphql';

import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { Task } from './task.model';

@Resolver(() => Task)
export class TaskResolver {
  @Query(() => [Task])
  @UseGuards(JwtAuthGuard)
  async tasks() {
    return [
      { createdAt: new Date(), id: 1, title: 'Task 1' },
      { createdAt: new Date(), id: 2, title: 'Task 2' },
    ];
  }
}
