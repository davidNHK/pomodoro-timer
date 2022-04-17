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

describe('Task Resolvers', () => {
  it('should get all tasks', async () => {
    const app = appContext.app;
    const { accessToken } = await signToken(app);
    const server = getApolloServer(app);
    const resp = await server.executeOperation({
      http: { headers: { authorization: `Bearer ${accessToken}` } },
      query: GET_ALL_TASKS,
    });
    expect(resp.errors).toBeUndefined();
    expect(JSON.parse(JSON.stringify(resp.data?.['tasks']))).toStrictEqual([
      {
        id: '1',
        title: 'Task 1',
      },
      {
        id: '2',
        title: 'Task 2',
      },
    ]);
  });
});
