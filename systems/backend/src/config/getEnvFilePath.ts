import { AppEnvironment } from './config.constants';

export function getEnvFilePath() {
  const nodeEnv =
    (process.env['APP_ENV'] as AppEnvironment) ?? AppEnvironment.DEV;
  if (nodeEnv === AppEnvironment.DEV) {
    return '.env.development';
  }

  if ([AppEnvironment.TEST, AppEnvironment.CI_TEST].includes(nodeEnv)) {
    return '.env.test';
  }

  return '.env';
}
