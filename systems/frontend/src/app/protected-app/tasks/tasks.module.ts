import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatInputModule } from '@angular/material/input';

import { AddTaskComponent } from './add-task/add-task.component';
import { TasksListComponent } from './tasks-list/tasks-list.component';

@NgModule({
  declarations: [TasksListComponent, AddTaskComponent],
  exports: [TasksListComponent, AddTaskComponent],
  imports: [
    CommonModule,
    MatButtonModule,
    MatInputModule,
    MatCardModule,
    ReactiveFormsModule,
  ],
})
export class TasksModule {}
