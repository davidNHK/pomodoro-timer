import { Injectable } from '@angular/core';
import { gql, Mutation, Query } from 'apollo-angular';

interface Task {
  id: string;
  notes: string;
  title: string;
  updatedAt: string;
}

@Injectable({
  providedIn: 'root',
})
export class AllTasksGQL extends Query<{ tasks: Task[] }> {
  override document = gql`
    query allTasks {
      tasks {
        id
        title
        notes
      }
    }
  `;
}

@Injectable({
  providedIn: 'root',
})
export class CreateTaskGQL extends Mutation {
  override document = gql`
    mutation createTask($data: TaskInput!) {
      createTask(data: $data) {
        id
        title
      }
    }
  `;
}
