import { describe, expect, it } from '@jest/globals';
import { randomUUID } from 'crypto';
import gql from 'graphql-tag';

import { getApolloServer } from '../test-helpers/get-apollo-server';
import { getGraphqlErrorCodes } from '../test-helpers/get-graphql-error';
import { withNestServerContext } from '../test-helpers/nest-app-context';
import { signToken } from '../test-helpers/sign-token';

const appContext = withNestServerContext({
  imports: [],
});

const TODO = gql`
  query todo {
    todo {
      id
      title
      status
      completedPomodoro
    }
  }
`;

const GET_ALL_TASKS = gql`
  query allTasks {
    tasks {
      id
      title
      status
      completedPomodoro
    }
  }
`;

const FILTER_TASKS = gql`
  query allTasks($filter: QueryTasksFilterInput!) {
    tasks(filter: $filter) {
      id
      title
      status
      completedPomodoro
    }
  }
`;

const CREATE_TASK = gql`
  mutation createTask($data: TaskInput!) {
    createTask(data: $data) {
      id
      title
    }
  }
`;

const START_FOCUS_ON_TASK = gql`
  mutation startFocusOnTask($taskId: ID!) {
    focusOnTask(taskId: $taskId) {
      id
      title
    }
  }
`;

const TASK_ON_FOCUS = gql`
  query taskOnFocus {
    taskOnFocus {
      id
      title
    }
  }
`;

const FINISH_FOCUSING_TASK = gql`
  mutation finishFocusingTask($taskId: ID!) {
    finishFocusingTask(taskId: $taskId) {
      id
      title
    }
  }
`;

const RECORD_POMODORO_TO_TASK = gql`
  mutation ($taskId: ID!) {
    recordPomodoro(taskId: $taskId) {
      id
    }
  }
`;

describe('Task Resolvers', () => {
  it('should only response pending and started task', async () => {
    const app = appContext.app;
    const { accessToken } = await signToken(app);
    const server = getApolloServer(app);
    await server.executeOperation({
      http: { headers: { authorization: `Bearer ${accessToken}` } },
      query: CREATE_TASK,
      variables: {
        data: {
          title: 'test1',
        },
      },
    });
    const {
      data: { createTask: createdTaskB },
    } = await server.executeOperation({
      http: { headers: { authorization: `Bearer ${accessToken}` } },
      query: CREATE_TASK,
      variables: {
        data: {
          title: 'test2',
        },
      },
    });
    const {
      data: { createTask: createdTaskC },
    } = await server.executeOperation({
      http: { headers: { authorization: `Bearer ${accessToken}` } },
      query: CREATE_TASK,
      variables: {
        data: {
          title: 'test3',
        },
      },
    });
    await server.executeOperation({
      http: { headers: { authorization: `Bearer ${accessToken}` } },
      query: START_FOCUS_ON_TASK,
      variables: {
        taskId: createdTaskB.id,
      },
    });
    await server.executeOperation({
      http: { headers: { authorization: `Bearer ${accessToken}` } },
      query: START_FOCUS_ON_TASK,
      variables: {
        taskId: createdTaskC.id,
      },
    });
    await server.executeOperation({
      http: { headers: { authorization: `Bearer ${accessToken}` } },
      query: FINISH_FOCUSING_TASK,
      variables: {
        taskId: createdTaskB.id,
      },
    });
    const {
      data: { tasks: allTasks },
    } = await server.executeOperation({
      http: { headers: { authorization: `Bearer ${accessToken}` } },
      query: GET_ALL_TASKS,
    });

    const {
      data: { todo: taskTodo },
    } = await server.executeOperation({
      http: { headers: { authorization: `Bearer ${accessToken}` } },
      query: TODO,
    });

    expect(allTasks).toHaveLength(3);
    expect(taskTodo).toHaveLength(2);
  });

  it('should get created tasks when call query after mutation', async () => {
    const app = appContext.app;
    const { accessToken } = await signToken(app);
    const server = getApolloServer(app);
    await server.executeOperation({
      http: { headers: { authorization: `Bearer ${accessToken}` } },
      query: CREATE_TASK,
      variables: {
        data: {
          title: 'test1',
        },
      },
    });
    await server.executeOperation({
      http: { headers: { authorization: `Bearer ${accessToken}` } },
      query: CREATE_TASK,
      variables: {
        data: {
          notes: `
Hello
World
Foo Bar
          `,
          title: 'test2',
        },
      },
    });
    const resp = await server.executeOperation({
      http: { headers: { authorization: `Bearer ${accessToken}` } },
      query: FILTER_TASKS,
      variables: {
        filter: {
          statuses: ['PENDING'],
        },
      },
    });
    expect(resp.errors).toBeUndefined();
    expect(JSON.parse(JSON.stringify(resp.data?.['tasks']))).toStrictEqual([
      {
        completedPomodoro: 0,
        id: expect.any(String),
        status: 'PENDING',
        title: 'test2',
      },
      {
        completedPomodoro: 0,
        id: expect.any(String),
        status: 'PENDING',
        title: 'test1',
      },
    ]);
  });

  it('should get task on focus when call query after mutation', async () => {
    const app = appContext.app;
    const { accessToken } = await signToken(app);
    const server = getApolloServer(app);
    const { data } = await server.executeOperation({
      http: { headers: { authorization: `Bearer ${accessToken}` } },
      query: CREATE_TASK,
      variables: {
        data: {
          title: 'test1',
        },
      },
    });
    const taskId = data.createTask.id;
    await server.executeOperation({
      http: { headers: { authorization: `Bearer ${accessToken}` } },
      query: START_FOCUS_ON_TASK,
      variables: {
        taskId,
      },
    });
    const {
      data: { taskOnFocus },
    } = await server.executeOperation({
      http: { headers: { authorization: `Bearer ${accessToken}` } },
      query: TASK_ON_FOCUS,
    });

    expect(taskOnFocus.id).toEqual(taskId);
  });

  it('should throw error on focus when given taskId not exist', async () => {
    const app = appContext.app;
    const { accessToken } = await signToken(app);
    const server = getApolloServer(app);
    const taskId = randomUUID();
    const { errors } = await server.executeOperation({
      http: { headers: { authorization: `Bearer ${accessToken}` } },
      query: START_FOCUS_ON_TASK,
      variables: {
        taskId,
      },
    });

    expect(errors).toBeDefined();
    expect(errors?.[0].extensions['code']).toEqual('ERR_TASK_NOT_FOUND');
  });

  it('should increase pomodoro when call mutation', async () => {
    const app = appContext.app;
    const { accessToken } = await signToken(app);
    const server = getApolloServer(app);
    const { data } = await server.executeOperation({
      http: { headers: { authorization: `Bearer ${accessToken}` } },
      query: CREATE_TASK,
      variables: {
        data: {
          title: 'test1',
        },
      },
    });

    const taskId = data.createTask.id;
    await server.executeOperation({
      http: { headers: { authorization: `Bearer ${accessToken}` } },
      query: START_FOCUS_ON_TASK,
      variables: {
        taskId,
      },
    });
    await server.executeOperation({
      http: { headers: { authorization: `Bearer ${accessToken}` } },
      query: RECORD_POMODORO_TO_TASK,
      variables: {
        taskId,
      },
    });

    const {
      data: { tasks: startedTasks },
    } = await server.executeOperation({
      http: { headers: { authorization: `Bearer ${accessToken}` } },
      query: FILTER_TASKS,
      variables: {
        filter: {
          statuses: ['STARTED'],
        },
      },
    });

    expect(startedTasks).toHaveLength(1);
    expect(startedTasks[0].completedPomodoro).toEqual(1);
  });

  it('should error when try increase pomodoro for task that status not started', async () => {
    const app = appContext.app;
    const { accessToken } = await signToken(app);
    const server = getApolloServer(app);
    const { data } = await server.executeOperation({
      http: { headers: { authorization: `Bearer ${accessToken}` } },
      query: CREATE_TASK,
      variables: {
        data: {
          title: 'test1',
        },
      },
    });

    const taskId = data.createTask.id;
    const { errors } = await server.executeOperation({
      http: { headers: { authorization: `Bearer ${accessToken}` } },
      query: RECORD_POMODORO_TO_TASK,
      variables: {
        taskId,
      },
    });
    expect(errors).toBeDefined();
    expect(getGraphqlErrorCodes(errors)).toStrictEqual(['ERR_TASK_NOT_FOUND']);
  });

  it('should mark task as finished when call mutation', async () => {
    const app = appContext.app;
    const { accessToken } = await signToken(app);
    const server = getApolloServer(app);
    const { data } = await server.executeOperation({
      http: { headers: { authorization: `Bearer ${accessToken}` } },
      query: CREATE_TASK,
      variables: {
        data: {
          title: 'test1',
        },
      },
    });

    const taskId = data.createTask.id;
    await server.executeOperation({
      http: { headers: { authorization: `Bearer ${accessToken}` } },
      query: START_FOCUS_ON_TASK,
      variables: {
        taskId,
      },
    });
    await server.executeOperation({
      http: { headers: { authorization: `Bearer ${accessToken}` } },
      query: FINISH_FOCUSING_TASK,
      variables: {
        taskId,
      },
    });

    const {
      data: { tasks: doneTasks },
    } = await server.executeOperation({
      http: { headers: { authorization: `Bearer ${accessToken}` } },
      query: FILTER_TASKS,
      variables: {
        filter: {
          statuses: ['DONE'],
        },
      },
    });

    expect(doneTasks).toHaveLength(1);
  });
});
