import { describe, expect, it } from '@jest/globals';
import { Controller, Get, UseGuards } from '@nestjs/common';
import { Field, ID, ObjectType, Query, Resolver } from '@nestjs/graphql';
import { randomUUID } from 'crypto';
import gql from 'graphql-tag';

import { expectResponseCode } from '../test-helpers/expect-response-code';
import { getApolloServer } from '../test-helpers/get-apollo-server';
import { getRequestAgent } from '../test-helpers/get-request-agent';
import { withNestServerContext } from '../test-helpers/nest-app-context';
import { JwtAuthGuard } from './jwt-auth.guard';

@ObjectType()
class TestModel {
  @Field(() => ID)
  id!: string;
}

@Resolver(() => TestModel)
class TestResolver {
  @Query(() => TestModel)
  @UseGuards(JwtAuthGuard)
  testQuery() {
    return { id: randomUUID() };
  }
}

@Controller()
class TestController {
  @Get('/test/jwt-auth-guard')
  @UseGuards(JwtAuthGuard)
  public test() {
    return { status: 'OK' };
  }
}

const context = withNestServerContext({
  controllers: [TestController],
  providers: [TestResolver],
});

describe('Test JwtAuthGuard', () => {
  describe('rest', () => {
    it('should return 401 when no token is provided', async () => {
      const { body } = await getRequestAgent(context.app.getHttpServer())
        .get('/test/jwt-auth-guard')
        .expect(expectResponseCode({ expectedStatusCode: 401 }));
      expect(body.code).toStrictEqual('ERR_ACCESS_TOKEN');
    });

    it('should return 401 when wrong token is provided', async () => {
      const { body } = await getRequestAgent(context.app.getHttpServer())
        .get('/test/jwt-auth-guard')
        .set('Authorization', 'Bearer wrong-token')
        .expect(expectResponseCode({ expectedStatusCode: 401 }));
      expect(body.code).toStrictEqual('ERR_ACCESS_TOKEN');
    });
  });

  describe('graphql', () => {
    const SIMPLE_TEST_QUERY = gql`
      query Test {
        testQuery {
          id
        }
      }
    `;
    it('should show error code on extensions when missing token', async () => {
      const resp = await getApolloServer(context.app).executeOperation({
        query: SIMPLE_TEST_QUERY,
      });
      expect(resp.errors).toBeDefined();
      expect(resp.errors[0].extensions.code).toStrictEqual('ERR_ACCESS_TOKEN');
    });

    it('should show error code on extensions when given wrong token', async () => {
      const resp = await getApolloServer(context.app).executeOperation({
        query: SIMPLE_TEST_QUERY,
      });
      expect(resp.errors).toBeDefined();
      expect(resp.errors[0].extensions.code).toStrictEqual('ERR_ACCESS_TOKEN');
    });
  });
});
