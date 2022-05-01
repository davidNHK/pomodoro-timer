import type {
  MockedRequest,
  ResponseComposition,
  ResponseResolver,
  RestContext,
  RestHandler,
} from 'msw';

export { MockedRequest };
export type MockedResponse = ResponseComposition;
export type MockHandler = ResponseResolver<MockedRequest, RestContext>;
export type MockContext = RestContext;

export interface Mock {
  mock?: RestHandler;
}

export interface Handler {
  resolve: MockHandler;
}
