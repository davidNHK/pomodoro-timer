import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import type { MatSelectionListChange } from '@angular/material/list';

import { AssignedTask, AssignedTaskGQL } from '../graphql';

@Component({
  selector: 'app-jira-assigned-task',
  styleUrls: ['./jira-assigned-task-list.component.css'],
  templateUrl: './jira-assigned-task-list.component.html',
})
export class JiraAssignedTaskListComponent implements OnInit {
  @Output() selectJiraTask = new EventEmitter<AssignedTask>();

  selectedJiraTask?: AssignedTask;

  loading = false;

  jiraAssignedTasks: AssignedTask[] = [];

  constructor(private assignedTask: AssignedTaskGQL) {}

  ngOnInit(): void {
    this.loading = true;
    this.assignedTask
      .fetch({}, { fetchPolicy: 'network-only' })
      .subscribe(({ data, errors, loading }) => {
        this.loading = loading;
        if (!loading && !errors) {
          this.jiraAssignedTasks = data.jiraAssignedTask;
        }
      });
  }

  selectTask(event: MatSelectionListChange) {
    this.selectJiraTask.emit(event.options[0].value);
    this.selectedJiraTask = event.options[0].value;
  }
}
