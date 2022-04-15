import { describe, expect, it } from '@jest/globals';
import { getApolloServer } from '@nestjs/apollo';
import gql from 'graphql-tag';

import { withNestServerContext } from '../test-helpers/nest-app-context';

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
  it('get all tasks', async () => {
    const app = appContext.app;
    const server = getApolloServer(app);

    const resp = await server.executeOperation({
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
