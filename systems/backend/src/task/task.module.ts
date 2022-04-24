import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';

import { PomodoroRecordService } from './pomodoro-record/pomodoro-record.service';
import { TaskResolver } from './task.resolver';
import { TaskService } from './task.service';

@Module({
  imports: [ConfigModule],
  providers: [TaskResolver, TaskService, PomodoroRecordService],
})
export class TaskModule {}
