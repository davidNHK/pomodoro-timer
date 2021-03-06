import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatInputModule } from '@angular/material/input';
import { MatListModule } from '@angular/material/list';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { MatTabsModule } from '@angular/material/tabs';

import { AddTaskComponent } from './add-task/add-task.component';
import { CountdownComponent } from './countdown/countdown.component';
import { FormatMsPipe } from './format-ms.pipe';
import {
  AssignedTaskGQL,
  CreateTaskGQL,
  FinishFocusedTaskGQL,
  RecordPomodoroGQL,
  SetUserFocusTaskGQL,
  TodoGQL,
} from './graphql';
import { JiraAssignedTaskListComponent } from './jira-assigned-task-list/jira-assigned-task-list.component';
import { TaskTimerComponent } from './task-timer/task-timer.component';
import { TasksListComponent } from './tasks-list/tasks-list.component';

@NgModule({
  declarations: [
    TasksListComponent,
    AddTaskComponent,
    TaskTimerComponent,
    CountdownComponent,
    FormatMsPipe,
    JiraAssignedTaskListComponent,
  ],
  exports: [TasksListComponent, AddTaskComponent, TaskTimerComponent],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    MatButtonModule,
    MatInputModule,
    MatCardModule,
    MatSnackBarModule,
    MatProgressSpinnerModule,
    MatListModule,
    MatTabsModule,
  ],
  providers: [
    TodoGQL,
    CreateTaskGQL,
    SetUserFocusTaskGQL,
    FinishFocusedTaskGQL,
    RecordPomodoroGQL,
    AssignedTaskGQL,
  ],
})
export class TasksModule {}
