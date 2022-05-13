import * as pulumi from '@pulumi/pulumi';
import { expect } from 'chai';

import { getRegistryUrl } from './get-registry-url.js';

describe('#getRegistryUrl', () => {
  pulumi.runtime.setAllConfig({
    'gcp:project': 'europe-west2',
    'gcp:region': 'testing-123',
  });
  it('should prefix repository name with region and project name', done => {
    pulumi
      .all([
        getRegistryUrl({
          name: pulumi.Output.create('hello-world'),
        } as any),
      ])
      .apply(([registryUrl]) => {
        expect(registryUrl).to.equal(
          'testing-123-docker.pkg.dev/europe-west2/hello-world',
        );
        done();
      });
  });
});
