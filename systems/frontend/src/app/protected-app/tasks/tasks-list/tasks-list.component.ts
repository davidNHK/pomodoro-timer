import { Component, OnInit } from '@angular/core';

import { AllTasksGQL, Task } from '../graphql';

@Component({
  selector: 'app-tasks-list',
  styleUrls: ['./tasks-list.component.css'],
  templateUrl: './tasks-list.component.html',
})
export class TasksListComponent implements OnInit {
  tasks: Task[] = [];

  selectedTask: Task[] = [];

  constructor(private allTasks: AllTasksGQL) {}

  ngOnInit(): void {
    this.allTasks.watch().valueChanges.subscribe(({ data }) => {
      this.tasks = data.tasks;
    });
  }
}
