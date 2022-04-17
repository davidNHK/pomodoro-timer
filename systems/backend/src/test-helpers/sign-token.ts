import type { INestApplication } from '@nestjs/common';
import type { JwtSignOptions } from '@nestjs/jwt';
import type { TestingModule } from '@nestjs/testing';

import { AuthService } from '../auth/auth.service';
import { UserService } from '../user/user.service';

export async function signToken(
  module: TestingModule | INestApplication,
  signTokenOptions?: JwtSignOptions,
) {
  const authService = module.get<AuthService>(AuthService);
  const userService = module.get<UserService>(UserService);
  const userId = await userService.createUser({
    email: 'test@gmail.com',
    name: 'test',
  });
  const code = await authService.signTokenExchangeCode(userId);
  const { accessToken } = await authService.exchangeTokenFromCode(
    code,
    signTokenOptions,
  );
  return { accessToken };
}
