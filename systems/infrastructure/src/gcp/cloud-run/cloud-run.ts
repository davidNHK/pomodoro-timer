import { Image } from '@pulumi/docker';
import { artifactregistry, cloudrun, organizations } from '@pulumi/gcp';
import * as pulumi from '@pulumi/pulumi';
import { promises as fs } from 'fs';
import Handlebars from 'handlebars';
import kebabcase from 'lodash.kebabcase';
import path from 'path';

import { getRegistryUrl } from '../artifact-registry/get-registry-url.js';
import { serviceAccount } from '../google-credentials.js';
import { getCloudRunUrl } from './get-cloud-run-url.js';

const currentDir = path.parse(new URL(import.meta.url).pathname).dir;
export async function createFrontendCloudRun({
  backendApi,
  repository,
}: {
  backendApi: cloudrun.Service;
  repository: artifactregistry.Repository;
}) {
  const gcpConfig = new pulumi.Config('gcp');
  const projectConfig = new pulumi.Config('project');
  const region = gcpConfig.require<string>('region');
  const project = gcpConfig.require<string>('project');
  const projectName = projectConfig.require<string>('name');
  const namePrefix = `${kebabcase(pulumi.getStack())}-${projectName}`;
  const imageName = `${namePrefix}-simple-frontend-image`;
  const template = Handlebars.compile(
    await fs.readFile(path.join(currentDir, 'index.hbs'), 'utf-8'),
  );
  const image = getCloudRunUrl(backendApi).apply(async url => {
    const content = template({ endpoint: url });
    await fs.writeFile(path.join(currentDir, 'index.html'), content);
    return new Image(imageName, {
      build: {
        context: path.join(currentDir),
        dockerfile: path.join(currentDir, 'Dockerfile.frontend'),
        extraOptions: ['--quiet'],
      },
      imageName: pulumi.interpolate`${getRegistryUrl(repository)}/${imageName}`,
    });
  });

  const service = new cloudrun.Service(
    `${namePrefix}-cloud-run-frontend-service`,
    {
      location: region,
      project: project,
      template: {
        spec: {
          containers: [
            {
              image: image.imageName,
              ports: [
                {
                  containerPort: 80,
                },
              ],
            },
          ],
          serviceAccountName: serviceAccount,
        },
      },
      traffics: [{ percent: 100 }],
    },
  );
  const noAuthIAMPolicy = await organizations.getIAMPolicy({
    bindings: [{ members: ['allUsers'], role: 'roles/run.invoker' }],
  });

  new cloudrun.IamPolicy(`${namePrefix}-cloud-run-frontend-iam-policy`, {
    location: region,
    policyData: noAuthIAMPolicy.policyData,
    project,
    service: service.name,
  });
  return service;
}
export async function createBackendCloudRun({
  repository,
}: {
  repository: artifactregistry.Repository;
}) {
  const gcpConfig = new pulumi.Config('gcp');
  const projectConfig = new pulumi.Config('project');
  const region = gcpConfig.require<string>('region');
  const project = gcpConfig.require<string>('project');
  const projectName = projectConfig.require<string>('name');
  const namePrefix = `${kebabcase(pulumi.getStack())}-${projectName}`;
  const imageName = `${namePrefix}-simple-backend-image`;
  const image = new Image(imageName, {
    build: {
      context: path.join(currentDir),
      dockerfile: path.join(currentDir, 'Dockerfile'),
      extraOptions: ['--quiet'],
    },
    imageName: pulumi.interpolate`${getRegistryUrl(repository)}/${imageName}`,
  });

  const service = new cloudrun.Service(
    `${namePrefix}-cloud-run-backend-service`,
    {
      location: region,
      project: project,
      template: {
        spec: {
          containers: [
            {
              image: image.imageName,
              ports: [
                {
                  containerPort: 5000,
                },
              ],
            },
          ],
          serviceAccountName: serviceAccount,
        },
      },
      traffics: [{ percent: 100 }],
    },
  );
  const noAuthIAMPolicy = await organizations.getIAMPolicy({
    bindings: [{ members: ['allUsers'], role: 'roles/run.invoker' }],
  });

  new cloudrun.IamPolicy(`${namePrefix}-cloud-run-backend-iam-policy`, {
    location: region,
    policyData: noAuthIAMPolicy.policyData,
    project,
    service: service.name,
  });
  return service;
}
