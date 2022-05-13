import { artifactregistry } from '@pulumi/gcp';
import * as pulumi from '@pulumi/pulumi';
import kebabcase from 'lodash.kebabcase';

export function createArtifactRegistry() {
  const gcpConfig = new pulumi.Config('gcp');
  const projectConfig = new pulumi.Config('project');
  const projectName = projectConfig.require<string>('name');
  const region = gcpConfig.require<string>('region');
  const namePrefix = `${kebabcase(pulumi.getStack())}-${projectName}`;
  const repository = new artifactregistry.Repository(
    `${namePrefix}-docker-registry`,
    {
      format: 'DOCKER',
      location: region,
      repositoryId: `${namePrefix}-docker-registry`,
    },
  );

  return repository;
}
