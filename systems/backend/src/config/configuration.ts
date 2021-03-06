import convict from 'convict';

import { AppEnvironment } from './config.constants';

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
  backend: {
    origin: {
      default: null,
      env: 'BACKEND_ORIGIN',
      format: String,
    },
  },
  connector: {
    atlassian: {
      clientId: {
        default: null,
        env: 'CONNECTOR_ATLASSIAN_CLIENT_ID',
        format: String,
      },
      clientSecret: {
        default: null,
        env: 'CONNECTOR_ATLASSIAN_CLIENT_SECRET',
        format: String,
      },
    },
  },
  env: {
    default: 'development',
    env: 'APP_ENV',
    format: Object.values(AppEnvironment),
  },
  frontend: {
    origin: {
      default: null,
      env: 'FRONTEND_ORIGIN',
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
  port: {
    default: 5333,
    env: 'APP_PORT',
    format: 'port',
  },
});

export function configuration() {
  configSchema.load({});
  configSchema.validate({
    allowed: 'strict',
  });

  return configSchema.getProperties();
}
