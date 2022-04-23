import { Injectable } from '@angular/core';
import { Apollo, gql, Mutation, Query } from 'apollo-angular';
import type { MutationOptionsAlone } from 'apollo-angular/types';

export interface Task {
  id: string;
  notes?: string;
  title: string;
  updatedAt?: string;
}

@Injectable({
  providedIn: 'root',
})
export class AllTasksGQL extends Query<{ taskOnFocus: Task; tasks: Task[] }> {
  override document = gql`
    query allTasks($filter: QueryTasksFilterInput!) {
      tasks(filter: $filter) {
        id
        title
        notes
      }
      taskOnFocus {
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

  constructor(
    private readonly allTasksGQL: AllTasksGQL,
    override apollo: Apollo,
  ) {
    super(apollo);
  }

  override mutate<V = any>(variables: V, options?: MutationOptionsAlone) {
    return super.mutate(variables, {
      ...options,
      refetchQueries: [
        {
          query: this.allTasksGQL.document,
          variables: {
            filter: { statuses: ['PENDING', 'STARTED'] },
          },
        },
      ],
    });
  }
}

@Injectable({
  providedIn: 'root',
})
export class SetUserFocusTaskGQL extends Mutation {
  override document = gql`
    mutation focusOnTask($taskId: ID!) {
      focusOnTask(taskId: $taskId) {
        id
        title
      }
    }
  `;

  constructor(
    private readonly allTasksGQL: AllTasksGQL,
    override apollo: Apollo,
  ) {
    super(apollo);
  }

  override mutate<V = any>(variables: V, options?: MutationOptionsAlone) {
    return super.mutate(variables, {
      ...options,
      refetchQueries: [
        {
          query: this.allTasksGQL.document,
          variables: {
            filter: { statuses: ['PENDING', 'STARTED'] },
          },
        },
      ],
    });
  }
}

@Injectable({
  providedIn: 'root',
})
export class FinishFocusedTaskGQL extends Mutation {
  override document = gql`
    mutation finishFocusingTask($taskId: ID!) {
      finishFocusingTask(taskId: $taskId) {
        id
        title
      }
    }
  `;

  constructor(
    private readonly allTasksGQL: AllTasksGQL,
    override apollo: Apollo,
  ) {
    super(apollo);
  }

  override mutate<V = any>(variables: V, options?: MutationOptionsAlone) {
    return super.mutate(variables, {
      ...options,
      refetchQueries: [
        {
          query: this.allTasksGQL.document,
          variables: {
            filter: { statuses: ['PENDING', 'STARTED'] },
          },
        },
      ],
    });
  }
}
