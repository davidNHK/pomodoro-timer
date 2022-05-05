import { HttpModule } from '@nestjs/axios';
import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';

import { AuthModule } from '../auth/auth.module';
import { UserModule } from '../user/user.module';
import { FocusedTaskRepository } from './focused-task.repository';
import { JiraResolver } from './jira/jira.resolver';
import { JiraService } from './jira/jira.service';
import { PomodoroRecordRepository } from './pomodoro-record/pomodoro-record.repository';
import { PomodoroRecordService } from './pomodoro-record/pomodoro-record.service';
import { TaskRepository } from './task.repository';
import { TaskResolver } from './task.resolver';
import { TaskService } from './task.service';

@Module({
  imports: [ConfigModule, UserModule, HttpModule, AuthModule],
  providers: [
    PomodoroRecordRepository,
    TaskRepository,
    FocusedTaskRepository,
    TaskResolver,
    TaskService,
    PomodoroRecordService,
    JiraService,
    JiraResolver,
  ],
})
export class TaskModule {}
