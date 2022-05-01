import { Injectable } from '@angular/core';
import { Apollo, gql, Mutation, Query } from 'apollo-angular';
import type { MutationOptionsAlone } from 'apollo-angular/types';

export interface Task {
  completedPomodoro?: number;
  id: string;
  notes?: string;
  title: string;
  updatedAt?: string;
}

@Injectable({
  providedIn: 'root',
})
export class TodoGQL extends Query<{ taskOnFocus: Task; todo: Task[] }> {
  override document = gql`
    query todo {
      todo {
        id
        title
        notes
      }
      taskOnFocus {
        id
        title
        notes
        completedPomodoro
      }
    }
  `;
}

export interface AssignedTask {
  key: string;
  summaryText: string;
}

@Injectable({
  providedIn: 'root',
})
export class AssignedTaskGQL extends Query<{
  jiraAssignedTask: AssignedTask[];
}> {
  override document = gql`
    query assignedTask {
      jiraAssignedTask {
        id
        key
        summaryText
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

  constructor(private readonly todoGQL: TodoGQL, override apollo: Apollo) {
    super(apollo);
  }

  override mutate<V = any>(variables: V, options?: MutationOptionsAlone) {
    return super.mutate(variables, {
      ...options,
      awaitRefetchQueries: true,
      refetchQueries: [
        {
          query: this.todoGQL.document,
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

  constructor(private readonly todoGQL: TodoGQL, override apollo: Apollo) {
    super(apollo);
  }

  override mutate<V = any>(variables: V, options?: MutationOptionsAlone) {
    return super.mutate(variables, {
      ...options,
      refetchQueries: [
        {
          query: this.todoGQL.document,
        },
      ],
    });
  }
}

@Injectable({
  providedIn: 'root',
})
export class RecordPomodoroGQL extends Mutation {
  override document = gql`
    mutation ($taskId: ID!) {
      recordPomodoro(taskId: $taskId) {
        id
      }
    }
  `;

  constructor(private readonly todoGQL: TodoGQL, override apollo: Apollo) {
    super(apollo);
  }

  override mutate<V = any>(variables: V, options?: MutationOptionsAlone) {
    return super.mutate(variables, {
      ...options,
      awaitRefetchQueries: true,
      refetchQueries: [
        {
          query: this.todoGQL.document,
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

  constructor(private readonly todoGQL: TodoGQL, override apollo: Apollo) {
    super(apollo);
  }

  override mutate<V = any>(variables: V, options?: MutationOptionsAlone) {
    return super.mutate(variables, {
      ...options,
      refetchQueries: [
        {
          query: this.todoGQL.document,
        },
      ],
    });
  }
}
