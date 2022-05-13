import * as pulumi from '@pulumi/pulumi';
import { expect } from 'chai';

import { getCloudRunUrl } from './get-cloud-run-url.js';

describe('#getCloudRunUrl', () => {
  it('should return first url', done => {
    pulumi
      .all([
        getCloudRunUrl({
          statuses: pulumi.Output.create([
            { url: 'https://www.hello-world.com' },
          ]),
        } as any),
      ])
      .apply(([cloudRunUrl]) => {
        expect(cloudRunUrl).to.equal('https://www.hello-world.com');
        done();
      });
  });
});
