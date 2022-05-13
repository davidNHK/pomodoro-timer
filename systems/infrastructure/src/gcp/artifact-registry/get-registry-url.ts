import { artifactregistry } from '@pulumi/gcp';
import * as pulumi from '@pulumi/pulumi';

export function getRegistryUrl(repository: artifactregistry.Repository) {
  const gcpConfig = new pulumi.Config('gcp');
  const region = gcpConfig.require<string>('region');
  const project = gcpConfig.require<string>('project');
  return pulumi.interpolate`${region}-docker.pkg.dev/${project}/${repository.name}`;
}
