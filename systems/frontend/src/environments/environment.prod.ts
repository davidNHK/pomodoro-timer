// File generate on CI
import dynamic from './dynamic.json';

const dynamicJSON = dynamic as any;

export const environment = {
  apiUrl: dynamicJSON['CLOUD_RUN_BACKEND_URL'],
  production: true,
};
