import { HttpModule } from '@nestjs/axios';
import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';

import { DatabaseModule } from '../database/database.module';
import { UserModule } from '../user/user.module';
import { AtlassianController } from './atlassian.controller';
import { AtlassianStrategy, AtlassianTokenService } from './atlassian.strategy';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { JwtStrategy } from './jwt.strategy';
import { RefreshTokenRepository } from './refresh-token.repository';
import { SessionStore } from './session.store';
import { TokenExchangeCodeRepository } from './token-exchange-code.repository';

@Module({
  controllers: [AtlassianController, AuthController],
  exports: [AtlassianTokenService],
  imports: [
    ConfigModule,
    PassportModule,
    UserModule,
    HttpModule,
    DatabaseModule.forFeature(),
    JwtModule.registerAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: async (configService: ConfigService) => ({
        secret: configService.get('jwt.secret'),
        signOptions: { expiresIn: '15m' },
      }),
    }),
  ],
  providers: [
    TokenExchangeCodeRepository,
    RefreshTokenRepository,
    AtlassianStrategy,
    SessionStore,
    AuthService,
    JwtStrategy,
    AtlassianTokenService,
  ],
})
export class AuthModule {}
