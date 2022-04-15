import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';

import { UserModule } from '../user/user.module';
import { AtlassianController } from './atlassian.controller';
import { AtlassianStrategy } from './atlassian.strategy';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { SessionStore } from './session.store';

@Module({
  controllers: [AtlassianController, AuthController],
  imports: [
    ConfigModule,
    PassportModule,
    UserModule,
    JwtModule.registerAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: async (configService: ConfigService) => ({
        secret: configService.get('jwt.secret'),
        signOptions: { expiresIn: '15m' },
      }),
    }),
  ],
  providers: [AtlassianStrategy, SessionStore, AuthService],
})
export class AuthModule {}
