import * as pulumi from '@pulumi/pulumi';
import kebabcase from 'lodash.kebabcase';

export function createCloudRun() {
  const namePrefix = kebabcase(pulumi.getStack());
  return namePrefix;
}
