import { artifactregistry } from '@pulumi/gcp';
import * as pulumi from '@pulumi/pulumi';

import { getResourceNamePrefix } from '../get-resource-name-prefix.js';

export function createArtifactRegistry() {
  const gcpConfig = new pulumi.Config('gcp');
  const region = gcpConfig.require<string>('region');
  return new artifactregistry.Repository(
    getResourceNamePrefix('docker-registry'),
    {
      format: 'DOCKER',
      location: region,
      repositoryId: getResourceNamePrefix('docker-registry'),
    },
  );
}
