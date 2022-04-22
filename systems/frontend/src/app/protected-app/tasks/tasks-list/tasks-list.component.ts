import { Component, OnInit } from '@angular/core';
import type { MatSelectionListChange } from '@angular/material/list';

import { CountdownService } from '../countdown.service';
import { AllTasksGQL, Task } from '../graphql';

@Component({
  selector: 'app-tasks-list',
  styleUrls: ['./tasks-list.component.css'],
  templateUrl: './tasks-list.component.html',
})
export class TasksListComponent implements OnInit {
  tasks: Task[] = [];

  constructor(
    private allTasks: AllTasksGQL,
    private countDownService: CountdownService,
  ) {}

  get isTimerRunning(): boolean {
    return this.countDownService.running;
  }

  ngOnInit(): void {
    this.allTasks.watch().valueChanges.subscribe(({ data }) => {
      this.tasks = data.tasks;
    });
  }

  set selectedTask(task: Task | null) {
    this.countDownService.focusOn(task);
  }

  get selectedTask(): Task | null {
    return this.countDownService.taskFocused();
  }

  selectTask(event: MatSelectionListChange): void {
    this.selectedTask = event.options[0].value;
  }
}
