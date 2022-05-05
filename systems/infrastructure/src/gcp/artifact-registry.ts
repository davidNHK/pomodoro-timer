import * as pulumi from '@pulumi/pulumi';
import kebabcase from 'lodash.kebabcase';

export function createArtifactRegistry() {
  const namePrefix = kebabcase(pulumi.getStack());
  return namePrefix;
}
