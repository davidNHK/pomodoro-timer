import { createArtifactRegistry } from './gcp/artifact-registry/artifact-registry.js';
import { getRegistryUrl } from './gcp/artifact-registry/get-registry-url.js';
import {
  createBackendCloudRun,
  createFrontendCloudRun,
} from './gcp/cloud-run/cloud-run.js';
import { getCloudRunUrl } from './gcp/cloud-run/get-cloud-run-url.js';

const registry = createArtifactRegistry();
const cloudRunBackendService = await createBackendCloudRun({
  repository: registry,
});
const cloudRunFrontendService = await createFrontendCloudRun({
  backendApi: cloudRunBackendService,
  repository: registry,
});

export const ARTIFACT_REGISTRY_URL = getRegistryUrl(registry);
export const CLOUD_RUN_BACKEND_URL = getCloudRunUrl(cloudRunBackendService);
export const CLOUD_RUN_FRONTEND_RUL = getCloudRunUrl(cloudRunFrontendService);
