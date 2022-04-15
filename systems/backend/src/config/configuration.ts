import convict from 'convict';

import { AppEnvironment, AppMode } from './config.constants';

convict.addFormat({
  coerce(val: any): any {
    return val.split(',');
  },
  name: 'comma-separated-value',
  validate(sources) {
    return Array.isArray(sources) && sources.length > 0;
  },
});

const configSchema = convict({
  env: {
    default: 'development',
    env: 'APP_ENV',
    format: Object.values(AppEnvironment),
  },
  frontend: {
    origin: {
      default: null,
      format: String,
    },
  },
  jwt: {
    secret: {
      default: null,
      env: 'JWT_SECRET',
      format: String,
    },
  },
  mode: {
    default: 'http',
    env: 'APP_MODE',
    format: Object.values(AppMode),
  },
  port: {
    default: 5333,
    env: 'PORT',
    format: 'port',
  },
});

export function configuration() {
  configSchema.load({
    frontend: {
      origin: 'http://localhost:4200',
    },
  });
  configSchema.validate({
    allowed: 'strict',
  });

  return configSchema.getProperties();
}
