import {
  Injectable,
  Logger,
  OnModuleDestroy,
  OnModuleInit,
} from '@nestjs/common';
import { setupServer, SetupServerApi } from 'msw/node';

import { MockHttpHandlersService } from './mock-http-handlers/mock-http-handlers.service';

@Injectable()
export class MockHttpService implements OnModuleInit, OnModuleDestroy {
  private server?: SetupServerApi;

  private logger = new Logger(MockHttpService.name);

  constructor(private mockHttpHandlersService: MockHttpHandlersService) {}

  onModuleInit() {
    const handlers = this.mockHttpHandlersService.handlers;

    this.server = setupServer(...handlers);
    this.server.listen({ onUnhandledRequest: 'error' });
  }

  onModuleDestroy(): any {
    this.server?.close();
  }
}
