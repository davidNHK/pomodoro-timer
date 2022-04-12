import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';

import { TaskResolver } from './task.resolver';

@Module({
  imports: [ConfigModule],
  providers: [TaskResolver],
})
export class TaskModule {}
