import { describe, expect, it } from '@jest/globals';
import type { INestApplication } from '@nestjs/common';
import type { TestingModule } from '@nestjs/testing';
import gql from 'graphql-tag';

import { AuthService } from '../auth/auth.service';
import { getApolloServer } from '../test-helpers/get-apollo-server';
import { withNestServerContext } from '../test-helpers/nest-app-context';
import { UserService } from '../user/user.service';

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

async function signToken(module: TestingModule | INestApplication) {
  const authService = module.get<AuthService>(AuthService);
  const userService = module.get<UserService>(UserService);
  const userId = await userService.createUser({
    email: 'test@gmail.com',
    name: 'test',
  });
  const code = await authService.signTokenExchangeCode(userId);
  const { accessToken } = await authService.exchangeTokenFromCode(code);
  return { accessToken };
}

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
