import { createArtifactRegistry } from './gcp/artifact-registry';
import { createCloudRun } from './gcp/cloud-run/cloud-run';
import { createCloudStorage } from './gcp/cloud-storage/cloud-storage';
import { createFirebase } from './gcp/firebase';

createFirebase();
createCloudStorage();
createArtifactRegistry();
createCloudRun();
