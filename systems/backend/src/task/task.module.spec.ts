import { describe, expect, it } from '@jest/globals';
import { randomUUID } from 'crypto';
import gql from 'graphql-tag';

import { getApolloServer } from '../test-helpers/get-apollo-server';
import { withNestServerContext } from '../test-helpers/nest-app-context';
import { signToken } from '../test-helpers/sign-token';

const appContext = withNestServerContext({
  imports: [],
});

const GET_ALL_TASKS = gql`
  query allTasks {
    tasks {
      id
      title
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

describe('Task Resolvers', () => {
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
      query: GET_ALL_TASKS,
    });
    expect(resp.errors).toBeUndefined();
    expect(JSON.parse(JSON.stringify(resp.data?.['tasks']))).toStrictEqual([
      {
        id: expect.any(String),
        title: 'test1',
      },
      {
        id: expect.any(String),
        title: 'test2',
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
    expect(errors[0].extensions.code).toEqual('ERR_VALIDATION');
  });
});
