import { ApolloDriver, ApolloDriverConfig } from '@nestjs/apollo';
import { HttpStatus, MiddlewareConsumer, Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { APP_FILTER, APP_INTERCEPTOR } from '@nestjs/core';
import { GraphQLModule } from '@nestjs/graphql';
import { TerminusModule } from '@nestjs/terminus';

import { CommonModule } from './common/common.module';
import { RequestIdMiddleware } from './common/request-id.middleware';
import { RequestStartTimeMiddleware } from './common/request-start-time.middleware';
import { AppEnvironment } from './config/config.constants';
import { configuration } from './config/configuration';
import { getEnvFilePath } from './config/getEnvFilePath';
import { DatabaseModule } from './database/database.module';
import { GeneralExceptionFilter } from './error-hanlding/general-exception.filter';
import { GameGalleryModule } from './game-gallery/game-gallery.module';
import { HealthModule } from './health-check/health.module';
import { GeneralLoggingInterceptor } from './logging/general-logging.interceptor';
import { LoggingModule } from './logging/logging.module';
import { SeederModule } from './test-helpers/seeder/seeder.module';

@Module({
  controllers: [],
  imports: [
    ConfigModule.forRoot({
      envFilePath: getEnvFilePath(),
      load: [
        async () => {
          const value = await configuration();
          return value;
        },
      ],
    }),
    LoggingModule,
    DatabaseModule.forRoot(),
    CommonModule,
    GraphQLModule.forRootAsync<ApolloDriverConfig>({
      driver: ApolloDriver,
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: async (configService: ConfigService) => {
        const shouldGenerateSchemaFile = [AppEnvironment.DEV].includes(
          configService.get('env')!,
        );
        return {
          autoSchemaFile: !shouldGenerateSchemaFile ? true : 'schema.graphql',
          autoTransformHttpErrors: true,
          context: ({ req, res }) => ({
            req,
            res,
          }),
          formatResponse(response, context) {
            return {
              ...response,
              http: {
                ...context.response?.http,
                status: HttpStatus.OK,
              } as any,
            };
          },
          sortSchema: true,
        };
      },
    }),
    GameGalleryModule,
    TerminusModule,
    HealthModule,
    SeederModule,
  ],
  providers: [
    {
      provide: APP_FILTER,
      useClass: GeneralExceptionFilter,
    },
    {
      provide: APP_INTERCEPTOR,
      useClass: GeneralLoggingInterceptor,
    },
  ],
})
export class AppModule {
  configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(RequestStartTimeMiddleware, RequestIdMiddleware)
      .forRoutes('*');
  }
}
