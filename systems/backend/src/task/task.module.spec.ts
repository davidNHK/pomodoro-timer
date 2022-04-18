import { describe, expect, it } from '@jest/globals';
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
});
