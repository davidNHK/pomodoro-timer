import { describe, expect, it } from '@jest/globals';
import { JwtModule } from '@nestjs/jwt';
import { setTimeout } from 'timers/promises';

import { DatabaseModule } from '../database/database.module';
import { UnauthorizedException } from '../error-hanlding/unauthorized.exception';
import { withNestModuleBuilderContext } from '../test-helpers/nest-app-context';
import { UserModule } from '../user/user.module';
import { UserService } from '../user/user.service';
import { AuthService } from './auth.service';
import { RefreshTokenRepository } from './refresh-token.repository';
import { TokenExchangeCodeRepository } from './token-exchange-code.repository';

const context = withNestModuleBuilderContext({
  imports: [
    DatabaseModule.forFeature(),
    JwtModule.register({ secret: 'secret', signOptions: { expiresIn: '1h' } }),
    UserModule,
  ],
  providers: [RefreshTokenRepository, TokenExchangeCodeRepository, AuthService],
});

describe('AuthService', () => {
  function delay(ms: number) {
    return setTimeout(ms);
  }
  it('should sign token exchange code when to given user id', async () => {
    const module = await context.moduleBuilder.compile();
    const service = module.get<AuthService>(AuthService);
    await expect(service.signTokenExchangeCode('test')).resolves.toBeDefined();
  });

  it('should create token pair when given code valid', async () => {
    const module = await context.moduleBuilder.compile();
    const authService = module.get<AuthService>(AuthService);
    const userService = module.get<UserService>(UserService);
    const user = await userService.createUser({
      email: 'test@gmail.com',
      name: 'test',
    });
    const code = await authService.signTokenExchangeCode(user.id);
    const { accessToken, refreshToken } =
      await authService.exchangeTokenFromCode(code);
    expect(accessToken).toBeDefined();
    expect(refreshToken).toBeDefined();
  });

  it('should throw error when given code related to userId not exist', async () => {
    const module = await context.moduleBuilder.compile();
    const authService = module.get<AuthService>(AuthService);
    const code = await authService.signTokenExchangeCode('hello-world');
    await expect(authService.exchangeTokenFromCode(code)).rejects.toThrow(
      UnauthorizedException,
    );
  });

  it('should get new access token when given refresh token is valid', async () => {
    const module = await context.moduleBuilder.compile();
    const authService = module.get<AuthService>(AuthService);
    const userService = module.get<UserService>(UserService);
    const user = await userService.createUser({
      email: 'test@gmail.com',
      name: 'test',
    });
    const code = await authService.signTokenExchangeCode(user.id);
    const { accessToken, refreshToken } =
      await authService.exchangeTokenFromCode(code);
    expect(accessToken).toBeDefined();
    expect(refreshToken).toBeDefined();
    await delay(1000);
    const { accessToken: newAccessToken, refreshToken: newRefreshToken } =
      await authService.refreshAccessToken(refreshToken);
    expect(accessToken).not.toEqual(newAccessToken);
    expect(refreshToken).not.toEqual(newRefreshToken);
  });
});
