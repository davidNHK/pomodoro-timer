import * as pulumi from '@pulumi/pulumi';
import kebabcase from 'lodash.kebabcase';

export function getResourceNamePrefix(name?: string) {
  const projectConfig = new pulumi.Config('project');
  const projectName = projectConfig.require<string>('name');
  return name
    ? `${kebabcase(pulumi.getStack())}-${projectName}-${name}`
    : `${kebabcase(pulumi.getStack())}-${projectName}`;
}
