import { describe, expect, it } from '@jest/globals';
import { getApolloServer } from '@nestjs/apollo';
import { Controller, Get, ImATeapotException } from '@nestjs/common';
import { Field, ID, ObjectType, Query, Resolver } from '@nestjs/graphql';
import { ApolloError } from 'apollo-server-errors';
import gql from 'graphql-tag';

import { expectResponseCode } from '../test-helpers/expect-response-code';
import { getRequestAgent } from '../test-helpers/get-request-agent';
import { withNestServerContext } from '../test-helpers/nest-app-context';

@ObjectType()
class TestModel {
  @Field(() => ID)
  id!: string;
}

@Resolver(() => TestModel)
class TestResolver {
  @Query(() => TestModel)
  testQuery() {
    throw new Error('Fake Error!!!');
  }

  @Query(() => TestModel)
  testQueryWithApolloError() {
    throw new ApolloError('Foobar', 'ERR_CREATE_RECORD');
  }
}

@Controller('/test-case')
class TestController {
  @Get('/unexpected-error')
  getUnexpectedError() {
    throw new Error('Fake Error!!!');
  }

  @Get('/418')
  get418() {
    throw new ImATeapotException({
      code: 'ERR_TEA_POT_IS_HOT',
      errors: ['Foobar'],
      meta: {},
    });
  }
}

const appContext = withNestServerContext({
  controllers: [TestController],
  imports: [],
  providers: [TestResolver],
});

describe('General exception filter', () => {
  describe('rest', () => {
    it('should response code ERR_UNHANDLED when endpoint response generic error', async () => {
      const app = appContext.app;
      const { body } = await getRequestAgent(app.getHttpServer())
        .get('/test-case/unexpected-error')
        .expect(expectResponseCode({ expectedStatusCode: 500 }));
      expect(body).toStrictEqual({
        code: 'ERR_UNHANDLED',
        errors: ['Fake Error!!!'],
        meta: {
          exception: {
            message: 'Fake Error!!!',
            name: 'Error',
          },
        },
        stack: expect.any(String),
      });
    });
    it('should forward response code when endpoint have specific error code', async () => {
      const app = appContext.app;
      const { body } = await getRequestAgent(app.getHttpServer())
        .get('/test-case/418')
        .expect(expectResponseCode({ expectedStatusCode: 418 }));
      expect(body).toStrictEqual({
        code: 'ERR_TEA_POT_IS_HOT',
        errors: ['Foobar'],
        meta: {},
        stack: expect.any(String),
      });
    });
  });

  describe('graphql', () => {
    it('query graphql endpoint that throw unknown error', async () => {
      const app = appContext.app;
      const server = getApolloServer(app);
      const UNDEFINED = gql`
        query Test {
          testQuery {
            id
          }
        }
      `;
      const resp = await server.executeOperation({
        query: UNDEFINED,
      });
      expect(resp.errors).toBeDefined();
      expect(resp.errors).toStrictEqual([
        {
          extensions: {
            code: 'ERR_UNHANDLED',
            errors: [],
          },
          locations: [
            {
              column: 3,
              line: 2,
            },
          ],
          message: 'Fake Error!!!',
          path: ['testQuery'],
        },
      ]);
    });
    it('query graphql endpoint that throw apollo error', async () => {
      const app = appContext.app;
      const server = getApolloServer(app);
      const UNDEFINED = gql`
        query Test {
          testQueryWithApolloError {
            id
          }
        }
      `;
      const resp = await server.executeOperation({
        query: UNDEFINED,
      });
      expect(resp.errors).toBeDefined();
      expect(resp.errors).toStrictEqual([
        {
          extensions: {
            code: 'ERR_CREATE_RECORD',
          },
          locations: [
            {
              column: 3,
              line: 2,
            },
          ],
          message: 'Foobar',
          path: ['testQueryWithApolloError'],
        },
      ]);
    });
  });
});
