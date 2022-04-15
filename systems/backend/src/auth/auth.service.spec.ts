import { describe, expect, it } from '@jest/globals';
import { JwtModule } from '@nestjs/jwt';
import { setTimeout } from 'timers/promises';

import { withNestModuleBuilderContext } from '../test-helpers/nest-app-context';
import { UserService } from '../user/user.service';
import { AuthService } from './auth.service';

const context = withNestModuleBuilderContext({
  imports: [
    JwtModule.register({ secret: 'secret', signOptions: { expiresIn: '1h' } }),
  ],
  providers: [AuthService, UserService],
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
    const userId = await userService.createUser({
      email: 'test@gmail.com',
      name: 'test',
    });
    const code = await authService.signTokenExchangeCode(userId);
    const { accessToken, refreshToken } =
      await authService.exchangeTokenFromCode(code);
    expect(accessToken).toBeDefined();
    expect(refreshToken).toBeDefined();
  });

  it('should get new access token when given refresh token is valid', async () => {
    const module = await context.moduleBuilder.compile();
    const authService = module.get<AuthService>(AuthService);
    const userService = module.get<UserService>(UserService);
    const userId = await userService.createUser({
      email: 'test@gmail.com',
      name: 'test',
    });
    const code = await authService.signTokenExchangeCode(userId);
    const { accessToken, refreshToken } =
      await authService.exchangeTokenFromCode(code);
    expect(accessToken).toBeDefined();
    expect(refreshToken).toBeDefined();
    await delay(500);
    const { accessToken: newAccessToken, refreshToken: newRefreshToken } =
      await authService.refreshAccessToken(refreshToken);
    expect(accessToken).not.toEqual(newAccessToken);
    expect(refreshToken).not.toEqual(newRefreshToken);
  });
});
