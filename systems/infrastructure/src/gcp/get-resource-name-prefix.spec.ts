import * as pulumi from '@pulumi/pulumi';
import { expect } from 'chai';

import { getResourceNamePrefix } from './get-resource-name-prefix.js';

describe('#getResourceNamePrefix', () => {
  pulumi.runtime.setConfig('project:name', 'testing');
  pulumi.runtime.setMocks(
    {
      call() {
        return {};
      },
      newResource() {
        return { id: '', state: {} };
      },
    },
    'project',
    'test',
  );
  it('should get name prefix', done => {
    pulumi.all([getResourceNamePrefix()]).apply(([namePrefix]) => {
      expect(namePrefix).to.equal('test-testing');
      done();
    });
  });

  it('should concat name prefix and resource name when name is given', done => {
    pulumi.all([getResourceNamePrefix('hello')]).apply(([namePrefix]) => {
      expect(namePrefix).to.equal('test-testing-hello');
      done();
    });
  });
});
