import { HttpModule } from '@nestjs/axios';
import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';

import { UserModule } from '../user/user.module';
import { JiraResolver } from './jira/jira.resolver';
import { JiraService } from './jira/jira.service';
import { PomodoroRecordService } from './pomodoro-record/pomodoro-record.service';
import { TaskResolver } from './task.resolver';
import { TaskService } from './task.service';

@Module({
  imports: [ConfigModule, UserModule, HttpModule],
  providers: [
    TaskResolver,
    TaskService,
    PomodoroRecordService,
    JiraService,
    JiraResolver,
  ],
})
export class TaskModule {}
