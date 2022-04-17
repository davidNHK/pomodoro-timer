import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';

import { TaskResolver } from './task.resolver';
import { TaskService } from './task.service';

@Module({
  imports: [ConfigModule],
  providers: [TaskResolver, TaskService],
})
export class TaskModule {}
