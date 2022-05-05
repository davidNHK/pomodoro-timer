import { firebase } from '@pulumi/gcp';
import * as pulumi from '@pulumi/pulumi';
import kebabcase from 'lodash.kebabcase';

export function createFirebase() {
  const namePrefix = kebabcase(pulumi.getStack());
  return new firebase.Project(`${namePrefix}-firebase`);
}
